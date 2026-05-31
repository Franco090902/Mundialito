// ══════════════════════════════════════════════════════════════════
// encuestas.js — Encuestas Rápidas En Vivo · Mundialito 2026
//
// Arquitectura:
//   Browser detecta partido en vivo
//     → genera/carga encuestas desde Supabase
//     → renderiza debajo de cada match card
//     → voto: Browser → supabase.encuestas_votos.insert()
//     → Supabase Realtime notifica a todos
//     → polling cada 7s como fallback
//
// NO modifica live_votes (sistema de votos binario existente).
// Browser → Supabase directo, sin pasar por server.js.
// ══════════════════════════════════════════════════════════════════

import { supabase, currentUser } from './auth.js';

// ── Estado global ──────────────────────────────────────────────
const pollingIntervals = new Map(); // partidoId → intervalId
const realtimeChannels = new Map(); // partidoId → channel
const ultimoVoto       = new Map(); // encuestaId → timestamp (cooldown)
const estadoExpandido  = new Map(); // partidoId → boolean (collapsed/expanded)
const COOLDOWN_MS      = 10_000;    // 10 segundos entre votos por encuesta

// ── Íconos por tipo de encuesta ────────────────────────────────
const TIPO_ICON = {
  winner:      '🏆',
  cards_range: '🟨',
  fouls_range: '⚠️',
  mvp:         '⭐',
  possession:  '📊',
  next_scorer: '⚽',
  goal_type:   '🎯',
  first_sub:   '🔄',
  direct_card: '🟥',
};

// ── Templates de encuesta por tipo ────────────────────────────
function getTemplates(teamA, teamB) {
  return {
    winner: {
      pregunta: `¿Quién ganará el partido?`,
      opciones: [teamA, 'Empate', teamB],
    },
    cards_range: {
      pregunta: '¿Cuántas tarjetas amarillas habrá en total?',
      opciones: ['0–2 tarjetas', '3–5 tarjetas', '6+ tarjetas'],
    },
    fouls_range: {
      pregunta: '¿Total de faltas en el partido?',
      opciones: ['Menos de 12', '12–20 faltas', 'Más de 20'],
    },
    mvp: {
      pregunta: '¿Figura del partido?',
      opciones: [`Mejor de ${teamA}`, `Mejor de ${teamB}`, 'Empate de rendimiento'],
    },
    possession: {
      pregunta: '¿Quién dominará la posesión?',
      opciones: [teamA, 'Igualada (~50%)', teamB],
    },
    next_scorer: {
      pregunta: '¿Próximo equipo en anotar?',
      opciones: [teamA, teamB, 'No habrá más goles'],
    },
    goal_type: {
      pregunta: '¿Cómo será el próximo gol?',
      opciones: ['Dentro del área', 'Fuera del área', 'De cabeza / penal'],
    },
    first_sub: {
      pregunta: '¿Cuándo será el primer cambio?',
      opciones: ['Antes del min 30', 'Entre min 30–60', 'Después del min 60'],
    },
    direct_card: {
      pregunta: '¿Habrá tarjeta roja directa?',
      opciones: ['Sí, habrá', 'No habrá'],
    },
  };
}

// ── Selección de tipos de encuesta según el minuto ────────────
function seleccionarTipos(minuto) {
  const min = parseInt(minuto) || 0;
  if (min <= 30)  return ['winner', 'first_sub', 'cards_range'];
  if (min <= 60)  return ['possession', 'fouls_range', 'winner'];
  return ['next_scorer', 'goal_type', 'direct_card'];
}

// ══════════════════════════════════════════════════════════════════
// SECCIÓN A: Generación automática de encuestas
// ══════════════════════════════════════════════════════════════════

/**
 * Genera hasta 3 encuestas para un partido y las persiste en Supabase.
 * Solo inserta si aún no existen encuestas activas para ese partido.
 */
async function generarEncuestasParaPartido(partido) {
  const { id: partidoId, equipo_local: teamA, equipo_visitante: teamB, minuto } = partido;

  // Verificar si ya hay encuestas para este partido
  const { data: existentes } = await supabase
    .from('encuestas')
    .select('id')
    .eq('partido_id', partidoId)
    .eq('activa', true)
    .limit(1);

  if (existentes && existentes.length > 0) return true; // Ya existen, OK

  const tipos     = seleccionarTipos(minuto);
  const templates = getTemplates(teamA, teamB);

  const encuestasAInsertar = tipos.slice(0, 3).map(tipo => ({
    partido_id:          partidoId,
    pregunta:            templates[tipo].pregunta,
    tipo,
    opciones:            templates[tipo].opciones.map(label => ({ label, votes: 0 })),
    activa:              true,
    creada_en:           parseInt(minuto) || 0,
    expires_at_minute:   90,
  }));

  const { error } = await supabase.from('encuestas').insert(encuestasAInsertar);

  if (error) {
    console.warn(`[Encuestas] Error generando: ${error.message}`);
    if (error.message && error.message.includes('row-level security')) {
      console.error('[Encuestas] ❌ RLS bloqueó el INSERT. Ejecutá en Supabase SQL Editor:\n' +
        "DROP POLICY IF EXISTS \"encuestas_insert_authenticated\" ON public.encuestas;\n" +
        "CREATE POLICY \"encuestas_insert_authenticated\" ON public.encuestas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);");
    }
    return false;
  }

  console.log(`[Encuestas] ✅ ${encuestasAInsertar.length} encuestas generadas para ${teamA} vs ${teamB}`);
  return true;
}

// ══════════════════════════════════════════════════════════════════
// SECCIÓN B: Carga de datos desde Supabase
// ══════════════════════════════════════════════════════════════════

/**
 * Carga las encuestas activas de un partido con sus conteos de votos.
 * @returns {Array} encuestas enriquecidas con userVote y percentages
 */
async function cargarEncuestasPartido(partidoId) {
  // 1. Obtener encuestas activas
  const { data: encuestas, error } = await supabase
    .from('encuestas')
    .select('*')
    .eq('partido_id', partidoId)
    .eq('activa', true)
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) {
    console.error('[Encuestas] Error cargando:', error.message);
    return [];
  }
  if (!encuestas || encuestas.length === 0) return [];

  // 2. Obtener votos del usuario actual (si está logueado)
  const misVotos = {};
  if (currentUser) {
    const { data: votosData } = await supabase
      .from('encuestas_votos')
      .select('encuesta_id, opcion_index')
      .eq('user_id', currentUser.id)
      .in('encuesta_id', encuestas.map(e => e.id));

    if (votosData) {
      votosData.forEach(v => { misVotos[v.encuesta_id] = v.opcion_index; });
    }
  }

  // 3. Obtener conteos de votos por encuesta (usando la función RPC)
  const encuestasEnriquecidas = await Promise.all(
    encuestas.map(async (encuesta) => {
      let totalVotos = 0;
      const conteosPorOpcion = {};

      try {
        const { data: stats } = await supabase
          .rpc('get_encuesta_stats', { p_encuesta_id: encuesta.id });

        if (stats) {
          totalVotos = parseInt(stats.total) || 0;
          const porOpcion = stats.por_opcion || {};
          Object.entries(porOpcion).forEach(([idx, count]) => {
            conteosPorOpcion[parseInt(idx)] = parseInt(count) || 0;
          });
        }
      } catch (e) {
        // Función RPC puede no existir aún, silenciar
      }

      // Calcular porcentajes
      const opciones = (encuesta.opciones || []).map((op, i) => {
        const votes = conteosPorOpcion[i] || 0;
        const pct   = totalVotos > 0 ? Math.round((votes / totalVotos) * 100) : 0;
        return { ...op, votes, percentage: pct };
      });

      return {
        ...encuesta,
        opciones,
        totalVotos,
        userVote: misVotos[encuesta.id] !== undefined ? misVotos[encuesta.id] : null,
      };
    })
  );

  return encuestasEnriquecidas;
}

// ══════════════════════════════════════════════════════════════════
// SECCIÓN C: Renderizado HTML
// ══════════════════════════════════════════════════════════════════

/**
 * Renderiza el panel completo de encuestas para un partido.
 * Inserta el HTML debajo de la tarjeta match-live correspondiente.
 */
export async function renderEncuestasPartido(partido) {
  const { id: partidoId, equipo_local: teamA, equipo_visitante: teamB } = partido;

  // Encontrar el contenedor del partido en el DOM
  const matchCard = document.querySelector(`.match-live[data-partido-id="${partidoId}"]`);
  if (!matchCard) return;

  // Verificar si ya existe el panel (para actualizaciones)
  const existingPanel = document.getElementById(`encuestas-panel-${partidoId}`);
  if (!existingPanel) {
    // Primera vez: crear el panel esqueleto colapsado y adjuntarlo al wrapper
    const panel = document.createElement('div');
    panel.id = `encuestas-panel-${partidoId}`;
    panel.innerHTML = buildPanelHTML(partidoId, [], true); // true = expandido con skeleton
    // Insertar inmediatamente después del match card
    matchCard.insertAdjacentElement('afterend', panel);
  }

  // Generar encuestas si no existen — si RLS falla, mostrar estado de error
  const ok = await generarEncuestasParaPartido(partido);

  if (ok === false) {
    // RLS bloqueó el INSERT — mostrar mensaje amigable
    const inner = document.getElementById(`encuestas-inner-${partidoId}`);
    if (inner) {
      inner.querySelector('.encuestas-inner').innerHTML = `
        <div class="encuestas-empty">
          🔒 Las encuestas necesitan permisos de base de datos.<br>
          <span style="font-size:10px;color:var(--text4)">Ejecutá el SQL de fix en Supabase y recargá la página.</span>
        </div>`;
    }
    return;
  }

  // Cargar y renderizar las encuestas generadas
  await actualizarEncuestasDOM(partidoId, teamA, teamB);
  // Iniciar Realtime + polling
  suscribirseAEncuestasPartido(partidoId, teamA, teamB);
  iniciarPollingPartido(partidoId, teamA, teamB);
}

/**
 * Actualiza el contenido del panel de encuestas (sin recrear el toggle).
 */
async function actualizarEncuestasDOM(partidoId, teamA, teamB) {
  const panel = document.getElementById(`encuestas-panel-${partidoId}`);
  if (!panel) return;

  const encuestas = await cargarEncuestasPartido(partidoId);
  const expanded  = estadoExpandido.get(partidoId) !== false; // default: expandido

  panel.innerHTML = buildPanelHTML(partidoId, encuestas, expanded);
}

/**
 * Construye el HTML completo del panel de encuestas.
 */
function buildPanelHTML(partidoId, encuestas, expanded) {
  const count = encuestas.length;

  // Mostrar skeleton si estamos cargando (0 encuestas y primera vez)
  const innerContent = count === 0
    ? buildSkeletonHTML()
    : encuestas.map(e => buildEncuestaCardHTML(e, partidoId)).join('');

  return `
    <div class="encuestas-toggle" onclick="window.toggleEncuestasPanel('${partidoId}')" 
         aria-expanded="${expanded}" aria-controls="encuestas-inner-${partidoId}">
      <span class="encuestas-toggle-dot"></span>
      <span class="encuestas-toggle-label">VOTOS EN VIVO</span>
      ${count > 0 ? `<span class="encuestas-toggle-count">${count} encuesta${count > 1 ? 's' : ''}</span>` : ''}
      <span class="encuestas-toggle-chevron ${expanded ? 'open' : ''}" aria-hidden="true">▼</span>
    </div>
    <div class="encuestas-panel ${expanded ? 'expanded' : 'collapsed'}" 
         id="encuestas-inner-${partidoId}"
         style="${expanded ? '' : 'display:none'}">
      <div class="encuestas-inner">
        ${innerContent}
      </div>
    </div>
  `;
}

/**
 * Construye el HTML de una card de encuesta individual.
 */
function buildEncuestaCardHTML(encuesta, partidoId) {
  const { id, tipo, pregunta, opciones, totalVotos, userVote, activa } = encuesta;
  const icono    = TIPO_ICON[tipo] || '📊';
  const yaVoto   = userVote !== null && userVote !== undefined;
  const cerrada  = !activa;
  const mostrarPct = yaVoto || cerrada;

  const opcionesHTML = opciones.map((op, i) => {
    const esVotada  = yaVoto && userVote === i;
    const pct       = mostrarPct ? (op.percentage || 0) : 0;
    const disabled  = cerrada || !currentUser ? 'disabled' : '';
    const votedClass = esVotada ? 'voted' : '';
    const disabledClass = (cerrada || disabled) ? 'disabled' : '';

    return `
      <div class="encuesta-opcion ${votedClass} ${disabledClass}"
           role="button"
           tabindex="${disabled ? '-1' : '0'}"
           aria-label="${op.label}${mostrarPct ? ` — ${pct}%` : ''}"
           aria-pressed="${esVotada}"
           ${!disabled && !cerrada ? `onclick="window.votarEncuesta('${id}', ${i}, '${partidoId}')"
           onkeydown="if(event.key==='Enter'||event.key===' ')window.votarEncuesta('${id}',${i},'${partidoId}')"` : ''}>
        <div class="encuesta-barra" style="width: ${pct}%" aria-hidden="true"></div>
        <div class="encuesta-opcion-contenido">
          <span class="encuesta-opcion-label">${escapeHtml(op.label)}</span>
          <span class="encuesta-check" aria-hidden="true">✓</span>
          <span class="encuesta-opcion-pct" aria-hidden="true">
            ${mostrarPct ? `${pct}%` : ''}
          </span>
        </div>
      </div>
    `;
  }).join('');

  const footerHTML = !cerrada
    ? `<div class="encuesta-footer" aria-live="polite">
         <span class="encuesta-live-dot" aria-hidden="true"></span>
         <span class="encuesta-live-label">${totalVotos} VOTOS EN VIVO</span>
       </div>`
    : `<div class="encuesta-footer">
         <span class="encuesta-closed-badge">CERRADA</span>
       </div>`;

  const sinLoginMsg = !currentUser && !cerrada
    ? `<p style="font-size:10px;color:var(--text4);text-align:center;margin-top:6px;font-family:var(--font-ui)">
         Inicia sesión para votar
       </p>`
    : '';

  return `
    <div class="encuesta-card" id="encuesta-card-${id}" 
         role="group" aria-label="${pregunta}">
      <div class="encuesta-header">
        <span class="encuesta-icon" aria-hidden="true">${icono}</span>
        <span class="encuesta-pregunta">${escapeHtml(pregunta)}</span>
      </div>
      <div class="encuesta-opciones" role="radiogroup" aria-label="Opciones de votación">
        ${opcionesHTML}
      </div>
      ${footerHTML}
      ${sinLoginMsg}
    </div>
  `;
}

/**
 * Skeleton loader mientras se cargan las encuestas.
 */
function buildSkeletonHTML() {
  return `
    <div class="encuesta-card">
      <div class="encuesta-skeleton" style="height:14px;width:60%;margin-bottom:12px;border-radius:3px"></div>
      <div class="encuesta-skeleton" style="height:32px;margin-bottom:6px"></div>
      <div class="encuesta-skeleton" style="height:32px;margin-bottom:6px"></div>
      <div class="encuesta-skeleton" style="height:32px"></div>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════
// SECCIÓN D: Votación
// ══════════════════════════════════════════════════════════════════

/**
 * Registra el voto del usuario en una encuesta.
 * Expuesto globalmente para usarse desde el onclick del HTML.
 */
window.votarEncuesta = async function (encuestaId, opcionIndex, partidoId) {
  // Validar: usuario logueado
  if (!currentUser) {
    document.getElementById('auth-overlay')?.style.removeProperty('display');
    return;
  }

  // Validar: cooldown de 10 segundos
  const ahora    = Date.now();
  const ultimoTs = ultimoVoto.get(encuestaId) || 0;
  if (ahora - ultimoTs < COOLDOWN_MS) {
    const restante = Math.ceil((COOLDOWN_MS - (ahora - ultimoTs)) / 1000);
    mostrarCooldownMsg(encuestaId, restante);
    return;
  }

  // Validar: no votar si ya votó
  const card = document.getElementById(`encuesta-card-${encuestaId}`);
  if (card?.querySelector('.encuesta-opcion.voted')) return;

  // Actualización optimista en UI (antes de confirmar en Supabase)
  const opcionEl = card?.querySelectorAll('.encuesta-opcion')[opcionIndex];
  if (opcionEl) {
    opcionEl.classList.add('voted');
    opcionEl.classList.add('disabled');
    // Deshabilitar todas las opciones
    card.querySelectorAll('.encuesta-opcion').forEach(el => el.classList.add('disabled'));
  }

  ultimoVoto.set(encuestaId, ahora);

  // Persistir en Supabase
  const { error } = await supabase
    .from('encuestas_votos')
    .upsert(
      {
        encuesta_id:  encuestaId,
        user_id:      currentUser.id,
        opcion_index: opcionIndex,
      },
      { onConflict: 'encuesta_id,user_id' }
    );

  if (error) {
    console.error('[Encuestas] Error al votar:', error.message);
    // Revertir optimismo en caso de error
    if (opcionEl) {
      opcionEl.classList.remove('voted');
      card.querySelectorAll('.encuesta-opcion').forEach(el => el.classList.remove('disabled'));
    }
    return;
  }

  // Actualizar inmediatamente los porcentajes (el Realtime también lo hará)
  setTimeout(() => actualizarEncuestasDOM(partidoId, '', ''), 300);
};

/**
 * Muestra un mensaje de cooldown debajo de la card.
 */
function mostrarCooldownMsg(encuestaId, segundos) {
  const card = document.getElementById(`encuesta-card-${encuestaId}`);
  if (!card) return;

  // Evitar duplicados
  let msg = card.querySelector('.encuesta-cooldown-msg');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'encuesta-cooldown-msg';
    card.appendChild(msg);
  }
  msg.textContent = `⏳ Esperá ${segundos}s antes de votar de nuevo`;
  clearTimeout(msg._timeout);
  msg._timeout = setTimeout(() => msg.remove(), 3000);
}

// ══════════════════════════════════════════════════════════════════
// SECCIÓN E: Tiempo Real (Supabase Realtime + Polling)
// ══════════════════════════════════════════════════════════════════

/**
 * Suscribe a cambios en `encuestas_votos` para un partido.
 */
function suscribirseAEncuestasPartido(partidoId, teamA, teamB) {
  if (realtimeChannels.has(partidoId)) return; // ya suscrito

  const channel = supabase
    .channel(`encuestas:${partidoId}`)
    .on(
      'postgres_changes',
      {
        event:  '*',
        schema: 'public',
        table:  'encuestas_votos',
        // No podemos filtrar por partido_id directamente aquí (es encuesta_id)
        // pero el polling complementa esto
      },
      async () => {
        // Actualizar porcentajes al recibir cualquier cambio de votos
        await actualizarEncuestasDOM(partidoId, teamA, teamB);
      }
    )
    .subscribe();

  realtimeChannels.set(partidoId, channel);
}

/**
 * Inicia polling cada 7 segundos para actualizar porcentajes
 * (fallback si Realtime no entrega el evento).
 */
function iniciarPollingPartido(partidoId, teamA, teamB) {
  if (pollingIntervals.has(partidoId)) return;

  const intervalId = setInterval(async () => {
    // Solo actualizar si el panel está expandido y visible
    const panel = document.getElementById(`encuestas-inner-${partidoId}`);
    if (panel && panel.style.display !== 'none') {
      await actualizarEncuestasDOM(partidoId, teamA, teamB);
    }
  }, 7_000);

  pollingIntervals.set(partidoId, intervalId);
}

/**
 * Limpia suscripciones y polling para un partido (cuando termina / cambia de tab).
 */
export function limpiarEncuestasPartido(partidoId) {
  const intervalId = pollingIntervals.get(partidoId);
  if (intervalId) {
    clearInterval(intervalId);
    pollingIntervals.delete(partidoId);
  }

  const channel = realtimeChannels.get(partidoId);
  if (channel) {
    supabase.removeChannel(channel);
    realtimeChannels.delete(partidoId);
  }
}

/**
 * Limpia todas las suscripciones activas (al cambiar de sección).
 */
export function limpiarTodasEncuestas() {
  pollingIntervals.forEach((id) => clearInterval(id));
  pollingIntervals.clear();

  realtimeChannels.forEach((ch) => supabase.removeChannel(ch));
  realtimeChannels.clear();
}

// ══════════════════════════════════════════════════════════════════
// SECCIÓN F: Toggle del panel (colapsar/expandir)
// ══════════════════════════════════════════════════════════════════

/**
 * Colapsa o expande el panel de encuestas de un partido.
 * Expuesto globalmente para usarse desde el onclick del HTML.
 */
window.toggleEncuestasPanel = function (partidoId) {
  const panel    = document.getElementById(`encuestas-inner-${partidoId}`);
  const toggle   = document.querySelector(`#encuestas-panel-${partidoId} .encuestas-toggle`);
  const chevron  = toggle?.querySelector('.encuestas-toggle-chevron');

  if (!panel) return;

  const abierto = panel.style.display !== 'none';

  if (abierto) {
    // Colapsar con animación
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.offsetHeight; // force reflow
    panel.style.transition = 'max-height 0.3s ease, opacity 0.25s ease';
    panel.style.maxHeight = '0';
    panel.style.opacity   = '0';
    panel.style.overflow  = 'hidden';
    setTimeout(() => { panel.style.display = 'none'; }, 300);
    chevron?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    estadoExpandido.set(partidoId, false);
  } else {
    // Expandir con animación
    panel.style.display   = 'block';
    panel.style.maxHeight = '0';
    panel.style.opacity   = '0';
    panel.style.overflow  = 'hidden';
    panel.offsetHeight; // force reflow
    panel.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
    panel.style.maxHeight  = panel.scrollHeight + 'px';
    panel.style.opacity    = '1';
    setTimeout(() => {
      panel.style.maxHeight = 'none';
      panel.style.overflow  = '';
    }, 350);
    chevron?.classList.add('open');
    toggle?.setAttribute('aria-expanded', 'true');
    estadoExpandido.set(partidoId, true);
  }
};

// ══════════════════════════════════════════════════════════════════
// SECCIÓN G: Punto de entrada principal
// ══════════════════════════════════════════════════════════════════

/**
 * Inicializa las encuestas para TODOS los partidos en vivo.
 * Llamar desde renderLivePanel() en app.js.
 * @param {Array} partidos — Array de objetos de partidos en curso
 */
export async function inicializarEncuestasEnVivo(partidos) {
  if (!partidos || partidos.length === 0) {
    limpiarTodasEncuestas();
    return;
  }

  // Limpiar partidos que ya no están en vivo
  const idsActivos = new Set(partidos.map(p => p.id));
  pollingIntervals.forEach((_, id) => {
    if (!idsActivos.has(id)) limpiarEncuestasPartido(id);
  });

  // Inicializar para cada partido en vivo
  for (const partido of partidos) {
    await renderEncuestasPartido(partido);
  }
}

// ── Helper: escape XSS ────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
