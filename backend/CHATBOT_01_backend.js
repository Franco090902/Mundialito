// ══════════════════════════════════════════════════════════════════
// CHATBOT_01_backend.js
// DÓNDE PEGARLO: al final de tu server.js, ANTES del app.listen(...)
//
// QUÉ HACE: agrega 1 nuevo endpoint a tu servidor Express existente
//   POST /api/chat  ← el frontend le manda la pregunta del usuario
//                     y el historial de conversación
//
// DEPENDENCIAS NUEVAS: ninguna. Gemini se llama con fetch nativo
// de Node.js (disponible en Node 18+). Solo necesitás la API Key.
//
// AGREGAR EN .env:
//   GEMINI_API_KEY=tu_clave_de_gemini
//
// CÓMO CONSEGUIR LA KEY DE GEMINI (GRATIS):
//   1. Ir a https://aistudio.google.com/
//   2. Iniciar sesión con cuenta de Google
//   3. Click en "Get API Key" → "Create API Key"
//   4. Copiar y pegar en el .env
// ══════════════════════════════════════════════════════════════════


// ──────────────────────────────────────────────────────────────────
// CONTEXTO DEL CHATBOT (System Prompt)
//
// CONCEPTO CLAVE — "System Prompt":
//   Es el primer mensaje que le damos a la IA antes de que el usuario
//   escriba algo. Define la "personalidad" y las reglas del chatbot.
//   El modelo LLM (Gemini) intentará siempre respetar estas reglas.
//
// ESTRUCTURA:
//   1. ROL: quién es el chatbot
//   2. CONOCIMIENTO: qué sabe (Mundial 2026)
//   3. COMPORTAMIENTO COMERCIAL: cuándo y cómo mencionar productos
//   4. COMPORTAMIENTO DE CALENDARIO: cuándo y cómo ofrecer agendar
//   5. LÍMITES: sobre qué NO hablar
// ──────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
Sos "Mundialito Bot", el asistente oficial de la web Mundialito 2026.
Tu especialidad es el fútbol, especialmente el Mundial FIFA 2026.

INFORMACIÓN CLAVE DEL MUNDIAL 2026:
- Sede: Estados Unidos, México y Canadá (primer Mundial en 3 países)
- Fechas: 11 de junio al 19 de julio de 2026
- Equipos: 48 selecciones (primer Mundial con ese formato)
- Estadios: 16 estadios en total distribuidos en las 3 sedes
- Grupos: 12 grupos de 4 equipos, los 2 primeros más los 8 mejores terceros avanzan
- Favoritos históricos: Argentina (campeón vigente), Francia, Brasil, España, Alemania, Inglaterra

SEDE POR CIUDAD (principales):
- Nueva York/New Jersey: MetLife Stadium (final)
- Los Angeles: SoFi Stadium
- Dallas: AT&T Stadium
- San Francisco: Levi's Stadium
- Miami: Hard Rock Stadium
- Houston: NRG Stadium
- Ciudad de México: Estadio Azteca
- Guadalajara: Estadio Akron
- Monterrey: Estadio BBVA
- Toronto: BMO Field
- Vancouver: BC Place

REGLAS DE COMPORTAMIENTO:

1. SIEMPRE respondé en español rioplatense (usás "vos", "che", etc.)
2. Respondé preguntas de fútbol con precisión y entusiasmo
3. Sé conciso: máximo 3-4 párrafos por respuesta
4. DESPUÉS de responder, buscá UNA excusa natural para mencionar
   un producto de la tienda. Ejemplos de excusas:
   - Si preguntan por Argentina → "Y si sos hincha, fijate que en nuestra tienda tenemos..."
   - Si preguntan por el Mundial en general → "Para vivir el Mundial de la mejor manera..."
   - Si preguntan de historia → "Los coleccionistas van a querer..."
   La mención del producto debe ser NATURAL, no forzada. No la hagas
   en TODAS las respuestas, solo cuando tenga sentido (aprox 60% de las veces).

5. DETECCIÓN DE FECHAS Y PARTIDOS:
   Si el usuario pregunta por un partido, fecha, o quiere saber cuándo
   juega una selección, DESPUÉS de responder agregá este bloque
   EXACTAMENTE así (con el separador):
   
   ---CALENDARIO---
   {"equipo":"[nombre del equipo]","descripcion":"[descripción del evento]","fecha_aprox":"[fecha aproximada 2026]"}
   
   Ejemplo:
   ---CALENDARIO---
   {"equipo":"Argentina","descripcion":"Partido de Argentina en el Mundial 2026","fecha_aprox":"Junio 2026"}

6. LÍMITES: Solo respondés sobre fútbol. Si te preguntan sobre otro
   tema, decís amablemente que sos un especialista en fútbol y
   redirigís la conversación.

7. TONO: Apasionado, amigable, como un hincha experto. Podés usar
   emojis con moderación (⚽🏆🔥).
`;


// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: llamar a la API de Gemini
//
// CONCEPTO — Por qué llamamos a Gemini desde el backend y no
// directamente desde el frontend:
//   Mismo motivo que GNews: proteger la API Key. Si el frontend
//   llamara a Gemini directo, tu key quedaría expuesta en el navegador.
//
// PARÁMETROS:
//   historial: Array de mensajes anteriores (para que Gemini recuerde
//              el contexto de la conversación)
//   mensajeNuevo: El último mensaje del usuario
// ──────────────────────────────────────────────────────────────────
async function llamarGemini(historial, mensajeNuevo) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  // Gemini espera el historial en este formato:
  // [{ role: "user", parts: [{ text: "..." }] },
  //  { role: "model", parts: [{ text: "..." }] }, ...]
  //
  // El "system prompt" va como primer mensaje del usuario
  // y la respuesta del modelo es un ACK simple.
  const contents = [
    // Contexto inicial (system prompt disfrazado de conversación)
    {
      role: "user",
      parts: [{ text: `INSTRUCCIONES DE SISTEMA:\n${SYSTEM_PROMPT}` }]
    },
    {
      role: "model",
      parts: [{ text: "Entendido. Soy Mundialito Bot, listo para responder preguntas sobre el Mundial 2026. ¡Dale, preguntame lo que quieras!" }]
    },
    // Historial previo de la conversación (máximo últimos 10 mensajes
    // para no superar el límite de tokens)
    ...historial.slice(-10),
    // El nuevo mensaje del usuario
    {
      role: "user",
      parts: [{ text: mensajeNuevo }]
    }
  ];

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.8,      // Creatividad (0=robótico, 1=creativo)
        maxOutputTokens: 600,  // Límite de longitud de respuesta
        topP: 0.9,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${errorData.error?.message || response.status}`);
  }

  const data = await response.json();
  // La respuesta del modelo está anidada en esta estructura
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}


// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: llamar a la API de Groq (FALLBACK)
// ──────────────────────────────────────────────────────────────────
async function llamarGroq(historial, mensajeNuevo) {
  const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

  // Formateamos el historial de Gemini al formato de OpenAI (que usa Groq)
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "assistant", content: "Entendido. Soy Mundialito Bot, listo para responder preguntas sobre el Mundial 2026. ¡Dale, preguntame lo que quieras!" }
  ];

  for (const msg of historial.slice(-10)) {
    messages.push({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0].text
    });
  }

  messages.push({ role: "user", content: mensajeNuevo });

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.8,
      max_tokens: 600
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Groq API error: ${errorData.error?.message || response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content || '';
}


// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: buscar productos relevantes en Supabase
//
// Cuando Gemini menciona una selección, buscamos productos
// relacionados en la BD para incluirlos en la respuesta.
// Así el chatbot puede decir "tenemos esta camiseta" con datos reales.
// ──────────────────────────────────────────────────────────────────
async function buscarProductosRelevantes(texto) {
  // Extraemos posibles nombres de selecciones del texto de Gemini
  // Lista de selecciones a detectar (expandir según tu tienda)
  const selecciones = [
    'Argentina', 'Brasil', 'Francia', 'España', 'Alemania',
    'Inglaterra', 'Uruguay', 'México', 'Colombia', 'Portugal',
    'Italia', 'Holanda', 'Países Bajos', 'Croacia', 'Marruecos'
  ];

  const encontrada = selecciones.find(s =>
    texto.toLowerCase().includes(s.toLowerCase())
  );

  if (!encontrada) return [];

  try {
    // Buscamos en la tabla productos_ml (la que ya tenés en Supabase)
    const { data } = await supabase
      .from('products_url')
      .select('nombre, precio, link_afiliado, imagen_url, categoria_relacionada')
      .eq('categoria_relacionada', encontrada)
      .eq('activo', true)
      .limit(2);  // Máximo 2 productos para no sobrecargar

    return data || [];
  } catch {
    return [];
  }
}


// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: parsear bloque de calendario
//
// Gemini puede incluir un bloque especial en su respuesta
// si detecta que el usuario pregunta por fechas/partidos.
// Esta función extrae ese bloque y lo devuelve separado.
// ──────────────────────────────────────────────────────────────────
function parsearCalendario(textoRespuesta) {
  const separador = '---CALENDARIO---';
  const idx = textoRespuesta.indexOf(separador);

  if (idx === -1) {
    return { texto: textoRespuesta, calendario: null };
  }

  const texto     = textoRespuesta.substring(0, idx).trim();
  const jsonParte = textoRespuesta.substring(idx + separador.length).trim();

  try {
    const calendario = JSON.parse(jsonParte);
    return { texto, calendario };
  } catch {
    // Si el JSON está malformado, ignoramos el bloque
    return { texto, calendario: null };
  }
}


// ══════════════════════════════════════════════════════════════════
// ENDPOINT: POST /api/chat
//
// REQUEST BODY (JSON):
//   {
//     "mensaje": "¿Cuándo juega Argentina?",
//     "historial": [
//       { "role": "user",  "parts": [{ "text": "Hola" }] },
//       { "role": "model", "parts": [{ "text": "¡Hola! Soy Mundialito Bot..." }] }
//     ]
//   }
//
// RESPONSE (JSON):
//   {
//     "respuesta": "Argentina juega en el Grupo...",
//     "productos": [...],   // puede ser array vacío
//     "calendario": {       // puede ser null
//       "equipo": "Argentina",
//       "descripcion": "Partido de Argentina...",
//       "fecha_aprox": "Junio 2026"
//     }
//   }
// ══════════════════════════════════════════════════════════════════
app.post('/api/chat', async (req, res) => {
  const { mensaje, historial = [] } = req.body;

  // Validación básica
  if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
    return res.status(400).json({ error: 'El campo "mensaje" es requerido.' });
  }

  if (mensaje.trim().length > 500) {
    return res.status(400).json({ error: 'El mensaje es demasiado largo (máx 500 caracteres).' });
  }

  try {
    let respuestaCompleta;
    try {
      // 1. Llamar a Gemini con el historial y el nuevo mensaje
      respuestaCompleta = await llamarGemini(historial, mensaje.trim());
    } catch (geminiErr) {
      console.error('⚠️ Error con Gemini, intentando fallback con Groq:', geminiErr.message);
      // Fallback a Groq
      respuestaCompleta = await llamarGroq(historial, mensaje.trim());
    }

    // 2. Separar el texto de respuesta del posible bloque de calendario
    const { texto, calendario } = parsearCalendario(respuestaCompleta);

    // 3. Buscar productos relevantes basados en la respuesta de Gemini
    //    (esto enriquece la respuesta con datos reales de tu BD)
    const productos = await buscarProductosRelevantes(texto + ' ' + mensaje);

    // 4. Devolver todo al frontend
    res.json({
      respuesta: texto,
      productos,        // Array (puede estar vacío si no hay productos)
      calendario,       // Objeto o null
    });

  } catch (err) {
    console.error('❌ [/api/chat] Error:', err.message);

    // Mensaje de error amigable para el usuario
    res.status(500).json({
      error: 'No pude procesar tu pregunta. Intentá de nuevo en un momento.',
      respuesta: '¡Ups! Tuve un problema técnico. Intentá de nuevo. ⚽'
    });
  }
});
