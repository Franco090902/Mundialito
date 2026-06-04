/* ══════════════════════════════════════════════════════════════════
   ranking.js — Widgets de ranking global para Wordle y Higher/Lower
   IMPORTANTE: game_name debe coincidir exactamente con lo que
   guarda /api/stats/update → 'wordle' y 'higher_lower'
══════════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────
   createRankingWidget(containerId, gameName, title)
   
   Renderiza un widget de ranking completo dentro del container dado.
   Parámetros:
     - containerId : ID del elemento DOM donde montar el widget
     - gameName    : nombre del juego tal como está en la BD
                     ('wordle' | 'higher_lower')
     - title       : texto para el encabezado del widget
──────────────────────────────────────────────────────────────────── */
export function createRankingWidget(containerId, gameName, title) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isWordle = gameName === 'wordle';

  /* ── Columnas según el juego ── */
  const colHeaders = isWordle
    ? `<th style="${thStyle}text-align:right;">🔥 Racha</th>
       <th style="${thStyle}text-align:right;">⭐ Récord</th>`
    : `<th style="${thStyle}text-align:right;">🏆 Récord</th>`;

  container.innerHTML = `
    <div class="ranking-widget" style="
      padding: 20px;
      background: linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.03) 100%);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      margin-bottom: 24px;
      backdrop-filter: blur(6px);
    ">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
        <h3 style="
          color: var(--gold, #f0c040);
          font-size: 17px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        ">🏆 Ranking · ${title}</h3>
        <button class="btn-ranking-refresh" style="
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          color: var(--offwhite, #ddd);
          font-size: 12px;
          padding: 5px 12px;
          cursor: pointer;
          transition: background 0.2s;
        " title="Actualizar ranking">↻ Actualizar</button>
      </div>

      <div style="overflow-x: auto; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07);">
        <table style="width:100%; border-collapse:collapse; color:var(--offwhite,#ddd); font-size:14px;">
          <thead>
            <tr style="background:rgba(255,255,255,0.06);">
              <th style="${thStyle}text-align:center; width:48px;">#</th>
              <th style="${thStyle}">Jugador</th>
              ${colHeaders}
            </tr>
          </thead>
          <tbody class="ranking-table-body">
            <tr><td colspan="${isWordle ? 4 : 3}" style="${emptyStyle}">
              <span class="ranking-spinner">⏳</span> Cargando ranking...
            </td></tr>
          </tbody>
        </table>
      </div>

      <div style="display:flex; justify-content:center; gap:10px; margin-top:12px;">
        <button class="btn-ranking-less btn-token" style="${btnStyle}display:none; background:#444;">◀ Anterior</button>
        <button class="btn-ranking-more btn-token" style="${btnStyle}display:none;">Siguiente ▶</button>
      </div>
    </div>
  `;

  let currentOffset = 0;
  const limit = 10;
  let totalRows = 0;

  const tableBody    = container.querySelector('.ranking-table-body');
  const btnMore      = container.querySelector('.btn-ranking-more');
  const btnLess      = container.querySelector('.btn-ranking-less');
  const btnRefresh   = container.querySelector('.btn-ranking-refresh');

  /* ── Actualizar estado de los botones de paginación ── */
  function updateButtons() {
    btnMore.style.display = (currentOffset + limit < totalRows) ? 'inline-block' : 'none';
    btnLess.style.display = (currentOffset > 0) ? 'inline-block' : 'none';
  }

  /* ── Render de una página del ranking ── */
  async function fetchRanking() {
    tableBody.innerHTML = `<tr><td colspan="${isWordle ? 4 : 3}" style="${emptyStyle}">⏳ Cargando...</td></tr>`;

    try {
      const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3000' 
        : 'https://mundialito-hzhf.onrender.com';

      const res  = await fetch(`${API_BASE_URL}/api/stats/ranking/${gameName}?limit=${limit}&offset=${currentOffset}`);
      const data = await res.json();

      tableBody.innerHTML = '';

      if (!data.success || !data.ranking) {
        tableBody.innerHTML = `<tr><td colspan="${isWordle ? 4 : 3}" style="${emptyStyle} color:#e57373;">
          ⚠ Error al cargar el ranking
        </td></tr>`;
        return;
      }

      totalRows = data.total || 0;
      const rows = data.ranking;

      if (rows.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="${isWordle ? 4 : 3}" style="${emptyStyle}">
          Todavía no hay jugadores en este ranking.<br>
          <span style="font-size:12px; opacity:0.6;">¡Sé el primero en jugar!</span>
        </td></tr>`;
        updateButtons();
        return;
      }

      const currentUserId = window.getCurrentUserId ? window.getCurrentUserId() : null;

      rows.forEach((row, index) => {
        const pos = currentOffset + index + 1;
        const isMe = currentUserId && row.user_id === currentUserId;

        /* Medallas para top 3 */
        const posHtml = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉'
          : `<span style="color:var(--text3,#888); font-size:13px;">${pos}</span>`;

        /* Celdas de valor según el juego */
        const valueCells = isWordle
          ? `<td style="padding:10px 14px; text-align:right; font-weight:700; color:var(--gold,#f0c040); font-size:15px;">
               ${row.current_streak ?? 0} 🔥
             </td>
             <td style="padding:10px 14px; text-align:right; font-size:13px; color:var(--offwhite,#ccc);">
               ${row.max_streak ?? 0}
             </td>`
          : `<td style="padding:10px 14px; text-align:right; font-weight:700; color:var(--gold,#f0c040); font-size:15px;">
               ${row.max_score ?? 0}
             </td>`;

        /* Avatar con fallback inicial */
        const initials = (row.profiles?.username || 'U')[0].toUpperCase();
        const avatarHtml = row.profiles?.avatar_url
          ? `<img src="${row.profiles.avatar_url}"
                  onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                  style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
          : '';
        const fallbackStyle = row.profiles?.avatar_url ? 'display:none;' : 'display:flex;';

        const tr = document.createElement('tr');
        tr.className = 'ranking-row';
        tr.style.cssText = `
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: background 0.15s;
          ${isMe ? 'background: rgba(240,192,64,0.08);' : ''}
          animation: rankFadeIn 0.25s ease both;
          animation-delay: ${index * 40}ms;
        `;
        tr.title = 'Ver perfil público';
        tr.onclick = () => window.openPublicProfile && window.openPublicProfile(row.user_id);
        tr.onmouseenter = () => { tr.style.background = isMe ? 'rgba(240,192,64,0.14)' : 'rgba(255,255,255,0.04)'; };
        tr.onmouseleave = () => { tr.style.background = isMe ? 'rgba(240,192,64,0.08)' : ''; };

        tr.innerHTML = `
          <td style="padding:10px 14px; text-align:center; font-size:18px; font-weight:700;">${posHtml}</td>
          <td style="padding:10px 14px;">
            <div style="display:flex; align-items:center; gap:8px;">
              ${avatarHtml}
              <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--gold,#f0c040),#e07b00);
                          color:#111;${fallbackStyle}align-items:center;justify-content:center;
                          font-weight:700;font-size:12px;flex-shrink:0;">
                ${initials}
              </div>
              <span style="${isMe ? 'color:var(--gold,#f0c040);font-weight:700;' : ''}">
                ${row.profiles?.username || 'Anónimo'}${isMe ? ' ★' : ''}
              </span>
            </div>
          </td>
          ${valueCells}
        `;

        tableBody.appendChild(tr);
      });

      updateButtons();
    } catch (err) {
      console.error(`[Ranking] Error al cargar ${gameName}:`, err);
      tableBody.innerHTML = `<tr><td colspan="${isWordle ? 4 : 3}" style="${emptyStyle} color:#e57373;">
        ⚠ Error de conexión
      </td></tr>`;
    }
  }

  /* ── Paginación ── */
  btnMore.addEventListener('click', () => {
    currentOffset += limit;
    fetchRanking();
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  btnLess.addEventListener('click', () => {
    currentOffset = Math.max(0, currentOffset - limit);
    fetchRanking();
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* ── Refresh manual ── */
  btnRefresh.addEventListener('click', () => {
    currentOffset = 0;
    fetchRanking();
  });
  btnRefresh.onmouseenter = () => { btnRefresh.style.background = 'rgba(255,255,255,0.13)'; };
  btnRefresh.onmouseleave = () => { btnRefresh.style.background = 'rgba(255,255,255,0.07)'; };

  /* ── Carga inicial ── */
  fetchRanking();

  /* ── Exponer función de refresh para llamar desde afuera ── */
  container._refreshRanking = () => { currentOffset = 0; fetchRanking(); };
}

/* ──────────────────────────────────────────────────────────────────
   Estilos compartidos (como strings para inline CSS)
──────────────────────────────────────────────────────────────────── */
const thStyle   = 'padding:10px 14px; font-size:12px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:var(--text3,#999); border-bottom:1px solid rgba(255,255,255,0.08);';
const emptyStyle = 'text-align:center; padding:28px 14px; color:var(--text3,#888); font-size:14px; line-height:1.6;';
const btnStyle   = 'padding:7px 16px; font-size:12px; margin:0; border-radius:8px; cursor:pointer; ';

/* ──────────────────────────────────────────────────────────────────
   Animación de entrada para las filas
──────────────────────────────────────────────────────────────────── */
if (!document.getElementById('ranking-keyframes')) {
  const style = document.createElement('style');
  style.id = 'ranking-keyframes';
  style.textContent = `
    @keyframes rankFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ranking-row:last-child { border-bottom: none !important; }
  `;
  document.head.appendChild(style);
}

/* ──────────────────────────────────────────────────────────────────
   Inicialización automática al cargar el DOM
   
   CRÍTICO: game_name debe coincidir con lo que guarda /api/stats/update
   - Wordle      → 'wordle'
   - Higher/Lower → 'higher_lower'  (con guión bajo, NO 'higherlower')
──────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  createRankingWidget('wordle-ranking-container',      'wordle',        'Wordle');
  createRankingWidget('higherlower-ranking-container', 'higher_lower',  'Higher / Lower');
});

/* ──────────────────────────────────────────────────────────────────
   window.refreshGameRanking(gameName)
   
   Permite refrescar el ranking de un juego específico desde cualquier
   parte del código (ej: después de guardar un puntaje).
   
   Uso:
     window.refreshGameRanking('wordle');
     window.refreshGameRanking('higher_lower');
──────────────────────────────────────────────────────────────────── */
window.refreshGameRanking = function(gameName) {
  const idMap = {
    'wordle':        'wordle-ranking-container',
    'higher_lower':  'higherlower-ranking-container',
  };
  const containerId = idMap[gameName];
  if (!containerId) return;
  const container = document.getElementById(containerId);
  if (container && typeof container._refreshRanking === 'function') {
    container._refreshRanking();
  }
};

/* ──────────────────────────────────────────────────────────────────
   window.openPublicProfile(userId)
   Abre el overlay de perfil público de otro jugador.
──────────────────────────────────────────────────────────────────── */
window.openPublicProfile = async function(userId) {
  if (!userId) return;

  const overlay  = document.getElementById('public-profile-overlay');
  const loading  = document.getElementById('public-profile-loading');
  const content  = document.getElementById('public-profile-content');
  if (!overlay || !loading || !content) return;

  overlay.classList.remove('hidden');
  loading.style.display  = 'block';
  content.style.display  = 'none';
  loading.textContent    = '⏳ Cargando perfil...';

  try {
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:3000' 
      : 'https://mundialito-hzhf.onrender.com';

    const res  = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`);
    const data = await res.json();

    if (data.success && data.profile) {
      const p = data.profile;

      document.getElementById('public-profile-username').textContent = p.username || 'Anónimo';

      const avatarImg = document.getElementById('public-profile-avatar');
      const avatarFb  = document.getElementById('public-profile-avatar-fallback');

      if (p.avatar_url) {
        avatarImg.src          = p.avatar_url;
        avatarImg.style.display = 'block';
        avatarFb.style.display  = 'none';
      } else {
        avatarImg.style.display = 'none';
        avatarFb.style.display  = 'flex';
        avatarFb.textContent    = (p.username || 'U')[0].toUpperCase();
      }

      const stats      = data.game_stats || [];
      // Notar: buscar por 'higher_lower' (con guión bajo) — igual que el backend
      const wordleStats = stats.find(g => g.game_name === 'wordle');
      const hlStats     = stats.find(g => g.game_name === 'higher_lower');

      document.getElementById('public-stat-wordle-streak').textContent = wordleStats?.max_streak  ?? '0';
      document.getElementById('public-stat-wordle-score').textContent  = wordleStats?.max_score   ?? '0';
      document.getElementById('public-stat-hl-streak').textContent     = hlStats?.max_streak      ?? '0';
      document.getElementById('public-stat-hl-score').textContent      = hlStats?.max_score       ?? '0';

      loading.style.display = 'none';
      content.style.display = 'block';
    } else {
      loading.textContent = '⚠ No se pudo cargar el perfil.';
    }
  } catch (err) {
    console.error('[Ranking] Error al cargar perfil público:', err);
    loading.textContent = '⚠ Error de conexión.';
  }
};
