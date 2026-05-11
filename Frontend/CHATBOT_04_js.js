/* ══════════════════════════════════════════════════════════════════
   CHATBOT_04_js.js
   DÓNDE PEGARLO: al final de tu app.js (antes del último cierre)

   TAMBIÉN: en tu función switchTab() existente, agregale este caso:
     if (id === 'chatbot') { /* no hace falta nada, el chat ya se inició */ 
/*
   CONCEPTOS CLAVE para entender este archivo:
   ─────────────────────────────────────────────────────────────────
   1. HISTORIAL DE CONVERSACIÓN:
      Gemini es "sin memoria": cada petición es independiente.
      Para que "recuerde" la conversación, enviamos TODA la
      historia de mensajes anteriores en cada petición.
      Array chatbotHistorial guarda los mensajes en el formato
      que espera Gemini: [{ role: "user", parts: [{text:"..."}] }, ...]

   2. FETCH + ASYNC/AWAIT:
      Para llamar a nuestro backend usamos fetch() asíncrono.
      async/await hace que el código se lea de arriba a abajo
      aunque sea asíncrono (sin callbacks anidados).

   3. GOOGLE CALENDAR URL:
      No necesitamos OAuth ni nada complejo. Google Calendar
      acepta eventos por URL con parámetros GET. Es como un
      "formulario pre-llenado" que abre en el navegador del usuario.
      El usuario revisa y confirma el evento en su propia cuenta.
   ══════════════════════════════════════════════════════════════════ 
*/

// ── Variables de estado del chatbot ────────────────────────────────
const CHATBOT_BACKEND_URL = 'http://localhost:3000'; // Cambiar en producción

// Historial de conversación para el panel principal
let chatbotHistorial = [];

// Historial del widget flotante (independiente del panel principal)
let widgetHistorial = [];

// Datos del último evento de calendario detectado por Gemini
let ultimoEventoCalendario = null;

// Estado: si el bot está procesando una respuesta (evita doble envío)
let chatbotEsperando = false;


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL: chatbotEnviar
// Se llama cuando el usuario hace click en Enviar o presiona Enter.
//
// FLUJO:
//   1. Valida que haya texto
//   2. Muestra el mensaje del usuario en el chat
//   3. Muestra el "typing indicator" (tres puntitos)
//   4. Llama al backend (POST /api/chat)
//   5. Recibe la respuesta de Gemini
//   6. Renderiza la respuesta del bot
//   7. Si hay productos, los muestra en el sidebar
//   8. Si hay evento de calendario, muestra el botón de agendar
// ══════════════════════════════════════════════════════════════════
async function chatbotEnviar() {
  const input = document.getElementById('chatbot-input');
  const texto = input.value.trim();

  // Validaciones
  if (!texto || chatbotEsperando) return;
  if (texto.length > 500) return;

  // Limpiar input y bloquear envíos mientras espera respuesta
  input.value         = '';
  chatbotEsperando    = true;
  autoResizeTextarea(input);

  // Actualizar contador de caracteres
  document.getElementById('chatbot-char-count').textContent = '0/500';

  // Deshabilitar botón de envío visualmente
  const sendBtn       = document.getElementById('chatbot-send-btn');
  sendBtn.disabled    = true;

  // 1. Mostrar el mensaje del usuario en el chat
  agregarMensajeChatbot('user', texto);

  // 2. Agregar al historial (formato que espera Gemini)
  chatbotHistorial.push({
    role:  'user',
    parts: [{ text: texto }]
  });

  // 3. Mostrar indicador de "escribiendo..."
  const typingId = mostrarTyping();

  try {
    // 4. Llamar al backend
    //    El backend llama a Gemini con el historial completo
    const respuesta = await fetch(`${CHATBOT_BACKEND_URL}/api/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje:   texto,
        historial: chatbotHistorial.slice(0, -1) // sin el último (ya enviado en `mensaje`)
      })
    });

    const datos = await respuesta.json();

    // 5. Quitar el indicador de typing
    quitarTyping(typingId);

    if (datos.error && !datos.respuesta) {
      // Error del servidor
      agregarMensajeChatbot('bot', '⚠️ ' + datos.error);
      return;
    }

    // 6. Mostrar la respuesta del bot
    const textoRespuesta = datos.respuesta || 'No pude procesar esa pregunta.';
    agregarMensajeChatbot('bot', textoRespuesta);

    // Guardar respuesta del bot en el historial
    chatbotHistorial.push({
      role:  'model',
      parts: [{ text: textoRespuesta }]
    });

    // Limitar historial a los últimos 20 mensajes (10 intercambios)
    // para no sobrecargar la API con tokens
    if (chatbotHistorial.length > 20) {
      chatbotHistorial = chatbotHistorial.slice(-20);
    }

    // 7. Si el backend encontró productos relevantes, mostrarlos
    if (datos.productos && datos.productos.length > 0) {
      renderizarProductosChatbot(datos.productos);
    }

    // 8. Si Gemini detectó un evento de calendario, mostrar el botón
    if (datos.calendario) {
      ultimoEventoCalendario = datos.calendario;
      mostrarSeccionCalendario(datos.calendario);
    }

  } catch (err) {
    quitarTyping(typingId);
    agregarMensajeChatbot('bot', '⚠️ Error de conexión. ¿Está el servidor corriendo? Revisá la consola.');
    console.error('[chatbotEnviar] Error:', err.message);
  } finally {
    // Siempre re-habilitar el input, haya error o no
    chatbotEsperando = false;
    sendBtn.disabled = false;
    input.focus();
  }
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: agregarMensajeChatbot
// Crea y agrega una burbuja de mensaje al DOM del chat.
//
// PARÁMETROS:
//   rol    — 'user' o 'bot'
//   texto  — el texto del mensaje (puede incluir HTML básico)
// ══════════════════════════════════════════════════════════════════
function agregarMensajeChatbot(rol, texto) {
  const contenedor = document.getElementById('chatbot-mensajes');
  if (!contenedor) return;

  const esUsuario  = rol === 'user';
  const hora       = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  // Obtener inicial del username para el avatar del usuario
  const perfil     = window.currentProfile; // Viene de auth.js
  const inicial    = perfil?.username?.[0]?.toUpperCase() || 'U';

  const div        = document.createElement('div');
  div.className    = `chatbot-msg ${esUsuario ? 'chatbot-msg--user' : 'chatbot-msg--bot'}`;

  // Convertir saltos de línea y texto bold básico en HTML
  const textoHtml  = texto
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  div.innerHTML = `
    <div class="chatbot-msg-avatar">${esUsuario ? inicial : '⚽'}</div>
    <div class="chatbot-msg-contenido">
      <div class="chatbot-msg-texto">${textoHtml}</div>
      <div class="chatbot-msg-time">${hora}</div>
    </div>
  `;

  contenedor.appendChild(div);

  // Auto-scroll al último mensaje
  contenedor.scrollTop = contenedor.scrollHeight;
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: mostrarTyping / quitarTyping
// Agrega/quita el indicador de "el bot está escribiendo..."
// (los tres puntitos animados)
// ══════════════════════════════════════════════════════════════════
function mostrarTyping() {
  const contenedor = document.getElementById('chatbot-mensajes');
  if (!contenedor) return null;

  const id  = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chatbot-msg chatbot-msg--bot';
  div.id        = id;
  div.innerHTML = `
    <div class="chatbot-msg-avatar">⚽</div>
    <div class="chatbot-typing">
      <span></span><span></span><span></span>
    </div>
  `;
  contenedor.appendChild(div);
  contenedor.scrollTop = contenedor.scrollHeight;
  return id;
}

function quitarTyping(id) {
  if (id) document.getElementById(id)?.remove();
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: renderizarProductosChatbot
// Muestra las tarjetas de productos en el sidebar del chatbot.
//
// CUÁNDO SE LLAMA:
//   Cuando el backend devuelve productos relevantes basados en
//   la selección mencionada en la conversación.
// ══════════════════════════════════════════════════════════════════
function renderizarProductosChatbot(productos) {
  const contenedor = document.getElementById('chatbot-productos');
  if (!contenedor) return;

  if (!productos || productos.length === 0) {
    contenedor.innerHTML = `
      <div class="chatbot-sidebar-empty">
        <span>🛒</span>
        <p>Sin productos disponibles para esta selección.</p>
      </div>
    `;
    return;
  }

  // Cada producto viene del backend con:
  // { nombre, precio, link_afiliado, imagen_url, categoria_relacionada }
  contenedor.innerHTML = productos.map(p => `
    <div class="chatbot-producto-card">
      ${p.imagen_url
        ? `<img src="${p.imagen_url}" alt="${p.nombre}" class="chatbot-producto-img" onerror="this.style.display='none'">`
        : ''
      }
      <div class="chatbot-producto-body">
        <div class="chatbot-producto-nombre">${p.nombre}</div>
        ${p.precio
          ? `<div class="chatbot-producto-precio">$${p.precio}</div>`
          : ''
        }
        <a href="${p.link_afiliado || '#'}" target="_blank" rel="noopener" class="chatbot-producto-btn">
          🛒 Ver en tienda
        </a>
      </div>
    </div>
  `).join('');
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: mostrarSeccionCalendario
// Muestra la sección del sidebar con la información del evento
// y el botón para agregar a Google Calendar.
//
// PARÁMETRO: evento = { equipo, descripcion, fecha_aprox }
// ══════════════════════════════════════════════════════════════════
function mostrarSeccionCalendario(evento) {
  const section = document.getElementById('chatbot-calendario-section');
  const info    = document.getElementById('chatbot-calendario-info');
  if (!section || !info) return;

  info.innerHTML = `
    <div style="margin-bottom:6px;font-weight:700;color:var(--gold)">📅 Evento detectado</div>
    <div style="margin-bottom:4px"><strong>🏳️ Equipo:</strong> ${evento.equipo}</div>
    <div style="margin-bottom:4px"><strong>📅 Fecha:</strong> ${evento.fecha_aprox}</div>
    <div><strong>📝 Descripción:</strong> ${evento.descripcion}</div>
  `;

  section.style.display = 'block';

  // Scroll suave al botón de calendario
  section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: agendarEnCalendario
// Construye la URL de Google Calendar con los datos del evento
// y la abre en una nueva pestaña.
//
// CONCEPTO — Google Calendar URL API (sin OAuth):
//   Google acepta eventos pre-llenados por URL usando estos parámetros:
//   - text:    título del evento
//   - details: descripción
//   - dates:   YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ (inicio/fin)
//   - location: lugar
//   El usuario ve un formulario pre-llenado y decide si confirma.
//   NO necesitamos acceso a la cuenta, el usuario lo confirma él mismo.
// ══════════════════════════════════════════════════════════════════
function agendarEnCalendario() {
  if (!ultimoEventoCalendario) return;

  const evento    = ultimoEventoCalendario;

  // Para el Mundial 2026 sabemos que es en junio/julio 2026
  // Usamos fechas genéricas de junio 2026 porque no tenemos el fixture exacto
  // En una versión futura, esto podría conectarse con la tabla `partidos`
  const fechaInicio = '20260611';  // 11 junio 2026 (inicio del Mundial)
  const fechaFin    = '20260719';  // fecha de fin: próximo día

  // Parámetros de la URL de Google Calendar
  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     `⚽ ${evento.equipo} — Mundial FIFA 2026`,
    details:  `${evento.descripcion}\n\nAgendado desde Mundialito.app`,
    dates:    `${fechaInicio}/${fechaFin}`,
    location: 'Estados Unidos / México / Canadá — Mundial 2026',
  });

  const url = `https://calendar.google.com/calendar/render?${params.toString()}`;

  // Abrir en nueva pestaña — el usuario ve el evento pre-llenado
  window.open(url, '_blank');

  // Feedback visual: cambiar texto del botón temporalmente
  const btn = document.getElementById('chatbot-calendario-btn');
  if (btn) {
    btn.textContent = '✅ ¡Abriendo Google Calendar!';
    btn.style.background = '#34A853';
    setTimeout(() => {
      btn.textContent = '📅 Agregar a mi Google Calendar';
      btn.style.background = '';
    }, 3000);
  }
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: usarSugerencia
// Se llama cuando el usuario hace click en uno de los botones
// de sugerencias rápidas.
// ══════════════════════════════════════════════════════════════════
function usarSugerencia(btn) {
  const texto  = btn.textContent.trim();
  const input  = document.getElementById('chatbot-input');
  if (!input) return;

  input.value = texto;
  autoResizeTextarea(input);

  // Pequeño delay para que el usuario vea que se completó
  setTimeout(() => chatbotEnviar(), 150);
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: chatbotKeydown
// Detecta Enter para enviar (sin Shift+Enter que es salto de línea)
// ══════════════════════════════════════════════════════════════════
function chatbotKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatbotEnviar();
  }
  // Actualizar contador de caracteres
  const input = document.getElementById('chatbot-input');
  const count = document.getElementById('chatbot-char-count');
  if (count && input) {
    count.textContent = `${input.value.length}/500`;
  }
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: autoResizeTextarea
// Hace que el textarea crezca automáticamente con el texto
// ══════════════════════════════════════════════════════════════════
function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}


// ══════════════════════════════════════════════════════════════════
// WIDGET FLOTANTE
// Es una versión mini del chatbot que aparece en cualquier panel.
// Comparte el backend pero tiene su propio historial y DOM.
// ══════════════════════════════════════════════════════════════════
function toggleChatbotWidget() {
  const widget = document.getElementById('chatbot-widget');
  const badge  = document.getElementById('chatbot-fab-badge');
  if (!widget) return;

  const estaAbierto = widget.style.display !== 'none';
  widget.style.display = estaAbierto ? 'none' : 'flex';
  widget.style.flexDirection = 'column';
  if (badge) badge.style.display = 'none'; // Ocultar badge al abrir

  if (!estaAbierto) {
    document.getElementById('chatbot-widget-input')?.focus();
  }
}

async function widgetEnviar() {
  const input = document.getElementById('chatbot-widget-input');
  const texto = input?.value?.trim();
  if (!texto) return;

  input.value = '';

  // Agregar mensaje del usuario al widget
  agregarMensajeWidget('user', texto);
  widgetHistorial.push({ role: 'user', parts: [{ text: texto }] });

  // Mostrar typing
  const mensajes = document.getElementById('chatbot-widget-mensajes');
  const typingDiv = document.createElement('div');
  typingDiv.id = 'widget-typing';
  typingDiv.className = 'chatbot-msg chatbot-msg--bot';
  typingDiv.style.padding = '8px 12px';
  typingDiv.innerHTML = `
    <div class="chatbot-msg-avatar" style="width:28px;height:28px;font-size:14px">⚽</div>
    <div class="chatbot-typing"><span></span><span></span><span></span></div>
  `;
  mensajes?.appendChild(typingDiv);
  mensajes && (mensajes.scrollTop = mensajes.scrollHeight);

  try {
    const respuesta = await fetch(`${CHATBOT_BACKEND_URL}/api/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje:   texto,
        historial: widgetHistorial.slice(0, -1)
      })
    });
    const datos = await respuesta.json();

    document.getElementById('widget-typing')?.remove();
    agregarMensajeWidget('bot', datos.respuesta || 'Sin respuesta.');
    widgetHistorial.push({ role: 'model', parts: [{ text: datos.respuesta || '' }] });

    // Si el widget detecta un evento de calendario, mostrar badge en el FAB
    if (datos.calendario) {
      ultimoEventoCalendario = datos.calendario;
      const badge = document.getElementById('chatbot-fab-badge');
      if (badge) { badge.style.display = 'flex'; badge.textContent = '📅'; }
    }

  } catch {
    document.getElementById('widget-typing')?.remove();
    agregarMensajeWidget('bot', '⚠️ Error de conexión.');
  }
}

function agregarMensajeWidget(rol, texto) {
  const contenedor = document.getElementById('chatbot-widget-mensajes');
  if (!contenedor) return;

  const esUsuario = rol === 'user';
  const div       = document.createElement('div');
  div.className   = `chatbot-msg ${esUsuario ? 'chatbot-msg--user' : 'chatbot-msg--bot'}`;
  div.style.padding = '6px 12px';

  const inicial = window.currentProfile?.username?.[0]?.toUpperCase() || 'U';
  const textoHtml = texto.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  div.innerHTML = `
    <div class="chatbot-msg-avatar" style="width:28px;height:28px;font-size:13px">
      ${esUsuario ? inicial : '⚽'}
    </div>
    <div class="chatbot-msg-texto" style="font-size:13px">${textoHtml}</div>
  `;

  contenedor.appendChild(div);
  contenedor.scrollTop = contenedor.scrollHeight;
}

function widgetKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    widgetEnviar();
  }
}
