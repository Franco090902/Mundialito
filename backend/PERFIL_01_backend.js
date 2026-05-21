// ══════════════════════════════════════════════════════════════════
// PERFIL_01_backend.js
// ARCHIVO: backend/server.js
// DÓNDE: pegar ANTES del app.listen(PORT, ...)
//
// QUÉ AGREGA:
//   GET  /api/perfil/:userId       → leer perfil público
//   PUT  /api/perfil/:userId       → actualizar username / avatar_url
//   POST /api/perfil/:userId/avatar → subir imagen de avatar a Supabase Storage
//   GET  /api/perfil/:userId/stats  → estadísticas del prode del usuario
// ══════════════════════════════════════════════════════════════════


// ── Multer: middleware para recibir archivos (imágenes) en Express ──
// Usamos memoryStorage: el archivo queda en RAM como Buffer,
// nunca se escribe en disco del servidor. Lo subimos directo a Supabase.
const multer  = require('multer');
const upload  = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 2 * 1024 * 1024 }, // 2 MB máximo
  fileFilter: (req, file, cb) => {
    // Solo aceptar imágenes
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se permiten imágenes.'));
  }
});


// ──────────────────────────────────────────────────────────────────
// GET /api/perfil/:userId
// Devuelve el perfil público de un usuario.
// No requiere autenticación (es info pública del ranking).
// ──────────────────────────────────────────────────────────────────
app.get('/api/perfil/:userId', async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, puntos_prode, aciertos_exactos, aciertos_signo, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Perfil no encontrado.' });
  res.json(data);
});


// ──────────────────────────────────────────────────────────────────
// PUT /api/perfil/:userId
// Actualiza username y/o avatar_url.
// Body JSON: { username, avatar_url }
//
// VALIDACIONES:
//   - username: 3-20 caracteres, solo letras, números y guiones bajos
//   - No permite username ya usado por otro usuario (unique check)
// ──────────────────────────────────────────────────────────────────
app.put('/api/perfil/:userId', async (req, res) => {
  const { userId }               = req.params;
  const { username, avatar_url } = req.body;

  // Validar formato del username
  if (username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        error: 'El username debe tener 3-20 caracteres. Solo letras, números y guión bajo.'
      });
    }

    // Verificar que no esté tomado por otro usuario
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', userId)   // excluir el propio usuario
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Ese username ya está en uso.' });
    }
  }

  // Construir objeto de actualización solo con los campos enviados
  const updates = { updated_at: new Date().toISOString() };
  if (username)   updates.username   = username;
  if (avatar_url) updates.avatar_url = avatar_url;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


// ──────────────────────────────────────────────────────────────────
// POST /api/perfil/:userId/avatar
// Recibe una imagen (multipart/form-data), la sube a Supabase Storage
// en el bucket "avatars" y devuelve la URL pública.
//
// FLUJO:
//   Browser → multer (buffer en RAM) → Supabase Storage → URL pública
//
// El bucket "avatars" debe existir en Supabase Storage (ver PASO 4).
// ──────────────────────────────────────────────────────────────────
app.post('/api/perfil/:userId/avatar', upload.single('avatar'), async (req, res) => {
  const { userId } = req.params;

  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' });

  // Nombre del archivo: userId + extensión. El upsert sobreescribe el anterior.
  const ext      = req.file.mimetype.split('/')[1]; // 'jpeg', 'png', 'webp'
  const fileName = `${userId}.${ext}`;

  // Subir a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert:      true,  // sobreescribir si ya existe
    });

  if (uploadError) return res.status(500).json({ error: uploadError.message });

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Actualizar avatar_url en la tabla profiles también
  await supabase
    .from('profiles')
    .update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() })
    .eq('id', userId);

  res.json({ avatar_url: urlData.publicUrl });
});


// ──────────────────────────────────────────────────────────────────
// GET /api/perfil/:userId/stats
// Devuelve el historial completo del prode de un usuario:
//   - Todos sus pronósticos con resultado del partido
//   - Puntos obtenidos por partido
//   - Posición en el ranking global
//
// CONCEPTO — Por qué hacemos el JOIN aquí y no en el frontend:
//   El frontend solo recibe datos limpios y listos para mostrar.
//   Toda la lógica de DB (JOINs, ordenamiento) queda en el backend.
// ──────────────────────────────────────────────────────────────────
app.get('/api/perfil/:userId/stats', async (req, res) => {
  const { userId } = req.params;

  // 1. Historial de pronósticos con datos del partido
  const { data: historial, error: errHistorial } = await supabase
    .from('prode_predictions')
    .select(`
      pred_goles_local,
      pred_goles_visitante,
      puntos_obtenidos,
      created_at,
      partidos (
        equipo_local,
        equipo_visitante,
        goles_local,
        goles_visitante,
        estado,
        fecha_utc
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (errHistorial) return res.status(500).json({ error: errHistorial.message });

  // 2. Posición en el ranking global
  // Contamos cuántos usuarios tienen MÁS puntos que este usuario
  const { data: perfilActual } = await supabase
    .from('profiles')
    .select('puntos_prode')
    .eq('id', userId)
    .single();

  let posicion = null;
  if (perfilActual) {
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gt('puntos_prode', perfilActual.puntos_prode);

    posicion = (count || 0) + 1; // posición = usuarios con más puntos + 1
  }

  // 3. Calcular racha actual (partidos consecutivos con puntos)
  let racha = 0;
  if (historial) {
    for (const p of historial) {
      if (p.puntos_obtenidos > 0) racha++;
      else break;
    }
  }

  res.json({
    historial:   historial || [],
    posicion,
    racha,
    total_partidos: historial?.length || 0,
  });
});
