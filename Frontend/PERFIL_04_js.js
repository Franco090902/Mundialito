/* ══════════════════════════════════════════════════════════════════
   PERFIL_04_js.js
   ARCHIVO: Frontend/app.js
   DÓNDE: pegar al final del archivo

   TAMBIÉN:
   En tu función switchTab() existente, agregá este caso:
     if (id === 'perfil') perfilCargar();
   ══════════════════════════════════════════════════════════════════ */

const PERFIL_API = 'http://localhost:3000'; // Mismo que CHATBOT_BACKEND_URL


// ══════════════════════════════════════════════════════════════════
// perfilCargar()
// Punto de entrada principal. Se llama cuando el usuario abre
// la solapa "Mi Perfil".
//
// FLUJO:
//   1. Toma los datos de currentUser y currentProfile (ya en memoria
//      gracias a auth.js, que los carga al iniciar sesión)
//   2. Rellena el hero con esos datos inmediatamente (sin esperar red)
//   3. Luego hace fetch al backend para las stats (historial, posición)
// ══════════════════════════════════════════════════════════════════
async function perfilCargar() {
  // currentUser y currentProfile vienen de auth.js (ya están en memoria)
  const user    = window.currentUser;
  const profile = window.currentProfile;

  if (!user || !profile) {
    // Si no hay sesión, redirigir al login
    document.getElementById('modal-auth')?.classList.add('active');
    return;
  }

  // ── 1. Rellenar datos inmediatos (sin fetch) ──────────────────────
  const avatarImg = document.getElementById('perfil-avatar-img');
  if (avatarImg) {
    avatarImg.src = profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}&background=00AA55&color=fff&size=100`;
  }

  const usernameEl = document.getElementById('perfil-username-texto');
  if (usernameEl) usernameEl.textContent = profile.username || '—';

  const emailEl = document.getElementById('perfil-email-texto');
  if (emailEl) emailEl.textContent = user.email || '—';

  const miembroEl = document.getElementById('perfil-miembro-desde');
  if (miembroEl && profile.created_at) {
    const fecha = new Date(profile.created_at).toLocaleDateString('es-AR', {
      year: 'month', month: 'long', day: 'numeric'
    });
    miembroEl.textContent = `Miembro desde ${fecha}`;
  }

  // Stats básicas (ya en el profile de memoria)
  perfilActualizarStatDOM('perfil-stat-pts',     profile.puntos_prode    || 0);
  perfilActualizarStatDOM('perfil-stat-exactos',  profile.aciertos_exactos || 0);

  // ── 2. Fetch de stats completas al backend ────────────────────────
  try {
    const res   = await fetch(`${PERFIL_API}/api/perfil/${user.id}/stats`);
    const stats = await res.json();

    if (!stats.error) {
      perfilActualizarStatDOM('perfil-stat-pos',   stats.posicion || '—');
      perfilActualizarStatDOM('perfil-stat-racha', stats.racha    || 0);
      perfilRenderHistorial(stats.historial);
    }
  } catch (err) {
    console.error('[perfilCargar] Error stats:', err.message);
    // Mostrar historial vacío si falla el fetch
    perfilRenderHistorial([]);
  }
}


// ══════════════════════════════════════════════════════════════════
// perfilRenderHistorial(historial)
// Construye la tabla de pronósticos del usuario.
//
// LÓGICA DE PUNTOS:
//   3 pts → acertó el resultado exacto (ej: pronosticó 2-1, salió 2-1)
//   1 pt  → acertó el signo (ej: pronosticó 2-1, salió 1-0 → ambos local)
//   0 pts → erró
//   null  → partido no finalizado aún (pendiente)
// ══════════════════════════════════════════════════════════════════
function perfilRenderHistorial(historial) {
  const loading = document.getElementById('perfil-historial-loading');
  const tabla   = document.getElementById('perfil-historial');
  const empty   = document.getElementById('perfil-historial-empty');
  const rows    = document.getElementById('perfil-prode-rows');

  if (loading) loading.style.display = 'none';

  if (!historial || historial.length === 0) {
    if (empty) empty.style.display = 'block';
    return;
  }

  if (tabla) tabla.style.display = 'block';

  rows.innerHTML = historial.map(item => {
    const partido    = item.partidos;
    const fechaTexto = partido?.fecha_utc
      ? new Date(partido.fecha_utc).toLocaleDateString('es-AR', { day:'2-digit', month:'short' })
      : '—';

    // Determinar clase CSS según puntos
    const pts = item.puntos_obtenidos;
    const ptsClase = pts === null ? 'pendiente' : `pts-${pts}`;

    // Resultado real del partido
    const resultadoReal = (partido?.estado === 'finalizado' && partido?.goles_local !== null)
      ? `${partido.goles_local}–${partido.goles_visitante}`
      : '—';

    // Badge de puntos
    const ptsBadge = pts === null
      ? `<span class="perfil-pts-badge pendiente">PEND.</span>`
      : `<span class="perfil-pts-badge ${ptsClase}">${pts}</span>`;

    return `
      <div class="perfil-prode-row ${ptsClase}">
        <div class="perfil-prode-partido">
          <div class="perfil-prode-equipos">
            ${partido?.equipo_local || '?'} vs ${partido?.equipo_visitante || '?'}
          </div>
          <div class="perfil-prode-fecha">${fechaTexto}</div>
        </div>
        <div class="perfil-prode-score">
          ${item.pred_goles_local}–${item.pred_goles_visitante}
        </div>
        <div class="perfil-prode-score ${resultadoReal === '—' ? 'pendiente' : ''}">
          ${resultadoReal}
        </div>
        ${ptsBadge}
      </div>
    `;
  }).join('');
}


// ══════════════════════════════════════════════════════════════════
// EDICIÓN DE USERNAME
// ══════════════════════════════════════════════════════════════════

function perfilActivarEdicion() {
  const username = window.currentProfile?.username || '';

  document.getElementById('perfil-vista-username').style.display = 'none';
  document.getElementById('perfil-edit-username').style.display  = 'flex';

  const input = document.getElementById('perfil-username-input');
  input.value = username;
  input.focus();
  input.select(); // Seleccionar texto para reemplazar fácilmente
}

function perfilCancelarEdicion() {
  document.getElementById('perfil-vista-username').style.display = 'flex';
  document.getElementById('perfil-edit-username').style.display  = 'none';
  perfilOcultarMsg();
}

function perfilKeydownUsername(e) {
  if (e.key === 'Enter')  perfilGuardarUsername();
  if (e.key === 'Escape') perfilCancelarEdicion();
}

async function perfilGuardarUsername() {
  const nuevoUsername = document.getElementById('perfil-username-input').value.trim();
  const userId        = window.currentUser?.id;
  if (!nuevoUsername || !userId) return;

  // Feedback visual inmediato
  const saveBtn         = document.querySelector('.perfil-save-btn');
  saveBtn.textContent   = 'Guardando...';
  saveBtn.disabled      = true;

  try {
    const res  = await fetch(`${PERFIL_API}/api/perfil/${userId}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username: nuevoUsername })
    });
    const data = await res.json();

    if (!res.ok) {
      perfilMostrarMsg(data.error || 'Error al guardar.', 'error');
      return;
    }

    // Actualizar en memoria (currentProfile viene de auth.js)
    if (window.currentProfile) window.currentProfile.username = data.username;

    // Actualizar DOM
    document.getElementById('perfil-username-texto').textContent = data.username;
    document.getElementById('user-username').textContent         = data.username;
    perfilCancelarEdicion();
    perfilMostrarMsg('¡Username actualizado!', 'success');

  } catch {
    perfilMostrarMsg('Error de conexión.', 'error');
  } finally {
    saveBtn.textContent = 'Guardar';
    saveBtn.disabled    = false;
  }
}


// ══════════════════════════════════════════════════════════════════
// SUBIR AVATAR
// ══════════════════════════════════════════════════════════════════
async function perfilSubirAvatar(input) {
  const file   = input.files[0];
  const userId = window.currentUser?.id;
  if (!file || !userId) return;

  // Mostrar spinner, ocultar overlay
  const loading = document.getElementById('perfil-avatar-loading');
  if (loading) loading.style.display = 'flex';

  // FormData: formato que necesita multer en el backend para recibir archivos
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const res  = await fetch(`${PERFIL_API}/api/perfil/${userId}/avatar`, {
      method: 'POST',
      body:   formData
      // NO poner Content-Type: browser lo setea automáticamente con el boundary
    });
    const data = await res.json();

    if (!res.ok) {
      perfilMostrarMsg(data.error || 'Error al subir imagen.', 'error');
      return;
    }

    // Actualizar avatar en el DOM (panel + header)
    const nuevaUrl = data.avatar_url + '?t=' + Date.now(); // cache-bust
    document.getElementById('perfil-avatar-img').src = nuevaUrl;
    document.getElementById('user-avatar').src        = nuevaUrl;

    // Actualizar en memoria
    if (window.currentProfile) window.currentProfile.avatar_url = data.avatar_url;

    perfilMostrarMsg('¡Foto actualizada!', 'success');

  } catch {
    perfilMostrarMsg('Error de conexión al subir la imagen.', 'error');
  } finally {
    if (loading) loading.style.display = 'none';
    input.value = ''; // Resetear input para permitir subir la misma imagen otra vez
  }
}


// ══════════════════════════════════════════════════════════════════
// HELPERS DE UI
// ══════════════════════════════════════════════════════════════════
function perfilActualizarStatDOM(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function perfilMostrarMsg(texto, tipo) {
  const el = document.getElementById('perfil-msg');
  if (!el) return;
  el.textContent   = texto;
  el.className     = `perfil-msg ${tipo}`;
  el.style.display = 'block';
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function perfilOcultarMsg() {
  const el = document.getElementById('perfil-msg');
  if (el) el.style.display = 'none';
}
