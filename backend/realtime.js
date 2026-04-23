// ══════════════════════════════════════════════════════════════════
// realtime.js — Chat, Votos en Vivo, Prode y Ranking
// Vanilla JS puro. Sin frameworks.
//
// Este archivo importa supabase y currentUser desde auth.js.
// El servidor Node.js NO interviene en ninguna de estas funciones.
// Todo va: Browser → Supabase directamente.
// ══════════════════════════════════════════════════════════════════

import { supabase, currentUser, currentProfile } from './auth.js';


// ══════════════════════════════════════════════════════════════════
// SECCIÓN A: CHAT EN VIVO
// ══════════════════════════════════════════════════════════════════
//
// ARQUITECTURA:
//
//   Enviar mensaje:
//     Browser → supabase.from('chat_messages').insert()
//             → Supabase guarda en Postgres
//             → Postgres notifica a todos los suscriptores (Realtime)
//             → Todos los browsers reciben el mensaje
//
//   Recibir mensajes:
//     supabase.channel('chat:PARTIDO_ID')
//       .on('postgres_changes', { event: 'INSERT', table: 'chat_messages' }, callback)
//       .subscribe()
//
//   NO necesitás un servidor intermediario.
//   El insert del cliente → Supabase → broadcast a todos los suscriptores.
//
// ══════════════════════════════════════════════════════════════════

// Canal activo (guardamos referencia para poder desuscribirnos al cambiar de partido)
let chatChannel = null;

/**
 * Inicializa el chat para un partido específico.
 * Carga los últimos mensajes y se suscribe a los nuevos.
 * @param {string} partidoId — UUID del partido en la tabla `partidos`
 */
export async function initChat(partidoId) {
  // 1. Desuscribirse del canal anterior (si venía de otro partido)
  if (chatChannel) {
    await supabase.removeChannel(chatChannel);
    chatChannel = null;
  }

  // 2. Limpiar el contenedor de mensajes
  const container = document.getElementById('chat-messages');
  if (container) container.innerHTML = '';

  // 3. Cargar los últimos 50 mensajes (solo una vez al abrir el partido)
  await cargarHistorialChat(partidoId);

  // 4. Suscribirse a nuevos mensajes en tiempo real
  chatChannel = supabase
    .channel(`chat:${partidoId}`)                     // Nombre del canal (puede ser cualquier string)
    .on(
      'postgres_changes',                             // Tipo de evento: cambios en Postgres
      {
        event:  'INSERT',                             // Solo inserciones (mensajes nuevos)
        schema: 'public',
        table:  'chat_messages',
        filter: `partido_id=eq.${partidoId}`,         // Solo mensajes de ESTE partido
      },
      (payload) => {
        // Este callback se ejecuta en todos los navegadores conectados
        // cuando alguien envía un mensaje.
        renderMensaje(payload.new);
        scrollChatAbajo();
      }
    )
    .subscribe((status) => {
      console.log('Chat conectado:', status); // 'SUBSCRIBED' cuando está listo
    });
}


/**
 * Carga el historial de mensajes de un partido.
 * Se llama UNA SOLA VEZ al abrir el partido.
 * Los mensajes nuevos llegan por Realtime.
 */
async function cargarHistorialChat(partidoId) {
  const { data: mensajes, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('partido_id', partidoId)
    .order('created_at', { ascending: true })
    .limit(50); // Solo los últimos 50 para no sobrecargar

  if (error) {
    console.error('Error cargando chat:', error.message);
    return;
  }

  mensajes?.forEach(msg => renderMensaje(msg));
  scrollChatAbajo();
}


/**
 * Envía un mensaje al chat.
 * Llama directamente a Supabase, sin pasar por el servidor Node.
 * @param {string} partidoId
 * @param {string} texto
 */
export async function enviarMensaje(partidoId, texto) {
  if (!currentUser) {
    // Abrir el modal de login si no está autenticado
    document.getElementById('modal-auth')?.classList.add('active');
    return;
  }

  const textLimpio = texto.trim();
  if (!textLimpio || textLimpio.length > 400) return;

  const { error } = await supabase
    .from('chat_messages')
    .insert({
      partido_id: partidoId,
      user_id:    currentUser.id,
      // Desnormalizamos para no hacer JOIN al mostrar cada mensaje
      username:   currentProfile?.username || 'Usuario',
      avatar_url: currentProfile?.avatar_url || null,
      mensaje:    textLimpio,
    });

  if (error) {
    console.error('Error enviando mensaje:', error.message);
    // Rate limit o RLS: informar al usuario
    if (error.code === '42501') alert('No tenés permiso para chatear en este momento.');
  }
  // El mensaje llegará por Realtime, no necesitamos añadirlo manualmente al DOM
}


/**
 * Renderiza un mensaje individual en el contenedor del chat.
 * @param {object} msg — Fila de chat_messages
 */
function renderMensaje(msg) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const esMio = currentUser?.id === msg.user_id;
  const hora  = new Date(msg.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  const div = document.createElement('div');
  div.className = `chat-msg ${esMio ? 'chat-msg--own' : ''}`;
  div.innerHTML = `
    <div class="chat-msg-header">
      ${msg.avatar_url
        ? `<img class="chat-avatar" src="${msg.avatar_url}" alt="${msg.username}">`
        : `<span class="chat-avatar-placeholder">${msg.username[0].toUpperCase()}</span>`
      }
      <span class="chat-username ${esMio ? 'chat-username--own' : ''}">${escapeHtml(msg.username)}</span>
      <span class="chat-time">${hora}</span>
    </div>
    <div class="chat-msg-body">${escapeHtml(msg.mensaje)}</div>
  `;
  container.appendChild(div);
}


function scrollChatAbajo() {
  const container = document.getElementById('chat-messages');
  if (container) container.scrollTop = container.scrollHeight;
}


// ══════════════════════════════════════════════════════════════════
// SECCIÓN B: VOTOS EN VIVO (Predicciones durante el partido)
// ══════════════════════════════════════════════════════════════════
//
// ARQUITECTURA:
//
//   Votar:
//     Browser → supabase.from('live_votes').upsert()
//             → Postgres actualiza/inserta el voto
//             → El canal Realtime notifica el cambio a todos
//             → Todos recalculan los porcentajes
//
//   Los porcentajes NO se calculan en el cliente en tiempo real
//   (sería muy costoso con muchos usuarios).
//   En su lugar: el cliente llama a supabase.rpc('get_live_vote_stats')
//   cada vez que el Realtime notifica un cambio en live_votes.
//   La función SQL hace el cálculo de forma eficiente en el servidor.
//
// ══════════════════════════════════════════════════════════════════

let votesChannel = null;

/**
 * Inicializa el widget de votos para un partido.
 * Carga los porcentajes actuales y se suscribe a cambios.
 * @param {string} partidoId
 */
export async function initVotosEnVivo(partidoId) {
  if (votesChannel) {
    await supabase.removeChannel(votesChannel);
    votesChannel = null;
  }

  // 1. Cargar estado actual de los votos
  await actualizarPorcentajesVotos(partidoId);

  // 2. Verificar si el usuario ya votó
  await marcarVotoActual(partidoId);

  // 3. Suscribirse a cambios en live_votes para este partido
  votesChannel = supabase
    .channel(`votes:${partidoId}`)
    .on(
      'postgres_changes',
      {
        event:  '*',                                  // INSERT y UPDATE (el usuario puede cambiar su voto)
        schema: 'public',
        table:  'live_votes',
        filter: `partido_id=eq.${partidoId}`,
      },
      async () => {
        // Recalcular porcentajes cada vez que alguien vota o cambia su voto
        await actualizarPorcentajesVotos(partidoId);
      }
    )
    .subscribe();
}


/**
 * Llama a la función SQL y actualiza las barras de porcentaje en el DOM.
 * @param {string} partidoId
 */
async function actualizarPorcentajesVotos(partidoId) {
  const { data, error } = await supabase
    .rpc('get_live_vote_stats', { p_partido_id: partidoId });

  if (error) { console.error('Error stats votos:', error.message); return; }

  // Actualizar las barras en el DOM
  // HTML esperado: elementos con data-voto="local|empate|visitante"
  ['local', 'empate', 'visitante'].forEach(tipo => {
    const pct = data[tipo] ?? 0;

    // Barra de progreso
    const barEl = document.querySelector(`[data-voto-bar="${tipo}"]`);
    if (barEl) barEl.style.width = `${pct}%`;

    // Texto del porcentaje
    const pctEl = document.querySelector(`[data-voto-pct="${tipo}"]`);
    if (pctEl) pctEl.textContent = `${pct}%`;
  });

  // Total de votantes
  const totalEl = document.getElementById('votos-total');
  if (totalEl) totalEl.textContent = `${data.total} votos`;
}


/**
 * Verifica si el usuario actual ya votó y marca su opción en la UI.
 * @param {string} partidoId
 */
async function marcarVotoActual(partidoId) {
  if (!currentUser) return;

  const { data } = await supabase
    .from('live_votes')
    .select('voto')
    .eq('partido_id', partidoId)
    .eq('user_id', currentUser.id)
    .single();

  if (data?.voto) {
    // Marcar visualmente el botón activo
    document.querySelectorAll('[data-voto-btn]').forEach(btn => {
      btn.classList.toggle('voted', btn.dataset.votoBtnValue === data.voto);
    });
  }
}


/**
 * Registra o cambia el voto del usuario.
 * Usa UPSERT: si ya votó, actualiza; si no, inserta.
 * @param {string} partidoId
 * @param {'local'|'empate'|'visitante'} opcion
 */
export async function votar(partidoId, opcion) {
  if (!currentUser) {
    document.getElementById('modal-auth')?.classList.add('active');
    return;
  }

  const { error } = await supabase
    .from('live_votes')
    .upsert(
      {
        partido_id: partidoId,
        user_id:    currentUser.id,
        voto:       opcion,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'partido_id,user_id' }  // Actualiza si ya existe el mismo (user, partido)
    );

  if (error) {
    console.error('Error al votar:', error.message);
    return;
  }

  // Marcar visualmente de inmediato (no esperar al Realtime)
  document.querySelectorAll('[data-voto-btn]').forEach(btn => {
    btn.classList.toggle('voted', btn.dataset.votoBtnValue === opcion);
  });
  // Los porcentajes se actualizarán via Realtime
}


// ══════════════════════════════════════════════════════════════════
// SECCIÓN C: PARTIDO EN TIEMPO REAL (Supabase Realtime para goles/minutos)
// ══════════════════════════════════════════════════════════════════
//
// ARQUITECTURA:
//   Node Worker → actualiza `partidos` en Supabase cada 3 minutos
//              → Supabase emite el cambio a todos los suscriptores
//              → Browser recibe el UPDATE y actualiza el marcador
//
// El frontend NO necesita hacer polling. Solo escucha el canal.
//
// ══════════════════════════════════════════════════════════════════

let partidoChannel = null;

/**
 * Suscribirse a actualizaciones en tiempo real de UN partido.
 * Se llama cuando el usuario abre la vista de un partido específico.
 * @param {string} partidoId
 * @param {function} onUpdate — Callback con la nueva fila del partido
 */
export function suscribirseAPartido(partidoId, onUpdate) {
  if (partidoChannel) {
    supabase.removeChannel(partidoChannel);
  }

  partidoChannel = supabase
    .channel(`partido:${partidoId}`)
    .on(
      'postgres_changes',
      {
        event:  'UPDATE',                             // Cuando el Worker actualiza el partido
        schema: 'public',
        table:  'partidos',
        filter: `id=eq.${partidoId}`,                 // Solo ESTE partido
      },
      (payload) => {
        // payload.new contiene todos los campos actualizados del partido
        onUpdate(payload.new);
      }
    )
    .subscribe();

  return partidoChannel;
}

/**
 * Suscribirse a TODOS los partidos en curso (para el ticker y la vista de "En Vivo").
 * @param {function} onUpdate
 */
export function suscribirseAPartidosEnVivo(onUpdate) {
  return supabase
    .channel('partidos-en-vivo')
    .on(
      'postgres_changes',
      {
        event:  'UPDATE',
        schema: 'public',
        table:  'partidos',
        filter: `estado=eq.en_curso`,                 // Solo partidos en curso
      },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();
}


/**
 * Carga los partidos de hoy desde Supabase.
 * El Worker ya los pobló, el frontend solo los lee.
 */
export async function cargarPartidosHoy() {
  const hoyInicio = new Date();
  hoyInicio.setHours(0, 0, 0, 0);
  const hoySiguiente = new Date(hoyInicio);
  hoySiguiente.setDate(hoySiguiente.getDate() + 1);

  const { data, error } = await supabase
    .from('partidos')
    .select('*')
    .gte('fecha_utc', hoyInicio.toISOString())
    .lt('fecha_utc',  hoySiguiente.toISOString())
    .order('fecha_utc', { ascending: true });

  if (error) { console.error('Error cargando partidos:', error.message); return []; }
  return data || [];
}

/**
 * Carga los partidos actualmente en curso.
 */
export async function cargarPartidosEnCurso() {
  const { data, error } = await supabase
    .from('partidos')
    .select('*')
    .eq('estado', 'en_curso')
    .order('fecha_utc', { ascending: true });

  if (error) { console.error('Error cargando en vivo:', error.message); return []; }
  return data || [];
}


// ══════════════════════════════════════════════════════════════════
// SECCIÓN D: EL PRODE (Pronósticos pre-partido)
// ══════════════════════════════════════════════════════════════════
//
// ARQUITECTURA:
//   - El usuario pronostica ANTES de que empiece el partido.
//   - RLS garantiza que no puede modificar el pronóstico después.
//   - Al finalizar el partido, el trigger SQL calcula los puntos
//     y los acumula en profiles.puntos_prode.
//   - El ranking es un simple SELECT ordenado, sin cálculos.
//
// ══════════════════════════════════════════════════════════════════

/**
 * Guarda o actualiza el pronóstico del usuario para un partido.
 * Falla silenciosamente si el partido ya empezó (RLS lo bloquea).
 * @param {string} partidoId
 * @param {number} golesLocal
 * @param {number} golesVisitante
 */
export async function guardarPronostico(partidoId, golesLocal, golesVisitante) {
  if (!currentUser) {
    document.getElementById('modal-auth')?.classList.add('active');
    return { error: 'No autenticado' };
  }

  if (golesLocal < 0 || golesVisitante < 0 || isNaN(golesLocal) || isNaN(golesVisitante)) {
    return { error: 'Los goles no pueden ser negativos.' };
  }

  const { data, error } = await supabase
    .from('prode_predictions')
    .upsert(
      {
        partido_id:           partidoId,
        user_id:              currentUser.id,
        pred_goles_local:     golesLocal,
        pred_goles_visitante: golesVisitante,
        updated_at:           new Date().toISOString(),
      },
      { onConflict: 'partido_id,user_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error guardando pronóstico:', error.message);
    // Código 42501 = RLS bloqueó la operación (partido ya empezó)
    if (error.code === '42501') {
      return { error: 'No podés cambiar el pronóstico de un partido que ya empezó.' };
    }
    return { error: error.message };
  }

  return { data, error: null };
}


/**
 * Obtiene todos los pronósticos del usuario actual con sus resultados.
 * Usa la función SQL para evitar JOINs manuales.
 */
export async function cargarMiProde() {
  if (!currentUser) return [];

  const { data, error } = await supabase
    .rpc('get_my_prode', { p_user_id: currentUser.id });

  if (error) { console.error('Error cargando prode:', error.message); return []; }
  return data || [];
}


/**
 * Obtiene el pronóstico del usuario para UN partido específico.
 * Útil para prellenar el formulario si ya pronosticó.
 * @param {string} partidoId
 */
export async function cargarMiPronostico(partidoId) {
  if (!currentUser) return null;

  const { data, error } = await supabase
    .from('prode_predictions')
    .select('pred_goles_local, pred_goles_visitante, puntos_obtenidos')
    .eq('partido_id', partidoId)
    .eq('user_id', currentUser.id)
    .single();

  if (error) return null;
  return data;
}


// ══════════════════════════════════════════════════════════════════
// SECCIÓN E: RANKING DEL PRODE
// ══════════════════════════════════════════════════════════════════

/**
 * Obtiene el ranking top 20 del prode.
 * Llama a la función SQL: sin JOINs, sin cálculos, solo lectura.
 */
export async function cargarRankingProde(limite = 20) {
  const { data, error } = await supabase
    .rpc('get_prode_ranking', { p_limit: limite });

  if (error) { console.error('Error ranking:', error.message); return []; }
  return data || [];
}

/**
 * Renderiza el ranking en el DOM.
 * HTML esperado: <div id="ranking-container"></div>
 */
export async function renderRanking() {
  const container = document.getElementById('ranking-container');
  if (!container) return;

  container.innerHTML = '<p class="loading-state">Cargando ranking...</p>';

  const ranking = await cargarRankingProde();

  if (!ranking.length) {
    container.innerHTML = '<p class="empty-state">Nadie ha jugado el prode todavía.</p>';
    return;
  }

  container.innerHTML = ranking.map(row => `
    <div class="ranking-row ${row.user_id === currentUser?.id ? 'ranking-row--own' : ''}">
      <span class="ranking-pos ${row.posicion <= 3 ? `ranking-pos--${['gold','silver','bronze'][row.posicion-1]}` : ''}">
        ${row.posicion <= 3 ? ['🥇','🥈','🥉'][row.posicion-1] : row.posicion}
      </span>
      ${row.avatar_url
        ? `<img class="ranking-avatar" src="${row.avatar_url}" alt="${row.username}">`
        : `<span class="ranking-avatar-placeholder">${row.username[0]?.toUpperCase()}</span>`
      }
      <span class="ranking-username">${escapeHtml(row.username)}</span>
      <div class="ranking-stats">
        <span class="ranking-pts">${row.puntos_prode} pts</span>
        <span class="ranking-detail">✅ ${row.aciertos_exactos} exactos · 1️⃣ ${row.aciertos_signo} signos</span>
      </div>
    </div>
  `).join('');
}


// ══════════════════════════════════════════════════════════════════
// SECCIÓN F: INICIALIZACIÓN Y BIND DE EVENTOS
// ══════════════════════════════════════════════════════════════════

/**
 * Inicializa todos los módulos cuando se abre un partido.
 * Llamar desde la función que abre el modal/view del partido.
 * @param {string} partidoId
 * @param {string} estadoPartido — 'programado' | 'en_curso' | 'finalizado'
 */
export async function initPartidoView(partidoId, estadoPartido) {
  // Chat (siempre disponible para lectura)
  await initChat(partidoId);

  // Votos solo si el partido está en curso
  if (estadoPartido === 'en_curso') {
    await initVotosEnVivo(partidoId);
  }

  // Suscribirse a actualizaciones del marcador
  suscribirseAPartido(partidoId, (partidoActualizado) => {
    actualizarMarcadorDOM(partidoActualizado);

    // Si el partido pasó a "en_curso", activar los votos
    if (partidoActualizado.estado === 'en_curso') {
      initVotosEnVivo(partidoId);
    }
  });

  // Prellenar el pronóstico del prode si ya existe
  const miProno = await cargarMiPronostico(partidoId);
  if (miProno) {
    const inputLocal = document.getElementById('prode-goles-local');
    const inputVisit = document.getElementById('prode-goles-visitante');
    if (inputLocal)  inputLocal.value  = miProno.pred_goles_local;
    if (inputVisit)  inputVisit.value  = miProno.pred_goles_visitante;
  }
}


/**
 * Actualiza el marcador y el minuto en el DOM.
 * @param {object} partido — Fila actualizada de la tabla partidos
 */
function actualizarMarcadorDOM(partido) {
  const golesLocalEl = document.getElementById('live-goles-local');
  const golesVisitEl = document.getElementById('live-goles-visitante');
  const minutoEl     = document.getElementById('live-minuto');
  const estadoEl     = document.getElementById('live-estado');

  if (golesLocalEl && partido.goles_local !== null)
    golesLocalEl.textContent = partido.goles_local;

  if (golesVisitEl && partido.goles_visitante !== null)
    golesVisitEl.textContent = partido.goles_visitante;

  if (minutoEl && partido.minuto)
    minutoEl.textContent = `${partido.minuto}'`;

  if (estadoEl)
    estadoEl.textContent = { 'en_curso': 'En Vivo', 'finalizado': 'Finalizado', 'programado': 'Próximamente' }[partido.estado] || '';

  // Actualizar las estadísticas JSON si existen
  if (partido.estadisticas && Object.keys(partido.estadisticas).length) {
    actualizarEstadisticasDOM(partido.estadisticas);
  }
}


/**
 * Actualiza las estadísticas del partido (posesión, tiros, etc.)
 * @param {object} stats — El campo JSONB `estadisticas` del partido
 */
function actualizarEstadisticasDOM(stats) {
  // El Worker guarda las stats con este formato en el campo `estadisticas`:
  // { posesion_local: 55, posesion_visitante: 45, tiros_local: 8, tiros_visitante: 4, ... }
  const campos = [
    ['posesion_local', 'posesion_visitante', 'stat-posesion'],
    ['tiros_local',    'tiros_visitante',    'stat-tiros'],
    ['corners_local',  'corners_visitante',  'stat-corners'],
    ['faltas_local',   'faltas_visitante',   'stat-faltas'],
  ];

  campos.forEach(([keyLocal, keyVisit, elId]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    const valLocal = stats[keyLocal] ?? 0;
    const valVisit = stats[keyVisit] ?? 0;
    const total    = valLocal + valVisit || 1;
    const pctLocal = Math.round(valLocal / total * 100);

    const barHome = el.querySelector('[data-stat-bar="home"]');
    const barAway = el.querySelector('[data-stat-bar="away"]');
    const numHome = el.querySelector('[data-stat-num="home"]');
    const numAway = el.querySelector('[data-stat-num="away"]');

    if (barHome) barHome.style.width = `${pctLocal}%`;
    if (barAway) barAway.style.width = `${100 - pctLocal}%`;
    if (numHome) numHome.textContent = valLocal;
    if (numAway) numAway.textContent = valVisit;
  });
}


// Bind de eventos globales (ejecutar después del DOM ready)
export function initEventosRealtime() {
  // ── Botones de voto ──────────────────────────────────────────────
  // HTML: <button data-voto-btn data-voto-btn-value="local" data-partido-id="UUID">Local</button>
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-voto-btn]');
    if (!btn) return;
    const partidoId = btn.dataset.partidoId;
    const opcion    = btn.dataset.votoBtnValue;
    if (partidoId && opcion) votar(partidoId, opcion);
  });

  // ── Enviar mensaje de chat ────────────────────────────────────────
  // HTML: <button id="chat-send-btn" data-partido-id="UUID">Enviar</button>
  document.getElementById('chat-send-btn')?.addEventListener('click', () => {
    const input     = document.getElementById('chat-input');
    const partidoId = document.getElementById('chat-send-btn')?.dataset.partidoId;
    if (!input?.value || !partidoId) return;
    enviarMensaje(partidoId, input.value);
    input.value = '';
  });

  // ── Enter para enviar en el chat ──────────────────────────────────
  document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('chat-send-btn')?.click();
    }
  });

  // ── Guardar pronóstico del prode ──────────────────────────────────
  // HTML: <button id="prode-save-btn" data-partido-id="UUID">Guardar Pronóstico</button>
  document.getElementById('prode-save-btn')?.addEventListener('click', async () => {
    const btn       = document.getElementById('prode-save-btn');
    const partidoId = btn?.dataset.partidoId;
    const golesL    = parseInt(document.getElementById('prode-goles-local')?.value);
    const golesV    = parseInt(document.getElementById('prode-goles-visitante')?.value);

    if (!partidoId) return;

    btn.disabled    = true;
    btn.textContent = 'Guardando...';

    const { error } = await guardarPronostico(partidoId, golesL, golesV);

    btn.disabled    = false;
    btn.textContent = error ? 'Error al guardar' : '¡Pronóstico guardado! ✓';
    setTimeout(() => { btn.textContent = 'Guardar Pronóstico'; }, 3000);
  });
}


// ──────────────────────────────────────────────────────────────────
// HELPER: Escapar HTML para evitar XSS en el chat
// ──────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


// ──────────────────────────────────────────────────────────────────
// INICIALIZACIÓN GLOBAL
// ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initEventosRealtime();

  // Suscribirse a todos los partidos en curso para el ticker/dashboard
  suscribirseAPartidosEnVivo((partidoActualizado) => {
    if (window.actualizarPaneles && partidoActualizado && partidoActualizado.equipo_local) {
        window.actualizarPaneles(partidoActualizado.equipo_local);

        // Bonus: Cambiamos el select visualmente para que coincida con el partido
        const selectFiltro = document.getElementById('filtro-noticias');
        if (selectFiltro) selectFiltro.value = partidoActualizado.equipo_local;
    }
    
    // Actualizar el ticker y las tarjetas de partidos en vivo
    const card = document.querySelector(`[data-partido-id="${partidoActualizado.id}"]`);
    if (!card) return;

    const golesEl = card.querySelector('[data-live-score]');
    if (golesEl) {
      golesEl.textContent = `${partidoActualizado.goles_local ?? 0} - ${partidoActualizado.goles_visitante ?? 0}`;
    }

    const minEl = card.querySelector('[data-live-minute]');
    if (minEl && partidoActualizado.minuto) {
      minEl.textContent = `${partidoActualizado.minuto}'`;
    }
  });

  // Cargar ranking si estamos en el panel del prode
  if (document.getElementById('ranking-container')) {
    await renderRanking();
  }
});
