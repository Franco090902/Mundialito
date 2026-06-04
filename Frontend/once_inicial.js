// ══════════════════════════════════════════════════════════════════
// once_inicial.js — Módulo "Mi 11 Inicial"
// Vanilla JS puro. Depende de auth.js (actualizarPerfil, currentProfile).
//
// CÓMO INCLUIR EN index.html (DESPUÉS de auth.js):
//   <script type="module" src="once_inicial.js"></script>
// ══════════════════════════════════════════════════════════════════

import { actualizarPerfil, currentProfile } from './auth.js';

// ──────────────────────────────────────────────────────────────────
// CONSTANTES
// ──────────────────────────────────────────────────────────────────

/**
 * Posiciones válidas con su etiqueta de pantalla.
 * Orden de aparición en el formulario (de defensa a ataque).
 */
const POSICIONES = [
  { codigo: 'GK',  label: 'Arquero (GK)'          },
  { codigo: 'RB',  label: 'Lateral Derecho (RB)'  },
  { codigo: 'CB',  label: 'Central (CB)'           },
  { codigo: 'CB',  label: 'Central (CB)'           },
  { codigo: 'LB',  label: 'Lateral Izquierdo (LB)' },
  { codigo: 'CDM', label: 'Volante Defensivo (CDM)' },
  { codigo: 'CM',  label: 'Mediocampista (CM)'     },
  { codigo: 'CM',  label: 'Mediocampista (CM)'     },
  { codigo: 'RW',  label: 'Extremo Derecho (RW)'   },
  { codigo: 'ST',  label: 'Delantero Centro (ST)'  },
  { codigo: 'LW',  label: 'Extremo Izquierdo (LW)' },
];

/** Formaciones predefinidas. Cada string es la label del <option>. */
const FORMACIONES = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '4-5-1'];

// ──────────────────────────────────────────────────────────────────
// RENDER: Genera el formulario en el DOM
// ──────────────────────────────────────────────────────────────────

/**
 * Inyecta el formulario del 11 inicial dentro del contenedor dado.
 * El contenedor debe existir en el HTML con id="once-inicial-container".
 *
 * @param {object|null} onceSaved — once_inicial ya guardado (para prellenar)
 */
export function renderOncePicker(onceSaved = null) {
  const container = document.getElementById('once-inicial-container');
  if (!container) return;

  const formacionActual = onceSaved?.formacion ?? FORMACIONES[0];

  // ── Selector de formación ──────────────────────────────────────
  const formacionOptions = FORMACIONES.map(f =>
    `<option value="${f}" ${f === formacionActual ? 'selected' : ''}>${f}</option>`
  ).join('');

  // ── Filas de los 11 jugadores ──────────────────────────────────
  const jugadoresHtml = POSICIONES.map((pos, i) => {
    const jugadorGuardado = onceSaved?.jugadores?.[i];
    const nombreVal = jugadorGuardado?.nombre ?? '';
    const paisVal   = jugadorGuardado?.pais   ?? '';
    return `
      <div class="once-row" data-index="${i}">
        <span class="once-pos-badge">${pos.codigo}</span>
        <label class="once-pos-label">${pos.label}</label>
        <input
          type="text"
          class="once-input once-nombre"
          id="once-jugador-${i}"
          placeholder="Nombre del jugador"
          maxlength="50"
          value="${escapeHtml(nombreVal)}"
          data-posicion="${pos.codigo}"
          data-index="${i}"
          autocomplete="off"
        />
        <input
          type="text"
          class="once-input once-pais"
          id="once-pais-${i}"
          placeholder="País (opcional)"
          maxlength="30"
          value="${escapeHtml(paisVal)}"
          data-index="${i}"
          autocomplete="off"
        />
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="once-card">
      <div class="once-header">
        <span class="once-title">⚽ Mi 11 Inicial</span>
        <div class="once-formacion-wrap">
          <label for="once-formacion" class="once-label">Formación</label>
          <select id="once-formacion" class="once-select">
            ${formacionOptions}
          </select>
        </div>
      </div>

      <div class="once-grid">
        ${jugadoresHtml}
      </div>

      <div class="once-footer">
        <span class="once-counter" id="once-counter">
          ${contarCompletos(onceSaved?.jugadores)} / 11 jugadores completados
        </span>
        <button id="btn-guardar-once" class="once-btn-guardar">
          💾 Guardar 11
        </button>
        <div class="once-msg" id="once-msg" aria-live="polite"></div>
      </div>
    </div>`;

  // ── Bind de eventos ────────────────────────────────────────────
  bindOnceEvents();
}

// ──────────────────────────────────────────────────────────────────
// LEER FORMULARIO → Construir objeto once_inicial
// ──────────────────────────────────────────────────────────────────

/**
 * Lee todos los inputs del formulario y construye el objeto JSONB
 * listo para enviar a Supabase.
 *
 * @returns {{ formacion: string, jugadores: Array<{posicion, nombre, pais}> }}
 */
function leerFormulario() {
  const formacion = document.getElementById('once-formacion')?.value ?? FORMACIONES[0];

  const jugadores = POSICIONES.map((pos, i) => {
    const nombre = document.getElementById(`once-jugador-${i}`)?.value?.trim() ?? '';
    const pais   = document.getElementById(`once-pais-${i}`)?.value?.trim()   ?? '';
    return {
      posicion: pos.codigo,
      nombre,
      pais,
    };
  });

  return { formacion, jugadores };
}

// ──────────────────────────────────────────────────────────────────
// VALIDACIÓN
// ──────────────────────────────────────────────────────────────────

/**
 * Valida el objeto del once antes de guardar.
 * Reglas:
 *   - Al menos 11 nombres no vacíos (el GK es obligatorio).
 *   - Ningún nombre supera 50 caracteres.
 *
 * @param {{ jugadores: Array }} once
 * @returns {string|null} Mensaje de error, o null si es válido
 */
function validarOnce(once) {
  const vacios = once.jugadores.filter(j => !j.nombre).length;
  if (vacios > 0) {
    return `Faltan ${vacios} nombre${vacios > 1 ? 's' : ''} por completar.`;
  }
  const muyLargo = once.jugadores.find(j => j.nombre.length > 50);
  if (muyLargo) {
    return `El nombre "${muyLargo.nombre}" es demasiado largo (máx. 50 caracteres).`;
  }
  return null;
}

// ──────────────────────────────────────────────────────────────────
// GUARDAR → Llama a actualizarPerfil
// ──────────────────────────────────────────────────────────────────

/**
 * Lee el formulario, valida y llama a actualizarPerfil({ once_inicial }).
 * Muestra feedback visual en #once-msg.
 */
async function guardarOnce() {
  const btn  = document.getElementById('btn-guardar-once');
  const msgEl = document.getElementById('once-msg');

  const once = leerFormulario();

  // Validar
  const errorValidacion = validarOnce(once);
  if (errorValidacion) {
    mostrarMsgOnce(msgEl, errorValidacion, 'error');
    return;
  }

  // Deshabilitar botón durante el guardado
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Guardando...'; }

  const { data, error } = await actualizarPerfil({ once_inicial: once });

  if (error) {
    console.error('[Once] Error guardando:', error);
    mostrarMsgOnce(msgEl, typeof error === 'string' ? error : 'Error al guardar. Intentá de nuevo.', 'error');
  } else {
    mostrarMsgOnce(msgEl, '✅ ¡11 inicial guardado con éxito!', 'success');
    // Actualizar el contador
    const counterEl = document.getElementById('once-counter');
    if (counterEl) counterEl.textContent = `${contarCompletos(once.jugadores)} / 11 jugadores completados`;
  }

  if (btn) { btn.disabled = false; btn.textContent = '💾 Guardar 11'; }
}

// ──────────────────────────────────────────────────────────────────
// BIND DE EVENTOS
// ──────────────────────────────────────────────────────────────────

function bindOnceEvents() {
  // Botón guardar
  document.getElementById('btn-guardar-once')
    ?.addEventListener('click', guardarOnce);

  // Actualizar contador al tipear
  document.querySelectorAll('.once-nombre').forEach(input => {
    input.addEventListener('input', () => {
      const once = leerFormulario();
      const counterEl = document.getElementById('once-counter');
      if (counterEl) counterEl.textContent = `${contarCompletos(once.jugadores)} / 11 jugadores completados`;
    });
  });
}

// ──────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────

function contarCompletos(jugadores) {
  if (!Array.isArray(jugadores)) return 0;
  return jugadores.filter(j => j?.nombre?.trim()).length;
}

function mostrarMsgOnce(el, msg, tipo) {
  if (!el) return;
  el.textContent = msg;
  el.className = `once-msg once-msg--${tipo}`;
  if (tipo === 'success') {
    setTimeout(() => { el.textContent = ''; el.className = 'once-msg'; }, 4000);
  }
}

function escapeHtml(str) {
  return (str ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ──────────────────────────────────────────────────────────────────
// INICIALIZACIÓN AUTOMÁTICA
// Espera a que auth.js haya cargado el perfil y llama a renderOnce.
// ──────────────────────────────────────────────────────────────────

/**
 * Exportada para que index.html pueda llamarla desde window.onMundialitoAuth
 * o desde cualquier callback de auth.
 *
 * Ejemplo de uso en index.html:
 *   import { initOnceInicial } from './once_inicial.js';
 *   window.onMundialitoAuth = (user, profile) => {
 *     if (user) initOnceInicial(profile?.once_inicial ?? null);
 *   };
 */
export function initOnceInicial(onceSaved = null) {
  renderOncePicker(onceSaved);
}
