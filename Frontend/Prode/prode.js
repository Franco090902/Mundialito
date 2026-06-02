/**
 * prode.js — Módulo de Prode (Predicciones Deportivas)
 * Mundialito 2026 · Vanilla JS ESM · Supabase anon_key
 *
 * Exports:
 *   initProde(userId) — punto de entrada principal
 *
 * Este módulo se importa en el script principal del HTML.
 * Depende de que `supabase` sea accesible vía window.supabaseClient
 * (o importado desde auth.js).
 */

import { supabase } from '../auth.js';

// ══════════════════════════════════════════════════════════════════
// ESTADO INTERNO DEL MÓDULO
// ══════════════════════════════════════════════════════════════════
let _userId       = null;
let _partidos     = [];       // Array de todos los partidos cargados
let _predictions  = {};       // { [partido_id]: { pred_local, pred_visit, puntos_obtenidos, puntos_bonus, bonus_aplicado } }
let _pendingChanges = new Set(); // IDs de partidos con cambios no guardados
let _myGroups     = [];       // Grupos a los que pertenece el usuario
let _saveBtn      = null;

// ══════════════════════════════════════════════════════════════════
// PUNTO DE ENTRADA PRINCIPAL
// ══════════════════════════════════════════════════════════════════
/**
 * Inicializa el módulo de Prode.
 * @param {string} userId — UUID del usuario autenticado
 */
export async function initProde(userId) {
  _userId = userId;

  if (!_userId) {
    renderNoAuth();
    return;
  }

  // Mostrar sub-panel de predicciones por defecto
  switchSubTab('predictions');
  renderSkeletons();

  try {
    // Carga en paralelo para mayor velocidad
    const [partidos, predictions] = await Promise.all([
      fetchPartidos(),
      fetchPredictions(userId),
    ]);

    _partidos    = partidos;
    _predictions = predictions;

    renderPredictionsPanel();
    initSearchBar();
    initSaveButton();

    // Cargar comunidades en background
    loadCommunities();

  } catch (err) {
    console.error('[Prode] Error al inicializar:', err);
    renderError('No se pudo cargar el Prode. Verificá tu conexión e intentá de nuevo.');
  }
}

// ══════════════════════════════════════════════════════════════════
// FETCH: PARTIDOS
// ══════════════════════════════════════════════════════════════════
async function fetchPartidos() {
  const { data, error } = await supabase
    .from('partidos')
    .select('id, fase, equipo_local, equipo_visitante, escudo_local, escudo_visitante, fecha_utc, goles_local, goles_visitante, estado, jornada')
    .neq('edicion_mundial', 'libertadores_2026')
    .order('fecha_utc', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ══════════════════════════════════════════════════════════════════
// FETCH: PREDICCIONES DEL USUARIO
// ══════════════════════════════════════════════════════════════════
async function fetchPredictions(userId) {
  const { data, error } = await supabase
    .from('prode_predictions')
    .select('partido_id, pred_goles_local, pred_goles_visitante, puntos_obtenidos, puntos_bonus, bonus_aplicado')
    .eq('user_id', userId);

  if (error) throw error;

  const map = {};
  (data || []).forEach(p => {
    map[p.partido_id] = {
      local:    p.pred_goles_local,
      visitante: p.pred_goles_visitante,
      puntos:   p.puntos_obtenidos,
      bonus:    p.puntos_bonus,
      bonusAplicado: p.bonus_aplicado,
    };
  });
  return map;
}

// ══════════════════════════════════════════════════════════════════
// FUNCIÓN DE PUNTUACIÓN (utilidad JS puro)
// ══════════════════════════════════════════════════════════════════
/**
 * Calcula los puntos que obtiene una predicción dado el resultado real.
 *
 * @param {number} predLocal    — Goles predichos del local
 * @param {number} predVisit   — Goles predichos del visitante
 * @param {number|null} realLocal   — Goles reales del local  (null si no terminó)
 * @param {number|null} realVisit  — Goles reales del visitante
 * @returns {{ puntos: number|null, tipo: 'exacto'|'signo'|'fallo'|'pendiente' }}
 */
export function calcularPuntos(predLocal, predVisit, realLocal, realVisit) {
  // Partido sin resultado final
  if (realLocal === null || realLocal === undefined ||
      realVisit === null || realVisit === undefined) {
    return { puntos: null, tipo: 'pendiente' };
  }

  // Acierto exacto → 3 puntos
  if (predLocal === realLocal && predVisit === realVisit) {
    return { puntos: 3, tipo: 'exacto' };
  }

  // Acierto de signo (ganador o empate) → 1 punto
  const signPred = Math.sign(predLocal - predVisit);
  const signReal = Math.sign(realLocal - realVisit);
  if (signPred === signReal) {
    return { puntos: 1, tipo: 'signo' };
  }

  // Fallo completo → 0 puntos
  return { puntos: 0, tipo: 'fallo' };
}

/**
 * Verifica si el bonus de 5 puntos aplica para un set de predicciones de grupo/fecha.
 * El bonus se aplica si el usuario acertó TODOS los resultados exactos o ganadores
 * de un grupo completo, o de una fecha completa en playoffs.
 *
 * Nota: La asignación formal del bonus se hace en backend (columna `puntos_bonus`).
 * Esta función es solo para calcular/mostrar en el frontend.
 *
 * @param {Array} predicciones — Array de { pred, real } para todos los partidos del grupo/fecha
 * @returns {boolean}
 */
export function verificarBonus(predicciones) {
  if (!predicciones || predicciones.length === 0) return false;
  // Todos deben estar finalizados y con al menos signo correcto
  return predicciones.every(({ pred, real }) => {
    const r = calcularPuntos(pred.local, pred.visitante, real.local, real.visitante);
    return r.puntos !== null && r.puntos > 0;
  });
}

// ══════════════════════════════════════════════════════════════════
// CLASIFICADOR: Grupos vs Playoffs
// ══════════════════════════════════════════════════════════════════
function clasificarPartidos(partidos) {
  const grupos   = {};  // { 'A': [...], 'B': [...], ... }
  const playoffs = [];

  partidos.forEach(p => {
    const fase = (p.fase || '').trim();
    // Detectar si es fase de grupos
    const grupoMatch = fase.match(/^(?:Grupo\s*)?([A-L])$/i)
                    || fase.match(/^(?:GROUP_?)([A-L])$/i)
                    || fase.match(/^([A-L])$/i);

    if (grupoMatch) {
      const letra = grupoMatch[1].toUpperCase();
      if (!grupos[letra]) grupos[letra] = [];
      grupos[letra].push(p);
    } else {
      playoffs.push(p);
    }
  });

  // Ordenar grupos A-L y playoffs por fecha
  const gruposOrdenados = {};
  Object.keys(grupos).sort().forEach(k => {
    gruposOrdenados[k] = grupos[k];
  });

  const playoffOrder = [
    'Dieciseisavos', 'Dieciseisavos de Final',
    'Octavos', 'Octavos de Final',
    'Cuartos', 'Cuartos de Final',
    'Semifinales', 'Semifinal',
    'Tercer Puesto', 'Tercer lugar',
    'Final'
  ];

  playoffs.sort((a, b) => {
    const ia = playoffOrder.findIndex(x => (a.fase || '').includes(x));
    const ib = playoffOrder.findIndex(x => (b.fase || '').includes(x));
    if (ia !== -1 && ib !== -1) return ia - ib;
    return new Date(a.fecha_utc) - new Date(b.fecha_utc);
  });

  return { grupos: gruposOrdenados, playoffs };
}

// ══════════════════════════════════════════════════════════════════
// UTILIDAD: ¿Está bloqueado este partido?
// ══════════════════════════════════════════════════════════════════
function estaBloquado(partido) {
  const ahora = Date.now();
  const fechaPartido = new Date(partido.fecha_utc).getTime();
  const unaHoraMs = 60 * 60 * 1000;

  // Bloqueado si: ya terminó, está en curso, o faltan ≤ 60 minutos
  return partido.estado === 'finalizado'
      || partido.estado === 'en_curso'
      || partido.estado === 'suspendido'
      || (fechaPartido - ahora) <= unaHoraMs;
}

// ══════════════════════════════════════════════════════════════════
// RENDER: Panel de predicciones completo
// ══════════════════════════════════════════════════════════════════
function renderPredictionsPanel() {
  const container = document.getElementById('prode-predictions-content');
  if (!container) return;

  if (_partidos.length === 0) {
    container.innerHTML = `
      <div class="prode-empty">
        <span class="prode-empty-icon">⚽</span>
        <div class="prode-empty-title">Sin partidos disponibles</div>
        <div class="prode-empty-sub">Los partidos aparecerán aquí cuando estén cargados en el sistema.</div>
      </div>`;
    return;
  }

  const { grupos, playoffs } = clasificarPartidos(_partidos);
  let html = '';

  // ── SECCIÓN: FASE DE GRUPOS ──
  const hayGrupos = Object.keys(grupos).length > 0;
  if (hayGrupos) {
    html += `
      <div class="prode-section-header">
        <div class="prode-section-title">Fase de Grupos</div>
        <div class="prode-section-badge">GRUPOS</div>
        <div class="prode-section-line"></div>
      </div>`;

    Object.entries(grupos).forEach(([letra, partidos]) => {
      html += `
        <div class="prode-group-block" data-group="${letra}">
          <div class="prode-group-label">Grupo ${letra}</div>
          <div class="prode-matches-grid">
            ${partidos.map(p => renderMatchCard(p)).join('')}
          </div>
        </div>`;
    });
  }

  // ── SECCIÓN: PLAYOFFS ──
  if (playoffs.length > 0) {
    // Agrupar playoffs por fase
    const fasesPlayoff = {};
    playoffs.forEach(p => {
      const fase = p.fase || 'Por definirse';
      if (!fasesPlayoff[fase]) fasesPlayoff[fase] = [];
      fasesPlayoff[fase].push(p);
    });

    html += `
      <div class="prode-section-header" style="margin-top: 40px;">
        <div class="prode-section-title">Fases de Playoffs</div>
        <div class="prode-section-badge">ELIMINATORIAS</div>
        <div class="prode-section-line"></div>
      </div>`;

    Object.entries(fasesPlayoff).forEach(([fase, partidos]) => {
      html += `
        <div class="prode-group-block" data-group="${fase}">
          <div class="prode-group-label">${fase}</div>
          <div class="prode-matches-grid">
            ${partidos.map(p => renderMatchCard(p)).join('')}
          </div>
        </div>`;
    });
  }

  if (!hayGrupos && playoffs.length === 0) {
    html = `<div class="prode-empty">
      <span class="prode-empty-icon">📅</span>
      <div class="prode-empty-title">Sin partidos cargados</div>
      <div class="prode-empty-sub">Volvé más tarde cuando el fixture esté disponible.</div>
    </div>`;
  }

  container.innerHTML = html;
  attachInputListeners();
}

// ══════════════════════════════════════════════════════════════════
// RENDER: Card individual de partido
// ══════════════════════════════════════════════════════════════════
function renderMatchCard(partido) {
  const pred = _predictions[partido.id] || null;
  const locked = estaBloquado(partido);
  const finalizado = partido.estado === 'finalizado';

  // Fecha y hora en español
  const fecha = new Date(partido.fecha_utc);
  const fechaStr = fecha.toLocaleDateString('es-AR', {
    weekday: 'short', day: 'numeric', month: 'short'
  });
  const horaStr = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit'
  });

  // Estado de la card
  let cardClass = 'prode-match-card';
  if (locked) cardClass += ' card--locked';
  if (pred) cardClass += ' card--saved';

  // Badge de estado
  let statusBadge = '';
  if (partido.estado === 'finalizado') {
    statusBadge = '<span class="pmc-status pmc-status--finished">Finalizado</span>';
  } else if (partido.estado === 'en_curso') {
    statusBadge = '<span class="pmc-status pmc-status--locked">🔴 En Vivo</span>';
  } else if (locked) {
    statusBadge = '<span class="pmc-status pmc-status--locked">🔒 Bloqueado</span>';
  } else {
    statusBadge = '<span class="pmc-status pmc-status--open">Abierto</span>';
  }

  // Escudos
  const shieldLocal = partido.escudo_local
    ? `<img class="pmc-shield" src="${partido.escudo_local}" alt="${partido.equipo_local}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const shieldLocalFallback = `<div class="pmc-shield-fallback" style="display:${partido.escudo_local ? 'none' : 'flex'}">⚽</div>`;

  const shieldVisit = partido.escudo_visitante
    ? `<img class="pmc-shield" src="${partido.escudo_visitante}" alt="${partido.equipo_visitante}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const shieldVisitFallback = `<div class="pmc-shield-fallback" style="display:${partido.escudo_visitante ? 'none' : 'flex'}">⚽</div>`;

  // Valores de inputs
  const valLocal  = pred !== null ? pred.local   : '';
  const valVisit  = pred !== null ? pred.visitante : '';
  const disabledAttr = locked ? 'disabled' : '';
  const inputClass = pred ? 'pmc-input input--saved' : 'pmc-input';

  // Resultado real (si finalizó)
  let resultHtml = '';
  if (finalizado && partido.goles_local !== null) {
    resultHtml = `
      <div class="pmc-result">
        <div class="pmc-result-label">FT</div>
        <div class="pmc-result-score">${partido.goles_local} – ${partido.goles_visitante}</div>
      </div>`;
  }

  // Footer: puntos obtenidos
  let footerHtml = '';
  if (finalizado && pred) {
    const pts = pred.puntos;
    const ptsClass = pts === 3 ? 'pts--3' : pts === 1 ? 'pts--1' : 'pts--0';
    const ptsLabel = pts === 3 ? '¡Exacto!' : pts === 1 ? 'Signo OK' : 'Fallaste';
    const bonusBadge = pred.bonusAplicado
      ? '<span class="pmc-bonus-badge">⭐ +5 BONUS</span>'
      : '';
    footerHtml = `
      <div class="pmc-footer">
        <div class="pmc-points">
          <span class="pmc-points-val ${ptsClass}">${pts ?? '?'}</span>
          <span class="pmc-points-label">pts · ${ptsLabel}</span>
        </div>
        ${bonusBadge}
      </div>`;
  } else if (locked && !finalizado) {
    footerHtml = `
      <div class="pmc-footer">
        <div class="pmc-lock-msg">🔒 Predicciones cerradas para este partido</div>
      </div>`;
  } else if (!locked) {
    footerHtml = `
      <div class="pmc-footer">
        <div class="pmc-points">
          <span class="pmc-points-val pts--null">—</span>
          <span class="pmc-points-label">pts · Pendiente</span>
        </div>
      </div>`;
  }

  return `
    <div class="${cardClass}" data-id="${partido.id}" data-search="${partido.equipo_local.toLowerCase()} ${partido.equipo_visitante.toLowerCase()}">
      <div class="pmc-header">
        <div>
          <div class="pmc-date">${fechaStr} · ${horaStr}h</div>
          <div class="pmc-phase">${partido.fase || 'Fase de Grupos'}</div>
        </div>
        ${statusBadge}
      </div>

      <div class="pmc-body">
        <div class="pmc-team">
          ${shieldLocal}${shieldLocalFallback}
          <div class="pmc-team-name">${partido.equipo_local}</div>
        </div>

        <div class="pmc-center">
          ${resultHtml}
          <div class="pmc-inputs">
            <input
              type="number"
              class="${inputClass}"
              id="input-local-${partido.id}"
              data-partido="${partido.id}"
              data-side="local"
              value="${valLocal}"
              min="0" max="99"
              ${disabledAttr}
              placeholder="—"
              aria-label="Goles ${partido.equipo_local}"
            />
            <span class="pmc-dash">–</span>
            <input
              type="number"
              class="${inputClass}"
              id="input-visit-${partido.id}"
              data-partido="${partido.id}"
              data-side="visitante"
              value="${valVisit}"
              min="0" max="99"
              ${disabledAttr}
              placeholder="—"
              aria-label="Goles ${partido.equipo_visitante}"
            />
          </div>
          <div class="pmc-vs">VS</div>
        </div>

        <div class="pmc-team">
          ${shieldVisit}${shieldVisitFallback}
          <div class="pmc-team-name">${partido.equipo_visitante}</div>
        </div>
      </div>

      ${footerHtml}
    </div>`;
}

// ══════════════════════════════════════════════════════════════════
// LISTENERS: inputs de predicción
// ══════════════════════════════════════════════════════════════════
function attachInputListeners() {
  const container = document.getElementById('prode-predictions-content');
  if (!container) return;

  container.addEventListener('input', (e) => {
    const input = e.target;
    if (!input.classList.contains('pmc-input')) return;

    const partidoId = input.dataset.partido;
    if (!partidoId) return;

    // Validar rango 0–99
    let val = parseInt(input.value, 10);
    if (isNaN(val) || val < 0) { input.value = ''; return; }
    if (val > 99) { input.value = 99; val = 99; }

    // Marcar como pendiente
    _pendingChanges.add(partidoId);
    updateFabCounter();

    // Marcar la card visualmente
    const card = container.querySelector(`.prode-match-card[data-id="${partidoId}"]`);
    if (card) {
      card.classList.add('card--pending-save');
      card.style.borderColor = 'var(--gold)';
    }
  });
}

// ══════════════════════════════════════════════════════════════════
// BUSCADOR POR PAÍS
// ══════════════════════════════════════════════════════════════════
function initSearchBar() {
  const searchInput = document.getElementById('prode-search');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = searchInput.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filterCards(query);
    }, 200);
  });

  // Clear con ESC
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterCards('');
    }
  });
}

function filterCards(query) {
  const cards = document.querySelectorAll('#prode-predictions-content .prode-match-card');
  let totalVisible = 0;

  cards.forEach(card => {
    const searchData = (card.dataset.search || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const match = !query || searchData.includes(query);
    card.classList.toggle('card--hidden', !match);
    if (match) totalVisible++;
  });

  // Ocultar bloques de grupo vacíos
  document.querySelectorAll('#prode-predictions-content .prode-group-block').forEach(block => {
    const visibles = block.querySelectorAll('.prode-match-card:not(.card--hidden)');
    block.style.display = visibles.length === 0 ? 'none' : '';
  });

  // Ocultar headers de sección vacíos
  document.querySelectorAll('#prode-predictions-content .prode-section-header').forEach(header => {
    let nextEl = header.nextElementSibling;
    let hasVisible = false;
    while (nextEl && !nextEl.classList.contains('prode-section-header')) {
      if (nextEl.style.display !== 'none') { hasVisible = true; break; }
      nextEl = nextEl.nextElementSibling;
    }
    header.style.display = hasVisible ? '' : 'none';
  });

  // Mensaje de sin resultados
  const noResultsEl = document.getElementById('prode-no-results');
  if (noResultsEl) noResultsEl.style.display = totalVisible === 0 && query ? 'block' : 'none';
}

// ══════════════════════════════════════════════════════════════════
// BOTÓN GUARDAR (FAB flotante)
// ══════════════════════════════════════════════════════════════════
function initSaveButton() {
  _saveBtn = document.getElementById('prode-save-fab');
  if (!_saveBtn) return;

  _saveBtn.addEventListener('click', guardarPredicciones);
  updateFabCounter();
}

function updateFabCounter() {
  const counterEl = document.getElementById('prode-fab-count');
  if (counterEl) counterEl.textContent = _pendingChanges.size;

  if (_saveBtn) {
    _saveBtn.style.display = _pendingChanges.size > 0 ? 'flex' : 'none';
  }
}

async function guardarPredicciones() {
  if (!_userId || _pendingChanges.size === 0) return;

  _saveBtn.disabled = true;
  _saveBtn.innerHTML = `<span class="fab-icon">⏳</span> Guardando...`;

  const upsertData = [];
  const incompletos = [];
  const container = document.getElementById('prode-predictions-content');

  for (const partidoId of _pendingChanges) {
    // Capturar los valores EN ESTE MOMENTO (dentro del click handler)
    const inputLocal = document.getElementById(`input-local-${partidoId}`);
    const inputVisit = document.getElementById(`input-visit-${partidoId}`);

    if (!inputLocal || !inputVisit) {
      // Los inputs no existen en el DOM — ignorar silenciosamente
      continue;
    }

    // ✅ Verificación estricta: cadena vacía (NO truthy/falsy)
    // Esto evita que el 0 sea tratado como "sin valor"
    const rawLocal = inputLocal.value.trim();
    const rawVisit = inputVisit.value.trim();

    if (rawLocal === '' || rawVisit === '') {
      // Marcar visualmente como incompleto
      const card = container?.querySelector(`.prode-match-card[data-id="${partidoId}"]`);
      if (card) {
        if (rawLocal === '') inputLocal.style.outline = '2px solid #ef4444';
        if (rawVisit === '') inputVisit.style.outline = '2px solid #ef4444';
        // Limpiar el outline tras 2 segundos
        setTimeout(() => {
          inputLocal.style.outline = '';
          inputVisit.style.outline = '';
        }, 2000);
      }
      incompletos.push(partidoId);
      continue;
    }

    const vLocal = parseInt(rawLocal, 10);
    const vVisit = parseInt(rawVisit, 10);

    // Salvaguarda extra por si parseInt falla (ej: texto pegado)
    if (isNaN(vLocal) || isNaN(vVisit)) {
      incompletos.push(partidoId);
      continue;
    }

    upsertData.push({
      partido_id:           partidoId,
      user_id:              _userId,
      pred_goles_local:     vLocal,
      pred_goles_visitante: vVisit,
      updated_at:           new Date().toISOString(),
    });
  }

  // Avisar si quedaron partidos incompletos
  if (incompletos.length > 0) {
    const total = incompletos.length;
    showToast(
      `⚠️ ${total} partido${total !== 1 ? 's' : ''} incompleto${total !== 1 ? 's' : ''}. Completá los dos goles antes de guardar.`,
      'error'
    );
    if (upsertData.length === 0) {
      // No hay nada válido para guardar: abortar
      _saveBtn.disabled = false;
      resetFabButton();
      return;
    }
    // Si hay otros válidos, continuar guardando solo los completos
  }

  if (upsertData.length === 0) {
    // No debería llegar acá, pero por seguridad
    showToast('Completá los dos goles de cada partido antes de guardar.', 'error');
    _saveBtn.disabled = false;
    resetFabButton();
    return;
  }

  try {
    const { error } = await supabase
      .from('prode_predictions')
      .upsert(upsertData, { onConflict: 'partido_id,user_id' });

    if (error) throw error;

    // Actualizar cache local
    upsertData.forEach(p => {
      _predictions[p.partido_id] = {
        local:     p.pred_goles_local,
        visitante: p.pred_goles_visitante,
        puntos:    null,
        bonus:     0,
        bonusAplicado: false,
      };

      // Sacar del set de pendientes solo los guardados
      _pendingChanges.delete(p.partido_id);

      // Actualizar apariencia de la card
      if (container) {
        const card = container.querySelector(`.prode-match-card[data-id="${p.partido_id}"]`);
        if (card) {
          card.classList.add('card--saved');
          card.classList.remove('card--pending-save');
          card.style.borderColor = '';
          const inputL = document.getElementById(`input-local-${p.partido_id}`);
          const inputV = document.getElementById(`input-visit-${p.partido_id}`);
          if (inputL) inputL.classList.add('input--saved');
          if (inputV) inputV.classList.add('input--saved');
        }
      }
    });

    if (incompletos.length === 0) {
      // Todo guardado: limpiar completamente
      showToast(
        `✅ ${upsertData.length} predicción${upsertData.length !== 1 ? 'es' : ''} guardada${upsertData.length !== 1 ? 's' : ''}`,
        'success'
      );
    } else {
      showToast(
        `✅ ${upsertData.length} guardada${upsertData.length !== 1 ? 's' : ''} · ${incompletos.length} pendiente${incompletos.length !== 1 ? 's' : ''} de completar`,
        'success'
      );
    }

  } catch (err) {
    console.error('[Prode] Error al guardar:', err);
    showToast('Error al guardar. Intentá de nuevo.', 'error');
  }

  _saveBtn.disabled = false;
  resetFabButton();
  updateFabCounter();
}

function resetFabButton() {
  if (!_saveBtn) return;
  // ⚠️ Reconstruir el HTML preservando el ID del contador
  // para que updateFabCounter() lo encuentre en futuras llamadas
  _saveBtn.innerHTML = [
    '<span class="fab-icon">💾</span>',
    'Guardar Predicciones',
    `<span class="prode-fab-count" id="prode-fab-count">${_pendingChanges.size}</span>`,
  ].join(' ');
}

// ══════════════════════════════════════════════════════════════════
// TOAST DE NOTIFICACIONES
// ══════════════════════════════════════════════════════════════════
function showToast(msg, type = 'success') {
  const existing = document.getElementById('prode-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'prode-toast';
  toast.className = `prode-toast toast--${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${msg}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .4s';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ══════════════════════════════════════════════════════════════════
// RENDER: Skeleton mientras carga
// ══════════════════════════════════════════════════════════════════
function renderSkeletons() {
  const container = document.getElementById('prode-predictions-content');
  if (!container) return;
  const skeletons = Array(6).fill('<div class="prode-skeleton-card"></div>').join('');
  container.innerHTML = `<div class="prode-skeleton-grid">${skeletons}</div>`;
}

// ══════════════════════════════════════════════════════════════════
// RENDER: Estado sin auth
// ══════════════════════════════════════════════════════════════════
function renderNoAuth() {
  const container = document.getElementById('prode-predictions-content');
  if (container) {
    container.innerHTML = `
      <div class="prode-empty">
        <span class="prode-empty-icon">🔒</span>
        <div class="prode-empty-title">Inicia sesión para jugar</div>
        <div class="prode-empty-sub">El Prode está disponible para usuarios registrados. ¡Es gratis!</div>
      </div>`;
  }
}

// ══════════════════════════════════════════════════════════════════
// RENDER: Error
// ══════════════════════════════════════════════════════════════════
function renderError(msg) {
  const container = document.getElementById('prode-predictions-content');
  if (container) {
    container.innerHTML = `
      <div class="prode-empty">
        <span class="prode-empty-icon">⚠️</span>
        <div class="prode-empty-title">Error al cargar</div>
        <div class="prode-empty-sub">${msg}</div>
      </div>`;
  }
}

// ══════════════════════════════════════════════════════════════════
// SUB-TABS: Predicciones vs Comunidades
// ══════════════════════════════════════════════════════════════════
export function switchSubTab(tab) {
  document.querySelectorAll('.prode-sub-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('.prode-subpanel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `prode-${tab}-panel`);
  });
}

// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// MÓDULO DE COMUNIDADES
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════

let currentRankingOffset = 0;
const RANKING_LIMIT = 15;

async function loadCommunities() {
  if (!_userId) return;

  try {
    currentRankingOffset = 0;
    const [groups, globalRanking] = await Promise.all([
      fetchMyGroups(_userId),
      fetchGlobalRanking(currentRankingOffset, RANKING_LIMIT),
    ]);

    _myGroups = groups;
    renderCommunities(groups, globalRanking);
  } catch (err) {
    console.error('[Prode] Error cargando comunidades:', err);
  }
}

// ──────────────────────────────────────────────────────────────────
// FETCH: Grupos del usuario
// ──────────────────────────────────────────────────────────────────
async function fetchMyGroups(userId) {
  const { data, error } = await supabase
    .from('prode_group_members')
    .select(`
      group_id,
      joined_at,
      prode_groups!prode_group_members_group_id_fkey (
        id, nombre, invite_code, es_publico, admin_id, created_at
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []).map(row => row.prode_groups).filter(Boolean);
}

// ──────────────────────────────────────────────────────────────────
// FETCH: Miembros + puntos de un grupo
// ──────────────────────────────────────────────────────────────────
async function fetchGroupMembers(groupId) {
  const { data, error } = await supabase
    .from('prode_group_members')
    .select(`
      user_id,
      profiles (
        id, username, avatar_url, puntos_prode, aciertos_exactos, aciertos_signo
      )
    `)
    .eq('group_id', groupId);

  if (error) throw error;
  return (data || [])
    .map(row => row.profiles)
    .filter(Boolean)
    .sort((a, b) => (b.puntos_prode || 0) - (a.puntos_prode || 0));
}

// ──────────────────────────────────────────────────────────────────
// FETCH: Ranking global
// ──────────────────────────────────────────────────────────────────
async function fetchGlobalRanking(start = 0, limit = RANKING_LIMIT) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, puntos_prode, aciertos_exactos, aciertos_signo')
    .order('puntos_prode', { ascending: false })
    .range(start, start + limit - 1);

  if (error) throw error;
  return data || [];
}

// ──────────────────────────────────────────────────────────────────
// RENDER: Panel de comunidades completo
// ──────────────────────────────────────────────────────────────────
async function renderCommunities(groups, globalRanking) {
  const container = document.getElementById('prode-communities-panel');
  if (!container) return;

  // Cargar miembros de cada grupo
  const groupsWithMembers = await Promise.all(
    groups.map(async (g) => {
      const members = await fetchGroupMembers(g.id);
      return { ...g, members };
    })
  );

  // ── Sidebar de acciones ──
  const sidebarHtml = `
    <div class="community-sidebar">
      <!-- Crear grupo -->
      <div class="community-action-card">
        <div class="community-action-title">🏆 Crear Grupo</div>
        <input type="text" id="new-group-name" class="community-input" placeholder="Nombre del grupo (2–50 caracteres)" maxlength="50" />
        <label class="community-toggle-row">
          <span class="community-toggle-label">🌐 Grupo público</span>
          <label class="toggle-switch">
            <input type="checkbox" id="new-group-public" />
            <span class="toggle-slider"></span>
          </label>
        </label>
        <button class="community-btn" id="btn-create-group">Crear Grupo</button>
        <div class="community-msg" id="create-group-msg"></div>
      </div>

      <!-- Unirse con código -->
      <div class="community-action-card">
        <div class="community-action-title">🔑 Unirse con Código</div>
        <input type="text" id="join-group-code" class="community-input" placeholder="Código de 6 letras (ej: AB12CD)" maxlength="6" style="text-transform:uppercase;letter-spacing:4px;font-size:18px;text-align:center" />
        <button class="community-btn btn--secondary" id="btn-join-group">Unirse al Grupo</button>
        <div class="community-msg" id="join-group-msg"></div>
      </div>
    </div>`;

  // ── Lista de mis grupos ──
  const myGroupsHtml = `
    <div>
      <div class="my-groups-header">
        <p class="section-label" style="margin:0">Mis Grupos</p>
        <span class="groups-count-badge">${groupsWithMembers.length} grupos</span>
      </div>

      ${groupsWithMembers.length === 0 ? `
        <div class="prode-empty" style="padding:40px 20px">
          <span class="prode-empty-icon">👥</span>
          <div class="prode-empty-title">Sin grupos todavía</div>
          <div class="prode-empty-sub">Creá tu propio grupo o pedile el código a un amigo para unirte.</div>
        </div>
      ` : groupsWithMembers.map(g => renderGroupCard(g)).join('')}

      <!-- Ranking global -->
      <div class="global-ranking-section">
        <p class="section-label">🌎 Ranking Global</p>
        ${renderGlobalRanking(globalRanking)}
      </div>
    </div>`;

  container.innerHTML = `<div class="communities-layout">${myGroupsHtml}${sidebarHtml}</div>`;

  // Bind de eventos
  bindCommunityEvents();
}

// ──────────────────────────────────────────────────────────────────
// RENDER: Tarjeta de grupo individual
// ──────────────────────────────────────────────────────────────────
function renderGroupCard(group) {
  const isAdmin = group.admin_id === _userId;
  const members = group.members || [];

  const visibilityBadge = group.es_publico
    ? '<span class="group-visibility-badge badge--public">🌐 Público</span>'
    : '<span class="group-visibility-badge badge--private">🔒 Privado</span>';
  const adminBadge = isAdmin
    ? '<span class="group-visibility-badge badge--admin">⭐ Admin</span>'
    : '';

  const membersHtml = members.slice(0, 10).map((m, i) => {
    const posClass = i === 0 ? 'pos-1' : i === 1 ? 'pos-2' : i === 2 ? 'pos-3' : '';
    const isMe = m.id === _userId;
    const avatarHtml = m.avatar_url
      ? `<img class="grr-avatar" src="${m.avatar_url}" alt="${m.username}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <div class="grr-avatar-fallback" style="display:none">👤</div>`
      : `<div class="grr-avatar-fallback">👤</div>`;

    return `
      <div class="group-ranking-row" id="member-${group.id}-${m.id}">
        <span class="grr-pos ${posClass}">${i + 1}</span>
        ${avatarHtml}
        <span class="grr-name ${isMe ? 'is-me' : ''}">${m.username || 'Anónimo'}${isMe ? ' (vos)' : ''}</span>
        <span class="grr-exactos">🎯 ${m.aciertos_exactos || 0}</span>
        <span class="grr-pts">${m.puntos_prode || 0}</span>
        ${isAdmin && !isMe ? `
          <button class="group-admin-btn btn--danger" onclick="prodeKickMember('${group.id}','${m.id}','${m.username}')" title="Expulsar a ${m.username}" style="padding:4px 8px;font-size:10px">
            🚫 Expulsar
          </button>
        ` : '<span></span>'}
      </div>`;
  }).join('');

  const adminActionsHtml = isAdmin ? `
    <div class="group-admin-actions">
      <button class="group-admin-btn" onclick="prodeEditGroupName('${group.id}','${escapeAttr(group.nombre)}')">
        ✏️ Editar nombre
      </button>
      <button class="group-admin-btn" onclick="prodeTogglePublic('${group.id}', ${group.es_publico})" id="btn-toggle-public-${group.id}">
        ${group.es_publico ? '🔒 Hacer privado' : '🌐 Hacer público'}
      </button>
    </div>
  ` : '';

  return `
    <div class="group-card" id="group-card-${group.id}">
      <div class="group-card-header">
        <div class="group-card-name">${group.nombre}</div>
        <div class="group-card-meta">
          ${visibilityBadge}
          ${adminBadge}
        </div>
      </div>
      <div class="group-card-body">
        <!-- Invite code -->
        <div class="invite-code-display" onclick="prodeCopiaCodigo('${group.invite_code}')" title="Clic para copiar">
          <span class="invite-code-val">${group.invite_code}</span>
          <span class="invite-code-copy">📋</span>
        </div>
        <div style="font-size:11px;color:var(--text4);margin-bottom:14px;">
          Compartí este código para invitar amigos · ${members.length} miembro${members.length !== 1 ? 's' : ''}
        </div>

        <!-- Ranking interno -->
        <div class="group-ranking-table">
          ${membersHtml || '<div style="color:var(--text4);font-size:13px;padding:10px 0">Sin miembros aún.</div>'}
        </div>

        ${adminActionsHtml}
      </div>
    </div>`;
}

// ──────────────────────────────────────────────────────────────────
// RENDER: Tabla de ranking global
// ──────────────────────────────────────────────────────────────────
function renderGlobalRanking(profiles) {
  if (!profiles || profiles.length === 0) {
    return '<div class="prode-empty" style="padding:30px"><div class="prode-empty-sub">Sin datos de ranking aún.</div></div>';
  }

  const rowsHtml = renderRankingRows(profiles, 0);

  const btnLoadMore = profiles.length === RANKING_LIMIT 
    ? `<button id="btn-load-more-ranking" class="community-btn btn--secondary" style="margin-top: 15px; width: 100%;">Ver más</button>`
    : '';

  return `
    <div class="global-ranking-table">
      <div class="grt-header">
        <span>#</span>
        <span></span>
        <span>Usuario</span>
        <span style="text-align:center">Puntos</span>
        <span style="text-align:center">Exactos</span>
        <span style="text-align:center">Signo</span>
      </div>
      <div id="global-ranking-rows">
        ${rowsHtml}
      </div>
    </div>
    ${btnLoadMore}
  `;
}

function renderRankingRows(profiles, startIndex = 0) {
  return profiles.map((p, i) => {
    const pos = startIndex + i + 1;
    const posClass = pos === 1 ? 'pos-1' : pos === 2 ? 'pos-2' : pos === 3 ? 'pos-3' : '';
    const isMe = p.id === _userId;
    const avatarHtml = p.avatar_url
      ? `<img class="grt-avatar" src="${p.avatar_url}" alt="${p.username}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <div class="grt-avatar-fallback" style="display:none">👤</div>`
      : `<div class="grt-avatar-fallback">👤</div>`;

    return `
      <div class="grt-row ${isMe ? 'row--me' : ''}">
        <span class="grt-pos ${posClass}">${pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos}</span>
        ${avatarHtml}
        <span class="grt-name ${isMe ? 'is-me' : ''}">${p.username || 'Anónimo'}${isMe ? ' ★' : ''}</span>
        <span class="grt-pts">${p.puntos_prode || 0}</span>
        <span class="grt-exactos">🎯 ${p.aciertos_exactos || 0}</span>
        <span class="grt-signo">⚖️ ${p.aciertos_signo || 0}</span>
      </div>`;
  }).join('');
}

async function loadMoreRanking() {
  const btn = document.getElementById('btn-load-more-ranking');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Cargando...';
  }

  try {
    currentRankingOffset += RANKING_LIMIT;
    const newProfiles = await fetchGlobalRanking(currentRankingOffset, RANKING_LIMIT);

    if (newProfiles.length > 0) {
      const rowsContainer = document.getElementById('global-ranking-rows');
      if (rowsContainer) {
        rowsContainer.insertAdjacentHTML('beforeend', renderRankingRows(newProfiles, currentRankingOffset));
      }
    }

    if (newProfiles.length < RANKING_LIMIT) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Ver menos';
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', async () => {
          try {
            newBtn.disabled = true;
            newBtn.textContent = 'Cargando...';
            currentRankingOffset = 0;
            const resetProfiles = await fetchGlobalRanking(0, RANKING_LIMIT);
            const rowsContainer = document.getElementById('global-ranking-rows');
            if (rowsContainer) {
              rowsContainer.innerHTML = renderRankingRows(resetProfiles, 0);
            }
            newBtn.textContent = 'Ver más';
            newBtn.disabled = false;
            const freshBtn = newBtn.cloneNode(true);
            newBtn.parentNode.replaceChild(freshBtn, newBtn);
            freshBtn.addEventListener('click', loadMoreRanking);
          } catch (e) {
            console.error(e);
          }
        });
      }
    } else {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Ver más';
      }
    }
  } catch (error) {
    console.error('[Prode] Error cargando más ranking:', error);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Error, reintentar';
    }
  }
}

// ──────────────────────────────────────────────────────────────────
// EVENTOS: Crear / Unirse a grupo
// ──────────────────────────────────────────────────────────────────
function bindCommunityEvents() {
  // Crear grupo
  const btnCreate = document.getElementById('btn-create-group');
  if (btnCreate) {
    btnCreate.addEventListener('click', async () => {
      const nombre = document.getElementById('new-group-name')?.value.trim();
      const esPublico = document.getElementById('new-group-public')?.checked || false;
      const msgEl = document.getElementById('create-group-msg');

      if (!nombre || nombre.length < 2) {
        setCommunityMsg(msgEl, 'El nombre debe tener al menos 2 caracteres.', 'error'); return;
      }

      btnCreate.disabled = true; btnCreate.textContent = 'Creando...';

      try {
        // 1. Crear el grupo
        const { data: group, error: groupErr } = await supabase
          .from('prode_groups')
          .insert({ nombre, admin_id: _userId, es_publico: esPublico })
          .select()
          .single();

        if (groupErr) throw groupErr;

        // 2. Unirse automáticamente
        const { error: memberErr } = await supabase
          .from('prode_group_members')
          .insert({ group_id: group.id, user_id: _userId });

        if (memberErr) throw memberErr;

        setCommunityMsg(msgEl, `✅ Grupo "${nombre}" creado. Código: ${group.invite_code}`, 'success');
        document.getElementById('new-group-name').value = '';

        // Recargar
        setTimeout(() => loadCommunities(), 800);

      } catch (err) {
        console.error('[Prode] Error creando grupo:', err);
        setCommunityMsg(msgEl, err.message || 'Error al crear el grupo.', 'error');
      }

      btnCreate.disabled = false; btnCreate.textContent = 'Crear Grupo';
    });
  }

  // Unirse a grupo
  const btnJoin = document.getElementById('btn-join-group');
  if (btnJoin) {
    btnJoin.addEventListener('click', async () => {
      const code = document.getElementById('join-group-code')?.value.trim().toUpperCase();
      const msgEl = document.getElementById('join-group-msg');

      if (!code || code.length !== 6) {
        setCommunityMsg(msgEl, 'El código debe tener exactamente 6 caracteres.', 'error'); return;
      }

      btnJoin.disabled = true; btnJoin.textContent = 'Buscando...';

      try {
        // Buscar el grupo por invite_code
        const { data: group, error: findErr } = await supabase
          .from('prode_groups')
          .select('id, nombre')
          .eq('invite_code', code)
          .single();

        if (findErr || !group) {
          setCommunityMsg(msgEl, 'Código inválido o grupo no encontrado.', 'error');
          btnJoin.disabled = false; btnJoin.textContent = 'Unirse al Grupo'; return;
        }

        // Verificar si ya es miembro
        const yaEsMiembro = _myGroups.some(g => g.id === group.id);
        if (yaEsMiembro) {
          setCommunityMsg(msgEl, `Ya sos miembro de "${group.nombre}".`, 'error');
          btnJoin.disabled = false; btnJoin.textContent = 'Unirse al Grupo'; return;
        }

        // Unirse
        const { error: joinErr } = await supabase
          .from('prode_group_members')
          .insert({ group_id: group.id, user_id: _userId });

        if (joinErr) throw joinErr;

        setCommunityMsg(msgEl, `✅ Te uniste a "${group.nombre}"!`, 'success');
        document.getElementById('join-group-code').value = '';

        setTimeout(() => loadCommunities(), 800);

      } catch (err) {
        console.error('[Prode] Error uniéndose al grupo:', err);
        setCommunityMsg(msgEl, err.message || 'Error al unirse al grupo.', 'error');
      }

      btnJoin.disabled = false; btnJoin.textContent = 'Unirse al Grupo';
    });
  }
}

function setCommunityMsg(el, msg, type) {
  if (!el) return;
  el.className = `community-msg msg--${type}`;
  el.textContent = msg;
  if (type === 'success') setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// ──────────────────────────────────────────────────────────────────
// ACCIONES GLOBALES (accesibles desde HTML onclick)
// ──────────────────────────────────────────────────────────────────

/** Copia el código de invitación al portapapeles */
window.prodeCopiaCodigo = function(code) {
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Código ${code} copiado al portapapeles`, 'success');
  }).catch(() => showToast(`Código: ${code}`, 'success'));
};

/** Expulsa a un miembro de un grupo (solo admin) */
window.prodeKickMember = async function(groupId, userId, username) {
  if (!confirm(`¿Expulsár a "${username}" del grupo?`)) return;

  try {
    const { error } = await supabase
      .from('prode_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;

    // Animación de salida
    const rowEl = document.getElementById(`member-${groupId}-${userId}`);
    if (rowEl) {
      rowEl.classList.add('removing');
      setTimeout(() => rowEl.remove(), 350);
    }

    showToast(`${username} fue expulsado del grupo.`, 'success');

  } catch (err) {
    console.error('[Prode] Error expulsando miembro:', err);
    showToast('Error al expulsar al miembro.', 'error');
  }
};

/** Edita el nombre del grupo (solo admin) */
window.prodeEditGroupName = async function(groupId, currentName) {
  const newName = prompt(`Nuevo nombre para el grupo (actual: "${currentName}"):`, currentName);
  if (!newName || newName.trim().length < 2 || newName.trim() === currentName) return;

  try {
    const { error } = await supabase
      .from('prode_groups')
      .update({ nombre: newName.trim(), updated_at: new Date().toISOString() })
      .eq('id', groupId)
      .eq('admin_id', _userId);

    if (error) throw error;

    // Actualizar en UI
    const cardEl = document.getElementById(`group-card-${groupId}`);
    if (cardEl) {
      const nameEl = cardEl.querySelector('.group-card-name');
      if (nameEl) nameEl.textContent = newName.trim();
    }

    showToast('Nombre del grupo actualizado.', 'success');

  } catch (err) {
    console.error('[Prode] Error editando nombre:', err);
    showToast('Error al actualizar el nombre.', 'error');
  }
};

/** Toggle de visibilidad del grupo (solo admin) */
window.prodeTogglePublic = async function(groupId, currentlyPublic) {
  const nuevoEstado = !currentlyPublic;

  try {
    const { error } = await supabase
      .from('prode_groups')
      .update({ es_publico: nuevoEstado, updated_at: new Date().toISOString() })
      .eq('id', groupId)
      .eq('admin_id', _userId);

    if (error) throw error;

    // Actualizar botón
    const btn = document.getElementById(`btn-toggle-public-${groupId}`);
    if (btn) {
      btn.textContent = nuevoEstado ? '🔒 Hacer privado' : '🌐 Hacer público';
      btn.setAttribute('onclick', `prodeTogglePublic('${groupId}', ${nuevoEstado})`);
    }

    // Actualizar badge
    const cardEl = document.getElementById(`group-card-${groupId}`);
    if (cardEl) {
      const badge = cardEl.querySelector('.group-visibility-badge.badge--public, .group-visibility-badge.badge--private');
      if (badge) {
        badge.className = `group-visibility-badge ${nuevoEstado ? 'badge--public' : 'badge--private'}`;
        badge.textContent = nuevoEstado ? '🌐 Público' : '🔒 Privado';
      }
    }

    showToast(`Grupo ahora es ${nuevoEstado ? 'público' : 'privado'}.`, 'success');

  } catch (err) {
    console.error('[Prode] Error toggling visibilidad:', err);
    showToast('Error al cambiar la visibilidad.', 'error');
  }
};

// ──────────────────────────────────────────────────────────────────
// UTILIDADES
// ──────────────────────────────────────────────────────────────────
function escapeAttr(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
