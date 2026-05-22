/**
 * ══════════════════════════════════════════════════════════════════
 * PRODE — Módulo de Predicciones Deportivas — Mundialito 2026
 * Frontend/prode.js — Vanilla JS ESM Module
 *
 * Usa el cliente de Supabase ya inicializado en auth.js.
 * Importar e inicializar desde el bloque <script type="module"> del HTML:
 *
 *   import { initProde } from './prode.js';
 *   supabase.auth.onAuthStateChange((event, session) => {
 *     if (session) initProde(supabase, session.user);
 *   });
 *
 * ══════════════════════════════════════════════════════════════════
 */

// ─── Estado global del módulo ───────────────────────────────────────
let _supabase = null;   // Cliente Supabase (inyectado desde el HTML)
let _user = null;       // Usuario autenticado actual
let _currentGroupId = null; // Grupo actualmente visualizado
let _countdownIntervals = []; // Referencias a intervalos de countdown

// ─── Constantes ──────────────────────────────────────────────────────
const LOCK_MINUTES_BEFORE = 60; // Minutos antes del kickoff para bloquear predicciones
const LOCAL_STORAGE_KEY_GRUPO = 'prode_grupo_activo';

// ══════════════════════════════════════════════════════════════════
// INICIALIZACIÓN PRINCIPAL
// ══════════════════════════════════════════════════════════════════

/**
 * Punto de entrada. Llamar después de que el usuario esté autenticado.
 * @param {object} supabaseClient - Instancia de Supabase ya inicializada
 * @param {object} user - Objeto de usuario de Supabase Auth
 */
let _prodeInitialized = false; // Guard para evitar re-inicializaciones múltiples

export async function initProde(supabaseClient, user) {
  _supabase = supabaseClient;
  _user = user;

  // Solo registrar listeners la primera vez
  if (!_prodeInitialized) {
    _prodeInitialized = true;

    const tabBtn = document.querySelector('[data-prode-tab]');
    if (tabBtn) {
      // Usar { once: false } pero con flag para no duplicar
      tabBtn.addEventListener('click', () => mostrarDashboard());
    }

    // Este listener se dispara desde el onclick del HTML (switchTab)
    window.addEventListener('prode-tab-activated', () => mostrarDashboard());
  }

  // Si el panel ya está activo al cargar (p. ej. por URL hash)
  if (document.getElementById('panel-prode')?.classList.contains('active')) {
    mostrarDashboard();
  }
}


// ══════════════════════════════════════════════════════════════════
// NAVEGACIÓN INTERNA (sub-vistas)
// ══════════════════════════════════════════════════════════════════

function mostrarSubVista(id) {
  document.querySelectorAll('.prode-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

/**
 * Muestra el dashboard principal con la lista de grupos
 */
async function mostrarDashboard() {
  mostrarSubVista('prode-view-dashboard');
  actualizarNavBreadcrumb([{ label: '🏆 Prode' }]);
  await cargarHeroStats();
  await cargarMisGrupos();
}

/**
 * Muestra la vista de un grupo específico
 */
async function mostrarVistaGrupo(groupId) {
  _currentGroupId = groupId;
  mostrarSubVista('prode-view-grupo');
  actualizarNavBreadcrumb([
    { label: '🏆 Prode', action: mostrarDashboard },
    { label: 'Mi Grupo' }
  ]);
  await cargarVistaGrupo(groupId);
}

/**
 * Muestra la vista de predicciones (global, no por grupo)
 */
async function mostrarPredicciones() {
  mostrarSubVista('prode-view-predicciones');
  actualizarNavBreadcrumb([
    { label: '🏆 Prode', action: mostrarDashboard },
    { label: 'Mis Predicciones' }
  ]);
  await cargarPartidosParaPrediccion();
}

/**
 * Actualiza el breadcrumb de navegación interno
 */
function actualizarNavBreadcrumb(items) {
  const nav = document.getElementById('prode-breadcrumb');
  if (!nav) return;

  nav.innerHTML = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast) {
      return `<span class="prode-nav-current">${item.label}</span>`;
    }
    return `
      <button class="prode-nav-btn" onclick="(${item.action?.toString() || ''})()">
        ${item.label}
      </button>
      <span class="prode-nav-sep">›</span>
    `;
  }).join('');
}


// ══════════════════════════════════════════════════════════════════
// HERO STATS — Puntos y estadísticas personales
// ══════════════════════════════════════════════════════════════════

async function cargarHeroStats() {
  if (!_user || !_supabase) return;
  try {
    const { data: profile, error } = await _supabase
        .from('profiles')
        .select('puntos_prode, aciertos_exactos, aciertos_signo')
        .eq('id', _user.id)
        .single();

    // Si hay error (columnas faltantes, etc.) simplemente mostramos 0
    if (error || !profile) {
      console.warn('Prode hero stats no disponibles (¿columnas en profiles?):', error?.message);
      return;
    }

    const ptsEl     = document.getElementById('prode-hero-pts');
    const exactosEl = document.getElementById('prode-hero-exactos');
    const signoEl   = document.getElementById('prode-hero-signo');

    if (ptsEl)     ptsEl.textContent     = profile.puntos_prode     ?? 0;
    if (exactosEl) exactosEl.textContent = profile.aciertos_exactos ?? 0;
    if (signoEl)   signoEl.textContent   = profile.aciertos_signo   ?? 0;
  } catch (e) {
    console.warn('cargarHeroStats error (no crítico):', e.message);
    // No mostrar error al usuario — las stats son decorativas
  }
}


// ══════════════════════════════════════════════════════════════════
// GESTIÓN DE GRUPOS — Listar, crear, unirse
// ══════════════════════════════════════════════════════════════════

/**
 * Carga y renderiza los grupos del usuario autenticado
 */
async function cargarMisGrupos() {
  const container = document.getElementById('prode-groups-list');
  if (!container) return;

  container.innerHTML = `
    <div class="prode-skeleton"></div>
    <div class="prode-skeleton"></div>
    <div class="prode-skeleton" style="height:50px;opacity:.5"></div>
  `;

  if (!_supabase || !_user) {
    container.innerHTML = `
      <div class="prode-empty">
        <div class="prode-empty-icon">⚠️</div>
        <div class="prode-empty-title">Sesión no disponible</div>
        <div class="prode-empty-sub">Recargá la página para continuar</div>
      </div>
    `;
    return;
  }

  try {
    const { data: memberships, error } = await _supabase
        .from('prode_group_members')
        .select(`
          group_id,
          joined_at,
          prode_groups ( id, nombre, admin_id, invite_code, es_publico )
        `)
        .eq('user_id', _user.id)
        .order('joined_at', { ascending: false });

    if (error) throw error;

    if (!memberships || memberships.length === 0) {
      container.innerHTML = `
        <div class="prode-empty">
          <div class="prode-empty-icon">🏆</div>
          <div class="prode-empty-title">Todavía no estás en ningún grupo</div>
          <div class="prode-empty-sub">Creá uno o uníte con un código de 6 letras</div>
        </div>
      `;
      return;
    }

    // Contar miembros de cada grupo
    const groupIds = memberships.map(m => m.group_id);
    const { data: allMembers } = await _supabase.from('prode_group_members').select('group_id').in('group_id', groupIds);

    const countMap = {};
    allMembers?.forEach(m => { countMap[m.group_id] = (countMap[m.group_id] || 0) + 1; });

    container.innerHTML = memberships.map(m => {
      const g = m.prode_groups;
      if (!g) return '';
      const isAdmin    = g.admin_id === _user.id;
      const letra      = g.nombre?.charAt(0)?.toUpperCase() || '?';
      const memberCount = countMap[g.id] || 1;
      const fechaJoin  = new Date(m.joined_at).toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric' });

      return `
        <div class="prode-group-card ${isAdmin ? 'is-admin' : ''}"
             onclick="window._prodeVerGrupo('${g.id}')"
             role="button" tabindex="0"
             onkeydown="if(event.key==='Enter') window._prodeVerGrupo('${g.id}')">
          <div class="prode-group-avatar">${letra}</div>
          <div class="prode-group-info">
            <div class="prode-group-name">${escapeHtml(g.nombre)}</div>
            <div class="prode-group-meta">
              ${isAdmin ? '<span class="prode-group-badge admin">⭐ Admin</span>' : ''}
              ${g.es_publico
                ? '<span class="prode-group-badge public">🌐 Público</span>'
                : '<span class="prode-group-badge">🔒 Privado</span>'}
              <span>👥 ${memberCount} ${memberCount === 1 ? 'miembro' : 'miembros'}</span>
              <span style="color:var(--text4)">· Ingresaste: ${fechaJoin}</span>
            </div>
            <div style="margin-top:8px;display:flex;align-items:center;gap:6px">
              <span style="font-size:10px;color:var(--text4);letter-spacing:1px">CÓDIGO</span>
              <span style="font-family:var(--font-display);font-size:18px;color:var(--gold);letter-spacing:4px">${g.invite_code}</span>
            </div>
          </div>
          <div class="prode-group-arrow">›</div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Error cargarMisGrupos:', err);
    container.innerHTML = `
      <div class="prode-empty">
        <div class="prode-empty-icon">⚠️</div>
        <div class="prode-empty-title">Error al cargar grupos</div>
        <div class="prode-empty-sub" style="max-width:320px;margin:0 auto">${escapeHtml(err.message)}</div>
      </div>
    `;
  }
}

/**
 * Crea un nuevo grupo de Prode.
 */
async function crearGrupo() {
  const nombreInput    = document.getElementById('prode-create-nombre');
  const esPublicoInput = document.getElementById('prode-create-visibilidad');
  const msgEl          = document.getElementById('prode-create-msg');
  const btn            = document.getElementById('prode-create-btn');

  const nombre    = nombreInput?.value?.trim();
  const esPublico = esPublicoInput?.value === 'true';

  if (!nombre || nombre.length < 2) {
    mostrarMsg(msgEl, 'El nombre debe tener al menos 2 caracteres.', 'error');
    return;
  }

  if (!_supabase || !_user) {
    mostrarMsg(msgEl, '⚠️ Sesión no disponible. Recargá la página.', 'error');
    console.error('Prode: _supabase o _user son null', { sb: !!_supabase, user: !!_user });
    return;
  }

  btn.disabled  = true;
  btn.innerHTML = '⏳ Creando...';
  limpiarMsg(msgEl);

  try {
    console.log("Iniciando llamada RPC crear_grupo...");
    const { data, error } = await _supabase.rpc('crear_grupo', {
        p_nombre:     nombre,
        p_es_publico: esPublico
      });
    console.log("Respuesta RPC:", { data, error });

    if (error) {
      // Error de red o de comunicación con Supabase
      console.error('Error RPC crear_grupo:', error);
      if (error.message?.includes('does not exist') || error.code === 'PGRST202') {
        throw new Error('📄 La función crear_grupo no existe. ¿Ejecutaste prode_patch.sql en Supabase?');
      }
      throw error;
    }

    // La RPC devuelve { ok: true/false, ... } en el campo data
    if (!data || !data.ok) {
      throw new Error(data?.error || 'Error desconocido al crear el grupo.');
    }

    // ── Éxito ──
    mostrarMsg(msgEl, `✅ ¡Grupo "${escapeHtml(nombre)}" creado! Código: ${data.invite_code}`, 'success');
    if (nombreInput) nombreInput.value = '';

    // Mostrar código copiable
    const codeDisplay = document.getElementById('prode-new-code-display');
    const codeVal     = document.getElementById('prode-new-code-val');
    if (codeDisplay && codeVal) {
      codeVal.textContent    = data.invite_code;
      codeDisplay.style.display = 'block';
    }

    await cargarMisGrupos();

  } catch (err) {
    console.error('Error en crearGrupo:', err);
    mostrarMsg(msgEl, err.message || 'Error al crear el grupo.', 'error');
  } finally {
    btn.disabled  = false;
    btn.innerHTML = '➕ Crear Grupo';
  }
}

/**
 * Une al usuario actual a un grupo mediante código de 6 caracteres
 */
async function unirseConCodigo() {
  const codigoInput = document.getElementById('prode-join-codigo');
  const msgEl = document.getElementById('prode-join-msg');
  const btn = document.getElementById('prode-join-btn');

  const codigo = codigoInput?.value?.trim().toUpperCase();

  if (!codigo || codigo.length !== 6) {
    mostrarMsg(msgEl, 'Ingresá un código de 6 caracteres.', 'error');
    return;
  }

  // Guard
  if (!_supabase || !_user) {
    mostrarMsg(msgEl, '⚠️ Sesión no disponible. Recargá la página.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '⏳ Buscando...';
  limpiarMsg(msgEl);

  try {
    const { data, error } = await _supabase.rpc('unirse_a_grupo', {
        p_invite_code: codigo
      }); 
    if (error) throw error;

    if (!data.ok) {
      mostrarMsg(msgEl, data.error || 'No se pudo unir al grupo.', 'error');
    } else {
      mostrarMsg(msgEl, `✅ ¡Te uniste a "${escapeHtml(data.group_name)}"!`, 'success');
      if (codigoInput) codigoInput.value = '';
      await cargarMisGrupos();
      setTimeout(() => mostrarVistaGrupo(data.group_id), 1200);
    }

  } catch (err) {
    console.error('Error uniéndose al grupo:', err);
    const msg = err.code === '42P01'
      ? '📄 La tabla no existe. ¿Ejecutaste prode_schema.sql?'
      : err.message || 'Error al unirse al grupo.';
    mostrarMsg(msgEl, msg, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '🔗 Unirme al Grupo';
  }
}


// ══════════════════════════════════════════════════════════════════
// VISTA DE GRUPO — Leaderboard + Admin
// ══════════════════════════════════════════════════════════════════

/**
 * Carga y renderiza la vista completa de un grupo
 */
async function cargarVistaGrupo(groupId) {
  const container = document.getElementById('prode-grupo-content');
  if (!container) return;

  container.innerHTML = `
    <div class="prode-skeleton" style="height:100px;margin-bottom:0;border-radius:10px 10px 0 0"></div>
    <div class="prode-skeleton" style="height:300px;border-radius:0 0 10px 10px;margin-top:0"></div>
  `;

  try {
    // 1. Info del grupo
    const { data: group, error: gErr } = await _supabase
      .from('prode_groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (gErr) throw gErr;

    const isAdmin = group.admin_id === _user.id;

    // 2. Leaderboard via RPC
    const { data: leaderboard, error: lbErr } = await _supabase
      .rpc('get_group_leaderboard', { p_group_id: groupId });

    if (lbErr) throw lbErr;

    // 3. Lista de miembros (para panel admin)
    let membersHtml = '';
    if (isAdmin) {
      const { data: members } = await _supabase
        .from('prode_group_members')
        .select('user_id, joined_at, profiles(username, avatar_url)')
        .eq('group_id', groupId);

      membersHtml = renderAdminPanel(group, members || []);
    }

    // 4. Renderizar
    container.innerHTML = `
      <!-- Header del grupo -->
      <div class="prode-group-view-header">
        <div>
          <div class="prode-group-view-name">${escapeHtml(group.nombre)}</div>
          <div class="prode-group-view-meta">
            ${group.es_publico ? '🌐 Grupo Público' : '🔒 Grupo Privado'}
            · Código: <strong style="color:var(--gold)">${group.invite_code}</strong>
            · ${leaderboard?.length || 0} participantes
          </div>
        </div>
        <div class="prode-group-view-actions">
          <button class="prode-icon-btn" onclick="window._prodeCopiarCodigo('${group.invite_code}')">
            📋 Copiar código
          </button>
          <button class="prode-icon-btn" onclick="window._prodeCopiarLink('${group.invite_code}')">
            🔗 Link de invitación
          </button>
          ${isAdmin ? `
            <button class="prode-icon-btn danger" onclick="window._prodeEliminarGrupo('${groupId}')">
              🗑️ Eliminar grupo
            </button>
          ` : `
            <button class="prode-icon-btn danger" onclick="window._prodeSalirGrupo('${groupId}')">
              🚪 Salir del grupo
            </button>
          `}
        </div>
      </div>

      <!-- Tabs internas: Posiciones / Predicciones -->
      <div class="prode-inner-tabs" style="margin-top:0;background:var(--navy2);padding:0 20px;border-top:none">
        <button class="prode-inner-tab active" onclick="window._prodeInnerTab(this,'prode-inner-lb')">
          🏅 Posiciones
        </button>
        <button class="prode-inner-tab" onclick="window._prodeInnerTab(this,'prode-inner-preds')">
          📋 Mis Predicciones
        </button>
      </div>

      <!-- Leaderboard -->
      <div id="prode-inner-lb" class="prode-inner-content">
        <div class="prode-leaderboard">
          <div class="prode-lb-header">
            <span>#</span>
            <span>JUGADOR</span>
            <span style="text-align:center">EXACTOS</span>
            <span style="text-align:center">SIGNO</span>
            <span style="text-align:center">BONUS</span>
            <span style="text-align:center">PUNTOS</span>
          </div>
          ${renderLeaderboard(leaderboard, _user.id)}
        </div>
      </div>

      <!-- Predicciones de este grupo (vista pública tras bloqueo) -->
      <div id="prode-inner-preds" class="prode-inner-content" style="display:none">
        <div id="prode-group-preds-content" style="padding:20px">
          <p style="color:var(--text4);font-size:13px">Cargando predicciones...</p>
        </div>
      </div>

      ${membersHtml}
    `;

    // Adjuntar manejadores de tab interno
    window._prodeInnerTab = (btn, targetId) => {
      document.querySelectorAll('.prode-inner-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.prode-inner-content').forEach(c => c.style.display = 'none');
      btn.classList.add('active');
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'block';

      if (targetId === 'prode-inner-preds') {
        cargarPrediccionesGrupo(groupId);
      }
    };

  } catch (err) {
    console.error('Error cargando vista de grupo:', err);
    container.innerHTML = `
      <div class="prode-empty">
        <div class="prode-empty-icon">⚠️</div>
        <div class="prode-empty-title">Error al cargar el grupo</div>
        <div class="prode-empty-sub">${escapeHtml(err.message)}</div>
      </div>
    `;
  }
}

/**
 * Renderiza la tabla de posiciones del grupo
 */
function renderLeaderboard(rows, currentUserId) {
  if (!rows || rows.length === 0) {
    return `
      <div class="prode-empty" style="border:none;border-radius:0">
        <div class="prode-empty-icon">🕐</div>
        <div class="prode-empty-title">Sin datos aún</div>
        <div class="prode-empty-sub">Los puntos aparecerán cuando finalicen los partidos</div>
      </div>
    `;
  }

  const posClasses = ['top1 gold', 'top2 silver', 'top3 bronze'];
  const posMedals = ['🥇', '🥈', '🥉'];

  return rows.map((row, i) => {
    const isMe = row.user_id === currentUserId;
    const posClass = posClasses[i] || '';
    const posLabel = posMedals[i] || row.posicion;
    const avatarHtml = row.avatar_url
      ? `<img src="${escapeHtml(row.avatar_url)}" class="prode-lb-avatar" alt="${escapeHtml(row.username)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const initial = (row.username || '?').charAt(0).toUpperCase();

    return `
      <div class="prode-lb-row ${posClass} ${isMe ? 'is-me' : ''}"
           style="animation-delay: ${i * 0.05}s">
        <div class="prode-lb-pos ${posClasses[i]?.split(' ')[1] || ''}">${posLabel}</div>
        <div class="prode-lb-user">
          ${avatarHtml}
          <div class="prode-lb-avatar-fallback" ${row.avatar_url ? 'style="display:none"' : ''}>${initial}</div>
          <div>
            <div class="prode-lb-name ${isMe ? 'is-me' : ''}">
              ${escapeHtml(row.username)}
              ${isMe ? '<span class="me-tag">YO</span>' : ''}
            </div>
          </div>
        </div>
        <div class="prode-lb-cell">${row.aciertos_exactos}</div>
        <div class="prode-lb-cell">${row.aciertos_signo}</div>
        <div class="prode-lb-cell">
          ${row.puntos_bonus > 0 ? `<span class="prode-lb-bonus">+${row.puntos_bonus}</span>` : '—'}
        </div>
        <div class="prode-lb-pts">${row.puntos_total}</div>
      </div>
    `;
  }).join('');
}

/**
 * Renderiza el panel de administración (solo visible para el admin)
 */
function renderAdminPanel(group, members) {
  const membersHtml = members.map(m => {
    const isAdmin = m.user_id === group.admin_id;
    const username = m.profiles?.username || 'Usuario';
    return `
      <div class="prode-member-row">
        <div class="prode-lb-avatar-fallback" style="width:28px;height:28px;font-size:11px">
          ${username.charAt(0).toUpperCase()}
        </div>
        <div class="prode-member-name">${escapeHtml(username)}</div>
        ${isAdmin ? '<span class="prode-member-role">ADMIN</span>' : ''}
        ${!isAdmin ? `
          <button class="prode-kick-btn" onclick="window._prodeExpulsarMiembro('${group.id}','${m.user_id}','${escapeHtml(username)}')">
            Expulsar
          </button>
        ` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="prode-admin-panel" style="margin-top:20px">
      <div class="prode-admin-title">⭐ Panel de Administración</div>
      <div class="prode-admin-grid">
        <!-- Miembros -->
        <div class="prode-admin-section">
          <div class="prode-admin-section-title">MIEMBROS (${members.length})</div>
          ${membersHtml}
        </div>

        <!-- Configuración del grupo -->
        <div class="prode-admin-section">
          <div class="prode-admin-section-title">CONFIGURACIÓN</div>

          <label style="font-size:10px;color:var(--text4);letter-spacing:2px;display:block;margin-bottom:6px">
            NOMBRE DEL GRUPO
          </label>
          <input
            id="prode-admin-nombre"
            class="prode-input"
            type="text"
            value="${escapeHtml(group.nombre)}"
            maxlength="50"
            style="margin-bottom:10px"
          />

          <label style="font-size:10px;color:var(--text4);letter-spacing:2px;display:block;margin-bottom:6px">
            VISIBILIDAD
          </label>
          <div class="prode-visibility-toggle" style="margin-bottom:12px">
            <button class="prode-vis-btn ${!group.es_publico ? 'active' : ''}"
                    onclick="window._prodeSetVisibilidad(this, false)">
              🔒 Privado
            </button>
            <button class="prode-vis-btn ${group.es_publico ? 'active' : ''}"
                    onclick="window._prodeSetVisibilidad(this, true)">
              🌐 Público
            </button>
          </div>

          <button class="prode-btn prode-btn-gold"
                  style="margin-bottom:10px"
                  onclick="window._prodeGuardarConfigGrupo('${group.id}')">
            💾 Guardar cambios
          </button>

          <button class="prode-btn prode-btn-secondary"
                  onclick="window._prodeRegenerarCodigo('${group.id}')">
            🔄 Nuevo código de invitación
          </button>

          <div id="prode-admin-msg" class="prode-msg" style="margin-top:8px"></div>
        </div>
      </div>
    </div>
  `;
}


// ══════════════════════════════════════════════════════════════════
// PREDICCIONES POR GRUPO — Ver qué puso cada uno
// ══════════════════════════════════════════════════════════════════

async function cargarPrediccionesGrupo(groupId) {
  const container = document.getElementById('prode-group-preds-content');
  if (!container) return;

  container.innerHTML = '<p style="color:var(--text4);font-size:13px;padding:10px">Cargando...</p>';

  try {
    // Obtener partidos bloqueados (kickoff <= ahora + 1h o estado != programado)
    const cutoff = new Date(Date.now() + LOCK_MINUTES_BEFORE * 60 * 1000).toISOString();

    const { data: partidos } = await _supabase
      .from('partidos')
      .select('id, equipo_local, equipo_visitante, fecha_utc, estado, goles_local, goles_visitante, fase, escudo_local, escudo_visitante')
      .or(`fecha_utc.lte.${cutoff},estado.neq.programado`)
      .order('fecha_utc', { ascending: false })
      .limit(20);

    if (!partidos || partidos.length === 0) {
      container.innerHTML = `
        <div class="prode-empty" style="border:none">
          <div class="prode-empty-icon">⏳</div>
          <div class="prode-empty-title">Sin partidos bloqueados aún</div>
          <div class="prode-empty-sub">Las predicciones se revelan 1 hora antes del kickoff</div>
        </div>
      `;
      return;
    }

    // Obtener miembros del grupo
    const { data: membersData } = await _supabase
      .from('prode_group_members')
      .select('user_id, profiles(username)')
      .eq('group_id', groupId);

    const memberIds = membersData?.map(m => m.user_id) || [];
    const memberMap = {};
    membersData?.forEach(m => { memberMap[m.user_id] = m.profiles?.username || 'Usuario'; });

    // Obtener predicciones de todos los miembros para esos partidos
    const { data: predicciones } = await _supabase
      .from('prode_predictions')
      .select('partido_id, user_id, pred_goles_local, pred_goles_visitante, puntos_obtenidos, puntos_bonus')
      .in('partido_id', partidos.map(p => p.id))
      .in('user_id', memberIds);

    // Agrupar predicciones por partido
    const predMap = {};
    predicciones?.forEach(pred => {
      if (!predMap[pred.partido_id]) predMap[pred.partido_id] = {};
      predMap[pred.partido_id][pred.user_id] = pred;
    });

    container.innerHTML = partidos.map(partido => {
      const predsPartido = predMap[partido.id] || {};
      const fechaStr = new Date(partido.fecha_utc).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });

      const predRows = memberIds.map(uid => {
        const p = predsPartido[uid];
        const username = memberMap[uid];
        if (!p) return `
          <tr>
            <td style="padding:8px 12px;color:var(--text4)">${escapeHtml(username)}</td>
            <td style="text-align:center;color:var(--text4)">—</td>
            <td style="text-align:center;color:var(--text4)">Sin predicción</td>
          </tr>
        `;

        const scoreStr = `${p.pred_goles_local} — ${p.pred_goles_visitante}`;
        const ptsBadge = p.puntos_obtenidos !== null
          ? `<span class="prode-points-badge pts-${p.puntos_obtenidos}">${p.puntos_obtenidos} pts</span>`
          : '';
        const bonusBadge = p.puntos_bonus > 0
          ? `<span class="prode-points-badge bonus">+${p.puntos_bonus} BONUS</span>`
          : '';

        return `
          <tr>
            <td style="padding:8px 12px;color:var(--text2);font-weight:600">${escapeHtml(username)}</td>
            <td style="text-align:center;font-family:var(--font-display);font-size:18px;color:var(--white)">${scoreStr}</td>
            <td style="text-align:center">${ptsBadge}${bonusBadge}</td>
          </tr>
        `;
      }).join('');

      return `
        <div style="background:var(--navy2);border:1px solid var(--border2);border-radius:8px;margin-bottom:14px;overflow:hidden">
          <div style="background:var(--navy3);padding:10px 16px;border-bottom:1px solid var(--border2)">
            <div style="font-size:12px;font-weight:700;color:var(--text2)">
              ${escapeHtml(partido.equipo_local)} vs ${escapeHtml(partido.equipo_visitante)}
            </div>
            <div style="font-size:10px;color:var(--text4);margin-top:2px">
              ${fechaStr} · ${partido.fase}
              ${partido.estado === 'finalizado'
                ? `· Resultado real: <strong style="color:var(--red)">${partido.goles_local} — ${partido.goles_visitante}</strong>`
                : partido.estado === 'en_curso' ? '🔴 En curso' : ''}
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="font-size:10px;color:var(--text4);letter-spacing:2px">
                <th style="padding:8px 12px;text-align:left;font-weight:700">JUGADOR</th>
                <th style="text-align:center;font-weight:700">PRED.</th>
                <th style="text-align:center;font-weight:700">PUNTOS</th>
              </tr>
            </thead>
            <tbody>${predRows}</tbody>
          </table>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Error cargando predicciones del grupo:', err);
    container.innerHTML = `<p style="color:#ff7788;padding:10px">Error: ${escapeHtml(err.message)}</p>`;
  }
}


// ══════════════════════════════════════════════════════════════════
// CARGA DE PREDICCIONES — Formulario de predicciones
// ══════════════════════════════════════════════════════════════════

/**
 * Carga los partidos disponibles para predicción y renderiza los formularios
 */
async function cargarPartidosParaPrediccion() {
  const container = document.getElementById('prode-predictions-list');
  if (!container) return;

  // Limpiar intervalos de countdown anteriores
  _countdownIntervals.forEach(id => clearInterval(id));
  _countdownIntervals = [];

  container.innerHTML = `
    <div class="prode-skeleton"></div>
    <div class="prode-skeleton"></div>
    <div class="prode-skeleton"></div>
  `;

  try {
    // Obtener TODOS los partidos (programados y algunos finalizados recientes)
    const { data: partidos, error } = await _supabase
      .from('partidos')
      .select('id, equipo_local, equipo_visitante, fecha_utc, estado, goles_local, goles_visitante, fase, escudo_local, escudo_visitante, jornada')
      .order('fecha_utc', { ascending: true })
      .limit(60);

    if (error) throw error;

    if (!partidos || partidos.length === 0) {
      container.innerHTML = `
        <div class="prode-empty">
          <div class="prode-empty-icon">📅</div>
          <div class="prode-empty-title">No hay partidos cargados</div>
          <div class="prode-empty-sub">El fixture aparecerá cuando el torneo esté próximo</div>
        </div>
      `;
      return;
    }

    // Obtener predicciones existentes del usuario para estos partidos
    const { data: preds } = await _supabase
      .from('prode_predictions')
      .select('partido_id, pred_goles_local, pred_goles_visitante, puntos_obtenidos, puntos_bonus')
      .eq('user_id', _user.id)
      .in('partido_id', partidos.map(p => p.id));

    const predMap = {};
    preds?.forEach(p => { predMap[p.partido_id] = p; });

    const now = Date.now();

    container.innerHTML = partidos.map(partido => {
      const kickoff = new Date(partido.fecha_utc).getTime();
      const minutesLeft = (kickoff - now) / 60000;
      const isLocked = minutesLeft <= LOCK_MINUTES_BEFORE || partido.estado !== 'programado';
      const isFinished = partido.estado === 'finalizado';
      const isLive = partido.estado === 'en_curso';
      const pred = predMap[partido.id];

      const fechaStr = new Date(partido.fecha_utc).toLocaleDateString('es-AR', {
        weekday: 'short', day: '2-digit', month: 'short'
      });
      const horaStr = new Date(partido.fecha_utc).toLocaleTimeString('es-AR', {
        hour: '2-digit', minute: '2-digit'
      });

      // Puntos badge
      let ptsBadgeHtml = '';
      if (pred && pred.puntos_obtenidos !== null) {
        const ptsClass = pred.puntos_obtenidos === 3 ? 'pts-3' : pred.puntos_obtenidos === 1 ? 'pts-1' : 'pts-0';
        const ptsLabel = pred.puntos_obtenidos === 3 ? '✅ Exacto' : pred.puntos_obtenidos === 1 ? '➡️ Tendencia' : '❌ Sin puntos';
        ptsBadgeHtml = `<span class="prode-points-badge ${ptsClass}">${pred.puntos_obtenidos} pts · ${ptsLabel}</span>`;
        if (pred.puntos_bonus > 0) {
          ptsBadgeHtml += `<span class="prode-points-badge bonus" style="margin-left:6px">⭐ +${pred.puntos_bonus} BONUS</span>`;
        }
      }

      // Lock banner
      let lockBannerHtml = '';
      if (isFinished) {
        lockBannerHtml = `
          <div class="prode-lock-banner hard-lock">
            <span class="prode-lock-icon">🔒</span>
            Partido finalizado — Resultado: ${partido.goles_local} — ${partido.goles_visitante}
          </div>
        `;
      } else if (isLive) {
        lockBannerHtml = `
          <div class="prode-lock-banner hard-lock">
            <span class="prode-lock-icon">🔴</span>
            Partido en curso — Predicciones cerradas
          </div>
        `;
      } else if (isLocked) {
        lockBannerHtml = `
          <div class="prode-lock-banner">
            <span class="prode-lock-icon">⏳</span>
            Menos de 1 hora para el inicio — Predicciones bloqueadas
          </div>
        `;
      } else {
        // Mostrar countdown solo si faltan menos de 24 horas
        if (minutesLeft < 1440) {
          lockBannerHtml = `
            <div style="font-size:11px;color:var(--text4)">
              Cierra en: <span class="prode-countdown" id="countdown-${partido.id}">calculando...</span>
            </div>
          `;
        }
      }

      // Shields
      const shieldLocal = partido.escudo_local
        ? `<img src="${escapeHtml(partido.escudo_local)}" class="prode-team-shield" alt="${escapeHtml(partido.equipo_local)}" onerror="this.style.display='none'">`
        : `<div class="prode-team-shield-fallback">⚽</div>`;
      const shieldVisit = partido.escudo_visitante
        ? `<img src="${escapeHtml(partido.escudo_visitante)}" class="prode-team-shield" alt="${escapeHtml(partido.equipo_visitante)}" onerror="this.style.display='none'">`
        : `<div class="prode-team-shield-fallback">⚽</div>`;

      const predLocal = pred?.pred_goles_local ?? '';
      const predVisit = pred?.pred_goles_visitante ?? '';

      return `
        <div class="prode-match-card ${isLocked ? 'locked' : ''}" id="match-card-${partido.id}">
          <!-- Header -->
          <div class="prode-match-header">
            <span class="prode-match-phase">${escapeHtml(partido.fase)}</span>
            <span class="prode-match-date">${fechaStr}</span>
            <span class="prode-match-kickoff">🕐 ${horaStr}</span>
          </div>

          <!-- Body: equipos + inputs -->
          <div class="prode-match-body">
            <!-- Equipo Local -->
            <div class="prode-team-side">
              ${shieldLocal}
              <div class="prode-team-name">${escapeHtml(partido.equipo_local)}</div>
            </div>

            <!-- Centro -->
            <div class="prode-score-area">
              <div class="prode-score-inputs">
                <input
                  type="number"
                  class="prode-score-input"
                  id="pred-local-${partido.id}"
                  min="0" max="99"
                  value="${predLocal}"
                  ${isLocked ? 'disabled' : ''}
                  placeholder="—"
                  oninput="this.value=this.value.slice(0,2)"
                  onchange="window._prodeAutoGuardar('${partido.id}')"
                />
                <span class="prode-score-sep">—</span>
                <input
                  type="number"
                  class="prode-score-input"
                  id="pred-visit-${partido.id}"
                  min="0" max="99"
                  value="${predVisit}"
                  ${isLocked ? 'disabled' : ''}
                  placeholder="—"
                  oninput="this.value=this.value.slice(0,2)"
                  onchange="window._prodeAutoGuardar('${partido.id}')"
                />
              </div>
              ${isFinished ? `
                <div class="prode-real-score">
                  Resultado real: <strong>${partido.goles_local} — ${partido.goles_visitante}</strong>
                </div>
              ` : ''}
            </div>

            <!-- Equipo Visitante -->
            <div class="prode-team-side">
              ${shieldVisit}
              <div class="prode-team-name">${escapeHtml(partido.equipo_visitante)}</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="prode-match-footer">
            ${lockBannerHtml}
            <div style="display:flex;align-items:center;gap:10px;margin-left:auto">
              ${ptsBadgeHtml}
              ${!isLocked ? `
                <button
                  class="prode-save-btn ${pred ? 'saved' : ''}"
                  id="save-btn-${partido.id}"
                  onclick="window._prodeGuardarPrediccion('${partido.id}')"
                >
                  ${pred ? '✅ Guardado' : '💾 Guardar'}
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Iniciar countdowns para partidos próximos
    partidos.forEach(partido => {
      if (partido.estado === 'programado') {
        const kickoff = new Date(partido.fecha_utc).getTime();
        const minutesLeft = (kickoff - Date.now()) / 60000;
        if (minutesLeft < 1440 && minutesLeft > 0) {
          iniciarCountdown(partido.id, kickoff);
        }
      }
    });

  } catch (err) {
    console.error('Error cargando partidos para predicción:', err);
    container.innerHTML = `
      <div class="prode-empty">
        <div class="prode-empty-icon">⚠️</div>
        <div class="prode-empty-title">Error al cargar los partidos</div>
        <div class="prode-empty-sub">${escapeHtml(err.message)}</div>
      </div>
    `;
  }
}

/**
 * Inicia un countdown visual para un partido
 */
function iniciarCountdown(partidoId, kickoffTime) {
  const el = document.getElementById(`countdown-${partidoId}`);
  if (!el) return;

  const update = () => {
    const diff = kickoffTime - Date.now();
    if (diff <= 0) {
      el.textContent = '🔒 Cerrado';
      // Bloquear los inputs de este partido
      const card = document.getElementById(`match-card-${partidoId}`);
      if (card) {
        card.classList.add('locked');
        card.querySelectorAll('.prode-score-input').forEach(i => i.disabled = true);
        card.querySelectorAll('.prode-save-btn').forEach(b => b.remove());
      }
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;

    // Advertencia cuando queda menos de 10 minutos
    if (diff < 600000) {
      el.style.color = '#ff7788';
    }
  };

  update();
  const intervalId = setInterval(update, 1000);
  _countdownIntervals.push(intervalId);
}

/**
 * Auto-guarda cuando el usuario cambia un input (con debounce)
 */
const _autoGuardarDebounce = {};
window._prodeAutoGuardar = (partidoId) => {
  clearTimeout(_autoGuardarDebounce[partidoId]);
  _autoGuardarDebounce[partidoId] = setTimeout(() => {
    _prodeGuardarPrediccionSilent(partidoId);
  }, 1500);
};

/**
 * Guarda predicción de forma silenciosa (sin feedback visual agresivo)
 */
async function _prodeGuardarPrediccionSilent(partidoId) {
  const btn = document.getElementById(`save-btn-${partidoId}`);
  await guardarPrediccion(partidoId, btn, false);
}

/**
 * Guarda la predicción de un partido (llamado por botón "Guardar")
 */
window._prodeGuardarPrediccion = async (partidoId) => {
  const btn = document.getElementById(`save-btn-${partidoId}`);
  await guardarPrediccion(partidoId, btn, true);
};

/**
 * Lógica principal de guardado con validación de tiempo
 */
async function guardarPrediccion(partidoId, btn, showFeedback = true) {
  if (!_supabase || !_user) return;

  const localInput = document.getElementById(`pred-local-${partidoId}`);
  const visitInput = document.getElementById(`pred-visit-${partidoId}`);

  if (!localInput || !visitInput) return;

  const golesLocal = parseInt(localInput.value);
  const golesVisit = parseInt(visitInput.value);

  if (isNaN(golesLocal) || isNaN(golesVisit) || golesLocal < 0 || golesVisit < 0) {
    if (showFeedback) mostrarToast('Ingresá valores válidos (0 o más)', 'error');
    return;
  }

  // Validación de tiempo en el cliente (defensa adicional, la RLS hace la real)
  const { data: partido } = await _supabase
    .from('partidos')
    .select('fecha_utc, estado')
    .eq('id', partidoId)
    .single();

  if (partido) {
    const kickoff = new Date(partido.fecha_utc).getTime();
    const minutesLeft = (kickoff - Date.now()) / 60000;
    if (minutesLeft <= LOCK_MINUTES_BEFORE || partido.estado !== 'programado') {
      if (showFeedback) mostrarToast('🔒 Este partido ya no acepta predicciones', 'error');
      return;
    }
  }

  if (btn) {
    btn.textContent = '⏳ Guardando...';
    btn.disabled = true;
  }

  try {
    const { error } = await _supabase
      .from('prode_predictions')
      .upsert({
        partido_id: partidoId,
        user_id: _user.id,
        pred_goles_local: golesLocal,
        pred_goles_visitante: golesVisit,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'partido_id,user_id'
      });

    if (error) throw error;

    if (btn) {
      btn.textContent = '✅ Guardado';
      btn.classList.add('saved');
      btn.disabled = false;
    }
    if (showFeedback) mostrarToast('Predicción guardada ✅', 'success');

  } catch (err) {
    console.error('Error guardando predicción:', err);
    if (btn) {
      btn.textContent = '💾 Guardar';
      btn.classList.remove('saved');
      btn.disabled = false;
    }
    if (showFeedback) {
      const msg = err.message?.includes('row-level') || err.code === '42501'
        ? '🔒 No se puede guardar: el partido está a punto de comenzar'
        : err.message || 'Error al guardar la predicción';
      mostrarToast(msg, 'error');
    }
  }
}


// ══════════════════════════════════════════════════════════════════
// ACCIONES DE ADMIN
// ══════════════════════════════════════════════════════════════════

window._prodeSetVisibilidad = (btn, value) => {
  document.querySelectorAll('.prode-vis-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  btn.dataset.value = value;
};

window._prodeGuardarConfigGrupo = async (groupId) => {
  const nombreInput = document.getElementById('prode-admin-nombre');
  const visBtn = document.querySelector('.prode-vis-btn.active');
  const msgEl = document.getElementById('prode-admin-msg');

  const nombre = nombreInput?.value?.trim();
  const esPublico = visBtn?.dataset?.value === 'true' || visBtn?.textContent?.includes('Público');

  if (!nombre || nombre.length < 2) {
    mostrarMsg(msgEl, 'El nombre debe tener al menos 2 caracteres.', 'error');
    return;
  }

  try {
    const { error } = await _supabase
      .from('prode_groups')
      .update({ nombre, es_publico: esPublico, updated_at: new Date().toISOString() })
      .eq('id', groupId);

    if (error) throw error;
    mostrarMsg(msgEl, '✅ Configuración guardada.', 'success');
    // Recargar para actualizar el header
    setTimeout(() => cargarVistaGrupo(groupId), 1000);

  } catch (err) {
    mostrarMsg(msgEl, err.message || 'Error al guardar.', 'error');
  }
};

window._prodeExpulsarMiembro = async (groupId, userId, username) => {
  if (!confirm(`¿Expulsar a ${username} del grupo?`)) return;

  try {
    const { error } = await _supabase
      .from('prode_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
    mostrarToast(`${username} fue expulsado del grupo`, 'success');
    await cargarVistaGrupo(groupId);

  } catch (err) {
    mostrarToast(err.message || 'Error al expulsar miembro.', 'error');
  }
};

window._prodeRegenerarCodigo = async (groupId) => {
  if (!confirm('¿Generar un nuevo código de invitación? El código anterior dejará de funcionar.')) return;

  try {
    const { data: newCode, error } = await _supabase.rpc('regenerar_invite_code', {
      p_group_id: groupId
    });

    if (error) throw error;
    mostrarToast(`Nuevo código: ${newCode}`, 'success');
    await cargarVistaGrupo(groupId);

  } catch (err) {
    mostrarToast(err.message || 'Error al regenerar el código.', 'error');
  }
};

window._prodeEliminarGrupo = async (groupId) => {
  if (!confirm('⚠️ ¿Eliminar el grupo permanentemente? Esta acción no se puede deshacer.')) return;

  try {
    const { error } = await _supabase
      .from('prode_groups')
      .delete()
      .eq('id', groupId);

    if (error) throw error;
    mostrarToast('Grupo eliminado.', 'success');
    await mostrarDashboard();

  } catch (err) {
    mostrarToast(err.message || 'Error al eliminar el grupo.', 'error');
  }
};

window._prodeSalirGrupo = async (groupId) => {
  if (!confirm('¿Salir de este grupo?')) return;

  try {
    const { error } = await _supabase
      .from('prode_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', _user.id);

    if (error) throw error;
    mostrarToast('Saliste del grupo.', 'success');
    await mostrarDashboard();

  } catch (err) {
    mostrarToast(err.message || 'Error al salir del grupo.', 'error');
  }
};


// ══════════════════════════════════════════════════════════════════
// UTILIDADES — Copiar, navegar, mensajes
// ══════════════════════════════════════════════════════════════════

window._prodeVerGrupo = (groupId) => mostrarVistaGrupo(groupId);
window._prodeIrPredicciones = () => mostrarPredicciones();
window._prodeIrDashboard = () => mostrarDashboard();
window._prodeUnirseConCodigo = () => unirseConCodigo();

/**
 * Filtra las tarjetas de predicción visibles por estado
 */
window._prodeFiltrarPartidos = (btn, filtro) => {
  document.querySelectorAll('.prode-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.prode-match-card').forEach(card => {
    if (filtro === 'todos') {
      card.style.display = '';
    } else if (filtro === 'abiertos') {
      card.style.display = card.classList.contains('locked') ? 'none' : '';
    } else if (filtro === 'bloqueados') {
      // Bloqueados pero no finalizados (en_curso o < 1h)
      const footer = card.querySelector('.prode-lock-banner');
      const isFinished = footer?.textContent?.includes('finalizado');
      card.style.display = (card.classList.contains('locked') && !isFinished) ? '' : 'none';
    } else if (filtro === 'finalizados') {
      const footer = card.querySelector('.prode-lock-banner.hard-lock');
      card.style.display = footer?.textContent?.includes('finalizado') ? '' : 'none';
    }
  });
};

window._prodeCopiarCodigo = async (codigo) => {
  try {
    await navigator.clipboard.writeText(codigo);
    mostrarToast(`Código copiado: ${codigo}`, 'success');
  } catch {
    mostrarToast(`Código: ${codigo} (copiá manualmente)`, 'info');
  }
};

window._prodeCopiarLink = async (codigo) => {
  const url = `${window.location.origin}${window.location.pathname}?invite=${codigo}`;
  try {
    await navigator.clipboard.writeText(url);
    mostrarToast('Link de invitación copiado 🔗', 'success');
  } catch {
    mostrarToast(`Link: ${url}`, 'info');
  }
};

window._prodeCrearGrupo = () => crearGrupo();
window._prodeUnirseConCodigo = () => unirseConCodigo();

/**
 * Muestra un mensaje en un elemento específico
 */
function mostrarMsg(el, text, type) {
  if (!el) return;
  el.className = `prode-msg ${type}`;
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(() => { if (el) el.style.display = 'none'; }, 5000);
}

function limpiarMsg(el) {
  if (!el) return;
  el.style.display = 'none';
  el.textContent = '';
}

/**
 * Muestra un toast flotante en la esquina de la pantalla
 */
function mostrarToast(message, type = 'info') {
  let toast = document.getElementById('prode-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'prode-toast';
    toast.style.cssText = `
      position: fixed; bottom: 90px; right: 20px; z-index: 9998;
      padding: 12px 20px; border-radius: 8px; font-size: 13px;
      font-family: var(--font-ui); font-weight: 700; letter-spacing: .5px;
      max-width: 320px; box-shadow: 0 8px 32px #00000077;
      animation: fadeUp .3s ease;
      transition: opacity .3s ease;
    `;
    document.body.appendChild(toast);
  }

  const styles = {
    success: { bg: '#00AA5530', color: '#00DD77', border: '1px solid #00AA5555' },
    error:   { bg: '#ff445520', color: '#ff7788', border: '1px solid #ff445540' },
    info:    { bg: '#FFD70022', color: '#FFD700', border: '1px solid #FFD70044' },
  };
  const s = styles[type] || styles.info;

  toast.style.background = s.bg;
  toast.style.color = s.color;
  toast.style.border = s.border;
  toast.textContent = message;
  toast.style.opacity = '1';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, 3500);
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


// ══════════════════════════════════════════════════════════════════
// DETECCIÓN DE INVITE CODE EN URL
// Útil para el flujo: "Abrir link → unirse automáticamente"
// ══════════════════════════════════════════════════════════════════

export function checkInviteCode() {
  const params = new URLSearchParams(window.location.search);
  const inviteCode = params.get('invite');
  if (!inviteCode) return;

  // Pre-llenar el campo de código y mostrar la vista
  const codigoInput = document.getElementById('prode-join-codigo');
  if (codigoInput) {
    codigoInput.value = inviteCode.toUpperCase();
    mostrarToast(`Código de invitación detectado: ${inviteCode.toUpperCase()}`, 'info');
  }

  // Limpiar el parámetro de la URL para que no quede visible
  const newUrl = window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}
