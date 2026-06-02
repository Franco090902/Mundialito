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
const CHATBOT_BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://mundialito-hzhf.onrender.com'; // 👈 Tu URL de Render

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

    // 8. Calendario: solo mostrar botón cuando Gemini devuelve datos exactos
    //    del partido (equipo1 + equipo2 + fecha + hora_arg).
    //    Si solo devuelve info aproximada, no mostramos nada.
    if (
      datos.calendario &&
      datos.calendario.equipo1 &&
      datos.calendario.equipo2 &&
      datos.calendario.fecha &&
      datos.calendario.hora_arg
    ) {
      ultimoEventoCalendario = datos.calendario;
      mostrarSeccionCalendario(datos.calendario);
      inyectarBotonCalendario(datos.calendario);
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

  // Determinar si es un partido exacto (tiene fecha+hora) o aproximado
  const tieneHoraExacta = evento.fecha && evento.hora_arg && evento.equipo1 && evento.equipo2;
  const tituloPartido   = tieneHoraExacta
    ? `${evento.equipo1} vs ${evento.equipo2}`
    : (evento.equipo || 'Selección');
  const fechaTexto      = tieneHoraExacta
    ? `${evento.fecha} · ${evento.hora_arg} hs (Argentina)`
    : (evento.fecha_aprox || 'Junio–Julio 2026');

  info.innerHTML = `
    <div style="margin-bottom:6px;font-weight:700;color:var(--gold)">📅 Evento detectado</div>
    <div style="margin-bottom:4px"><strong>⚽ Partido:</strong> ${tituloPartido}</div>
    <div style="margin-bottom:4px"><strong>📅 Fecha:</strong> ${fechaTexto}</div>
    <div><strong>📝 Descripción:</strong> ${evento.descripcion || 'Mundial FIFA 2026'}</div>
  `;

  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: inyectarBotonCalendario
// Inyecta el botón SOLO cuando tenemos datos exactos del partido
// (equipo1, equipo2, fecha, hora_arg). Si los datos son aproximados,
// no se muestra nada para no crear eventos genéricos sin valor.
// ══════════════════════════════════════════════════════════════════
function inyectarBotonCalendario(evento) {
  // Guardia: solo proceder si tenemos los 4 campos exactos
  if (!evento?.equipo1 || !evento?.equipo2 || !evento?.fecha || !evento?.hora_arg) return;

  const contenedor = document.getElementById('chatbot-mensajes');
  if (!contenedor) return;

  // Obtener el último mensaje del bot
  const mensajesBot = contenedor.querySelectorAll('.chatbot-msg--bot');
  if (!mensajesBot.length) return;
  const ultimoMensaje = mensajesBot[mensajesBot.length - 1];
  const contenidoMsg  = ultimoMensaje.querySelector('.chatbot-msg-contenido');
  if (!contenidoMsg) return;

  // Evitar duplicar el botón si ya existe en este mensaje
  if (contenidoMsg.querySelector('.cal-inline-widget')) return;

  // Formatear la fecha para mostrar al usuario (DD/MM/YYYY)
  const [anio, mes, dia] = evento.fecha.split('-');
  const fechaLegible     = `${dia}/${mes}/${anio}`;
  const subTexto         = `${evento.equipo1} vs ${evento.equipo2} · ${fechaLegible} ${evento.hora_arg} hs (ARG)`;

  // Crear el widget
  const widget     = document.createElement('div');
  widget.className = 'cal-inline-widget';

  const btn        = document.createElement('button');
  btn.className    = 'cal-inline-btn';
  btn.type         = 'button';
  btn.innerHTML    = `
    <span class="cal-inline-icon">📅</span>
    <span class="cal-inline-textos">
      <span class="cal-inline-label">Agendar partido en mi Google Calendar</span>
      <span class="cal-inline-sub">${subTexto}</span>
    </span>
    <span class="cal-inline-arrow">›</span>
  `;

  btn.addEventListener('click', () => {
    agendarEnCalendario();
    _feedbackBotonCal(btn, '✅ Abriendo Google Calendar...');
  });

  widget.appendChild(btn);
  contenidoMsg.appendChild(widget);
  contenedor.scrollTop = contenedor.scrollHeight;
}


// ── Helper privado: feedback visual temporal en el botón inline ──
function _feedbackBotonCal(btn, mensajeTemporal) {
  const labelEl = btn.querySelector('.cal-inline-label');
  if (!labelEl) return;
  const textoOriginal  = labelEl.textContent;
  labelEl.textContent  = mensajeTemporal;
  btn.disabled         = true;
  btn.style.opacity    = '0.7';
  setTimeout(() => {
    labelEl.textContent = textoOriginal;
    btn.disabled        = false;
    btn.style.opacity   = '';
  }, 3000);
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: generarURLCalendario
// Recibe los datos de un partido y genera la URL de Google Calendar.
//
// PARÁMETROS:
//   equipo1   — nombre de la selección local   (ej: "Argentina")
//   equipo2   — nombre de la selección visitante (ej: "Austria")
//   fecha     — fecha en formato "YYYY-MM-DD"  (ej: "2026-06-15")
//   horaARG   — hora en formato "HH:MM"        (ej: "21:00")
//               ⚠️ SIEMPRE en Hora Argentina (UTC-3)
//
// LÓGICA DE CONVERSIÓN UTC:
//   Argentina es UTC-3, o sea que está 3 horas atrasada respecto a UTC.
//   Para convertir de ARG → UTC hay que SUMAR 3 horas.
//   Ejemplo: 21:00 ARG = 00:00 UTC del día siguiente
//
// FORMATO REQUERIDO POR GOOGLE CALENDAR:
//   YYYYMMDDTHHMMSSZ  (la Z indica que es UTC)
//   El separador "/" entre inicio y fin es obligatorio.
// ══════════════════════════════════════════════════════════════════
function generarURLCalendario(equipo1, equipo2, fecha, horaARG) {
  const [year, month, day] = fecha.split('-');
  const [hour, minute] = horaARG.split(':');
  
  const inicioDate = new Date(Date.UTC(year, month - 1, day, parseInt(hour) + 3, minute));
  const finDate = new Date(Date.UTC(year, month - 1, day, parseInt(hour) + 3 + 2, minute));

  const formatUTC = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const inicioStr = formatUTC(inicioDate);
  const finStr = formatUTC(finDate);

  const titulo = `⚽ ${equipo1} vs ${equipo2} - Mundial 2026`;
  const detalle = `Partido del Mundial 2026 entre ${equipo1} y ${equipo2}.\n\nAgendado desde Mundialito.app`;
  const ubicacion = 'Mundial FIFA 2026 - USA / Mexico / Canada';

  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     titulo,
    details:  detalle,
    dates:    `${inicioStr}/${finStr}`,
    location: ubicacion,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function agendarEnCalendario() {
  if (!ultimoEventoCalendario) return;

  const evento = ultimoEventoCalendario;
  
  if (!evento.fecha || !evento.hora_arg || !evento.equipo1 || !evento.equipo2) {
    console.warn('[agendarEnCalendario] Datos insuficientes para crear evento exacto:', evento);
    return;
  }

  const url = generarURLCalendario(
    evento.equipo1,
    evento.equipo2,
    evento.fecha,
    evento.hora_arg
  );

  window.open(url, '_blank');

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

// -----------------------------------------------------------------------------
// FUNCIÓN: usarSugerencia
// -----------------------------------------------------------------------------
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


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN: descargarCalendarioSeleccion
// Genera y descarga un archivo .ics con TODOS los partidos
// de una selección, compatible con Google Calendar, Apple Calendar,
// Outlook y cualquier app que soporte el estándar iCalendar (RFC 5545).
//
// PARÁMETRO — partidos: Array de objetos con esta estructura:
//   [
//     {
//       equipoLocal:     "Argentina",   // nombre selección local
//       equipoVisitante: "Austria",     // nombre selección visitante
//       fecha:           "2026-06-15",  // YYYY-MM-DD (hora Argentina)
//       hora:            "21:00"        // HH:MM      (hora Argentina, UTC-3)
//     },
//     { ... }
//   ]
//
// PARÁMETRO — nombreSeleccion: string para nombrar el archivo
//   Ej: "Argentina" → descarga "partidos_argentina_2026.ics"
//
// CONCEPTO — Estructura de un archivo .ics (RFC 5545):
//   El formato iCalendar es texto plano con bloques VCALENDAR → VEVENT.
//   Cada VEVENT representa un evento con propiedades clave:
//     DTSTART: fecha/hora de inicio en UTC  (YYYYMMDDTHHMMSSZ)
//     DTEND:   fecha/hora de fin en UTC     (YYYYMMDDTHHMMSSZ)
//     SUMMARY: título del evento
//     UID:     identificador único (obligatorio por el estándar)
//   Los saltos de línea DEBEN ser CRLF (\r\n) según el RFC 5545.
//
// CONCEPTO — Blob + descarga automática:
//   1. Creamos un Blob con el contenido del .ics (tipo "text/calendar")
//   2. Generamos una URL temporal con URL.createObjectURL()
//   3. Creamos un <a> invisible con el atributo "download" y hacemos click
//   4. Revocamos la URL temporal para liberar memoria
// ══════════════════════════════════════════════════════════════════
function descargarCalendarioSeleccion(partidos, nombreSeleccion = 'seleccion') {

  // Validación: necesitamos al menos un partido
  if (!Array.isArray(partidos) || partidos.length === 0) {
    console.warn('[descargarCalendarioSeleccion] No hay partidos para exportar.');
    return;
  }

  // ── 1. Armado del encabezado del archivo .ics ───────────────────
  // BEGIN:VCALENDAR es el contenedor raíz obligatorio.
  // PRODID identifica a la aplicación que generó el archivo.
  // VERSION:2.0 es la versión actual del estándar iCalendar.
  // CALSCALE:GREGORIAN indica el calendario gregoriano.
  // METHOD:PUBLISH indica que es un calendario publicado (no invitación).
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mundialito App//Mundial FIFA 2026//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:⚽ ${nombreSeleccion} — Mundial 2026`,
    'X-WR-TIMEZONE:America/Argentina/Buenos_Aires',
  ];

  // ── 2. Generar un VEVENT por cada partido ───────────────────────
  partidos.forEach((partido, index) => {
    const bloque = _partidoAEventoICS(partido, index);
    if (bloque) lineas.push(...bloque);
  });

  // ── 3. Cierre del VCALENDAR ─────────────────────────────────────
  lineas.push('END:VCALENDAR');

  // ── 4. Unir con CRLF (obligatorio por RFC 5545) ─────────────────
  // El estándar exige \r\n como separador de línea, NO solo \n.
  const contenidoICS = lineas.join('\r\n');

  // ── 5. Crear el Blob y forzar la descarga ───────────────────────
  // Blob: objeto de datos binarios en memoria. El tipo MIME
  // "text/calendar" le dice al navegador que es un archivo .ics.
  const blob = new Blob([contenidoICS], { type: 'text/calendar;charset=utf-8' });

  // URL.createObjectURL crea una URL temporal que apunta al Blob en memoria.
  // Es como una URL de archivo temporal que solo existe mientras la página está abierta.
  const urlTemporal = URL.createObjectURL(blob);

  // Creamos un <a> invisible, le asignamos la URL y el nombre del archivo,
  // y simulamos un click para forzar la descarga.
  const enlace      = document.createElement('a');
  enlace.href       = urlTemporal;
  enlace.download   = `partidos_${nombreSeleccion.toLowerCase().replace(/\s+/g, '_')}_2026.ics`;
  document.body.appendChild(enlace);
  enlace.click();

  // Limpieza: removemos el <a> del DOM y revocamos la URL temporal
  // para liberar la memoria del Blob.
  document.body.removeChild(enlace);
  URL.revokeObjectURL(urlTemporal);

  console.log(`[descargarCalendarioSeleccion] Descargados ${partidos.length} partido(s) para ${nombreSeleccion}.`);
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN PRIVADA: _partidoAEventoICS
// Convierte un objeto partido en un array de líneas que forman
// un bloque VEVENT del estándar iCalendar.
//
// RETORNA: Array de strings (líneas del VEVENT) o null si hay error.
//
// CONVERSIÓN UTC:
//   Argentina = UTC-3. Para convertir a UTC se suman 3 horas.
//   Usamos Date.UTC() para construir la fecha directamente en UTC,
//   luego sumamos el offset de Argentina (3h en ms).
//   Esto evita ambigüedades por la zona horaria del navegador.
//
// UID ÚNICO:
//   El RFC 5545 exige un UID único por evento. Usamos una combinación
//   de timestamp + índice + dominio para garantizar unicidad.
// ══════════════════════════════════════════════════════════════════
function _partidoAEventoICS(partido, index = 0) {
  try {
    const { equipoLocal, equipoVisitante, fecha, hora } = partido;

    // Validar campos mínimos necesarios
    if (!equipoLocal || !equipoVisitante || !fecha || !hora) {
      console.warn('[_partidoAEventoICS] Partido incompleto, se omite:', partido);
      return null;
    }

    // ── Parsear fecha y hora de Argentina ────────────────────────
    const [anio, mes, dia]  = fecha.split('-').map(Number);
    const [horaNum, minuto] = hora.split(':').map(Number);

    // ── Convertir Argentina (UTC-3) → UTC ────────────────────────
    // Date.UTC() crea un timestamp en UTC puro a partir de componentes.
    // Luego sumamos 3 horas en milisegundos (el offset de Argentina).
    const OFFSET_ARG_MS = 3 * 60 * 60 * 1000; // 3 horas en ms
    const inicioUTC     = new Date(Date.UTC(anio, mes - 1, dia, horaNum, minuto, 0) + OFFSET_ARG_MS);
    const finUTC        = new Date(inicioUTC.getTime() + 2 * 60 * 60 * 1000); // +2 horas

    // ── Formatear a YYYYMMDDTHHMMSSZ (formato iCalendar) ─────────
    const pad = (n) => String(n).padStart(2, '0');
    const formatICS = (d) => [
      d.getUTCFullYear(),
      pad(d.getUTCMonth() + 1),
      pad(d.getUTCDate()),
      'T',
      pad(d.getUTCHours()),
      pad(d.getUTCMinutes()),
      pad(d.getUTCSeconds()),
      'Z'
    ].join('');

    const dtStart = formatICS(inicioUTC); // ej: "20260615T000000Z"
    const dtEnd   = formatICS(finUTC);   // ej: "20260615T020000Z"

    // ── UID único por evento (obligatorio RFC 5545) ───────────────
    // Formato recomendado: timestamp-indice@dominio
    const uid = `mundialito-${Date.now()}-${index}@mundialito.app`;

    // ── Timestamp de creación del evento (DTSTAMP) ────────────────
    // DTSTAMP es obligatorio en el RFC 5545 y debe ser el momento
    // en que se generó el archivo, en UTC.
    const ahora   = new Date();
    const dtstamp = formatICS(ahora);

    // ── Armar el bloque VEVENT ────────────────────────────────────
    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${equipoLocal} vs ${equipoVisitante}`,
      `DESCRIPTION:⚽ Partido del Mundial FIFA 2026\\n🕐 ${hora} hs (Argentina)\\nDuración: 2 horas\\n\\nAgendado desde Mundialito.app`,
      `LOCATION:Mundial FIFA 2026 — USA / México / Canadá`,
      `CATEGORIES:Deportes,Fútbol,Mundial 2026`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',  // El evento marca el tiempo como "ocupado"
      'END:VEVENT',
    ];

  } catch (err) {
    console.error('[_partidoAEventoICS] Error procesando partido:', partido, err);
    return null;
  }
}
