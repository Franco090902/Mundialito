export function createRankingWidget(containerId, gameName, title) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isWordle = gameName === 'wordle';
  
  container.innerHTML = `
    <div style="padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px; margin-bottom: 20px;">
      <h3 style="color: var(--gold); text-align: center; margin-bottom: 15px; font-size: 18px;">🏆 Ranking Global de ${title}</h3>
      <div class="perfil-card" style="padding: 0; overflow: hidden; margin-bottom: 15px;">
        <table style="width: 100%; border-collapse: collapse; color: var(--offwhite); font-size: 14px;">
          <thead>
            <tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
              <th style="padding: 10px; width: 50px; text-align: center;">Pos</th>
              <th style="padding: 10px;">Usuario</th>
              ${isWordle
                ? `<th style="padding: 10px; text-align: right;">🔥 Racha actual</th>
                   <th style="padding: 10px; text-align: right;">⭐ Mejor racha</th>`
                : `<th style="padding: 10px; text-align: right;">Récord</th>`}
            </tr>
          </thead>
          <tbody class="ranking-table-body">
            <!-- Filas inyectadas por JS -->
          </tbody>
        </table>
      </div>
      <div style="display: flex; justify-content: center; gap: 10px;">
        <button class="btn-ranking-less btn-token" style="display: none; background: #555; color: white; padding: 5px 10px; font-size: 12px; margin: 0;">Ver menos</button>
        <button class="btn-ranking-more btn-token" style="display: none; padding: 5px 10px; font-size: 12px; margin: 0;">Ver más</button>
      </div>
    </div>
  `;

  let currentOffset = 0;
  const limit = 10;

  const tableBody = container.querySelector('.ranking-table-body');
  const btnMore = container.querySelector('.btn-ranking-more');
  const btnLess = container.querySelector('.btn-ranking-less');

  function updateButtons(total) {
    if (currentOffset + limit < total) {
      btnMore.style.display = 'inline-block';
    } else {
      btnMore.style.display = 'none';
    }

    if (currentOffset > 0) {
      btnLess.style.display = 'inline-block';
    } else {
      btnLess.style.display = 'none';
    }
  }

  async function fetchRanking(append = false) {
    try {
      const res = await fetch(`/api/stats/ranking/${gameName}?limit=${limit}&offset=${currentOffset}`);
      const data = await res.json();
      
      if (!append) {
        tableBody.innerHTML = '';
      }

      if (!data.success) {
        if (!append) {
          tableBody.innerHTML = `<tr><td colspan="${isWordle ? 4 : 3}" style="text-align: center; padding: 20px;">Error al cargar el ranking</td></tr>`;
        }
        return;
      }

      const rows = data.ranking;
      const total = data.total;

      if (rows.length === 0 && !append) {
        tableBody.innerHTML = `<tr><td colspan="${isWordle ? 4 : 3}" style="text-align: center; padding: 20px; color: var(--text3);">No hay resultados para este juego aún.</td></tr>`;
      }

      rows.forEach((row, index) => {
        const pos = currentOffset + index + 1;
        const tr = document.createElement('tr');
        tr.className = 'ranking-row';
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        tr.style.cursor = 'pointer';
        tr.title = 'Ver perfil público';
        tr.onclick = () => window.openPublicProfile(row.user_id);
        
        let posHtml = pos;
        if (pos === 1) posHtml = '🥇';
        else if (pos === 2) posHtml = '🥈';
        else if (pos === 3) posHtml = '🥉';

        const valueCell = isWordle
          ? `<td style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px; color: var(--gold);">${row.current_streak}</td>
             <td style="padding: 10px; text-align: right; font-size: 13px; color: var(--offwhite);">${row.max_streak}</td>`
          : `<td style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">${row.max_score}</td>`;

        tr.innerHTML = `
          <td style="padding: 10px; text-align: center; font-weight: bold; color: var(--gold);">${posHtml}</td>
          <td style="padding: 10px; display: flex; align-items: center; gap: 8px;">
            <img src="${row.profiles?.avatar_url || ''}" onerror="this.src=''; this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--accent-color, #ffd700); color: black; display: none; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">${(row.profiles?.username || 'U')[0].toUpperCase()}</div>
            <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.2);">${row.profiles?.username || 'Anónimo'}</span>
          </td>
          ${valueCell}
        `;
        tableBody.appendChild(tr);
      });

      updateButtons(total);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    }
  }

  btnMore.addEventListener('click', () => {
    currentOffset += limit;
    fetchRanking(true);
  });

  btnLess.addEventListener('click', () => {
    if (currentOffset >= limit) {
      const rows = tableBody.querySelectorAll('tr.ranking-row');
      const toRemove = rows.length - currentOffset; 
      if (toRemove > 0) {
        for (let i = 0; i < toRemove; i++) {
          tableBody.removeChild(tableBody.lastChild);
        }
      }
      currentOffset -= limit;
      updateButtons(currentOffset + limit + 1);
    }
  });

  fetchRanking(false);
}

document.addEventListener('DOMContentLoaded', () => {
  createRankingWidget('wordle-ranking-container', 'wordle', 'Wordle');
  createRankingWidget('higherlower-ranking-container', 'higherlower', 'Higher/Lower');
});

window.openPublicProfile = async function(userId) {
  if (!userId) return;
  const overlay = document.getElementById('public-profile-overlay');
  const loading = document.getElementById('public-profile-loading');
  const content = document.getElementById('public-profile-content');
  if (!overlay || !loading || !content) return;

  overlay.classList.remove('hidden');
  loading.style.display = 'block';
  content.style.display = 'none';

  try {
    const res = await fetch(`/api/users/${userId}/profile`);
    const data = await res.json();

    if (data.success && data.profile) {
      const p = data.profile;
      document.getElementById('public-profile-username').textContent = p.username || 'Anónimo';
      
      const avatarImg = document.getElementById('public-profile-avatar');
      const avatarFb = document.getElementById('public-profile-avatar-fallback');
      
      if (p.avatar_url) {
        avatarImg.src = p.avatar_url;
        avatarImg.style.display = 'block';
        avatarFb.style.display = 'none';
      } else {
        avatarImg.style.display = 'none';
        avatarFb.style.display = 'flex';
        avatarFb.textContent = (p.username || 'U')[0].toUpperCase();
      }

      const stats = data.game_stats || [];
      const wordleStats = stats.find(g => g.game_name === 'wordle');
      const hlStats = stats.find(g => g.game_name === 'higherlower');

      document.getElementById('public-stat-wordle-streak').textContent = wordleStats ? wordleStats.max_streak : '0';
      document.getElementById('public-stat-wordle-score').textContent = wordleStats ? wordleStats.max_score : '0';
      
      document.getElementById('public-stat-hl-streak').textContent = hlStats ? hlStats.max_streak : '0';
      document.getElementById('public-stat-hl-score').textContent = hlStats ? hlStats.max_score : '0';

      loading.style.display = 'none';
      content.style.display = 'block';
    } else {
      loading.textContent = 'Error al cargar el perfil.';
    }
  } catch (err) {
    console.error('Error fetching public profile:', err);
    loading.textContent = 'Error de conexión.';
  }
};

