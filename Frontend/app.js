
/* ─────────────────────────────────────
   DATOS: Grupos (Mundial 2026 — 48 equipos, 12 grupos)
   Se sobreescriben con datos de la API al cargar
───────────────────────────────────── */
window.GROUPS = {
  A:{teams:["México","Sudáfrica","Corea del Sur","Chequia"],matches:[{home:"México",away:"Sudáfrica",hs:"-",as:"-",date:"11 Jun"},{home:"Corea del Sur",away:"Chequia",hs:"-",as:"-",date:"12 Jun"},{home:"México",away:"Corea del Sur",hs:"-",as:"-",date:"16 Jun"},{home:"Sudáfrica",away:"Chequia",hs:"-",as:"-",date:"16 Jun"},{home:"Chequia",away:"México",hs:"-",as:"-",date:"20 Jun"},{home:"Sudáfrica",away:"Corea del Sur",hs:"-",as:"-",date:"20 Jun"}]},
  B:{teams:["Canadá","Suiza","Qatar","Bosnia-Herzegovina"],matches:[{home:"Canadá",away:"Suiza",hs:"-",as:"-",date:"12 Jun"},{home:"Qatar",away:"Bosnia-Herzegovina",hs:"-",as:"-",date:"12 Jun"},{home:"Canadá",away:"Qatar",hs:"-",as:"-",date:"17 Jun"},{home:"Suiza",away:"Bosnia-Herzegovina",hs:"-",as:"-",date:"17 Jun"},{home:"Bosnia-Herzegovina",away:"Canadá",hs:"-",as:"-",date:"21 Jun"},{home:"Suiza",away:"Qatar",hs:"-",as:"-",date:"21 Jun"}]},
  C:{teams:["Brasil","Marruecos","Escocia","Haití"],matches:[{home:"Brasil",away:"Marruecos",hs:"-",as:"-",date:"13 Jun"},{home:"Escocia",away:"Haití",hs:"-",as:"-",date:"13 Jun"},{home:"Brasil",away:"Escocia",hs:"-",as:"-",date:"17 Jun"},{home:"Marruecos",away:"Haití",hs:"-",as:"-",date:"17 Jun"},{home:"Haití",away:"Brasil",hs:"-",as:"-",date:"21 Jun"},{home:"Marruecos",away:"Escocia",hs:"-",as:"-",date:"21 Jun"}]},
  D:{teams:["EEUU","Paraguay","Australia","Turquía"],matches:[{home:"EEUU",away:"Paraguay",hs:"-",as:"-",date:"13 Jun"},{home:"Australia",away:"Turquía",hs:"-",as:"-",date:"13 Jun"},{home:"EEUU",away:"Australia",hs:"-",as:"-",date:"18 Jun"},{home:"Paraguay",away:"Turquía",hs:"-",as:"-",date:"18 Jun"},{home:"Turquía",away:"EEUU",hs:"-",as:"-",date:"22 Jun"},{home:"Paraguay",away:"Australia",hs:"-",as:"-",date:"22 Jun"}]},
  E:{teams:["Alemania","Ecuador","Costa de Marfil","Curazao"],matches:[{home:"Alemania",away:"Ecuador",hs:"-",as:"-",date:"14 Jun"},{home:"Costa de Marfil",away:"Curazao",hs:"-",as:"-",date:"14 Jun"},{home:"Alemania",away:"Costa de Marfil",hs:"-",as:"-",date:"18 Jun"},{home:"Ecuador",away:"Curazao",hs:"-",as:"-",date:"18 Jun"},{home:"Curazao",away:"Alemania",hs:"-",as:"-",date:"22 Jun"},{home:"Ecuador",away:"Costa de Marfil",hs:"-",as:"-",date:"22 Jun"}]},
  F:{teams:["Países Bajos","Japón","Túnez","Suecia"],matches:[{home:"Países Bajos",away:"Japón",hs:"-",as:"-",date:"14 Jun"},{home:"Túnez",away:"Suecia",hs:"-",as:"-",date:"14 Jun"},{home:"Países Bajos",away:"Túnez",hs:"-",as:"-",date:"19 Jun"},{home:"Japón",away:"Suecia",hs:"-",as:"-",date:"19 Jun"},{home:"Suecia",away:"Países Bajos",hs:"-",as:"-",date:"23 Jun"},{home:"Japón",away:"Túnez",hs:"-",as:"-",date:"23 Jun"}]},
  G:{teams:["Bélgica","Irán","Egipto","Nueva Zelanda"],matches:[{home:"Bélgica",away:"Irán",hs:"-",as:"-",date:"15 Jun"},{home:"Egipto",away:"Nueva Zelanda",hs:"-",as:"-",date:"15 Jun"},{home:"Bélgica",away:"Egipto",hs:"-",as:"-",date:"19 Jun"},{home:"Irán",away:"Nueva Zelanda",hs:"-",as:"-",date:"19 Jun"},{home:"Nueva Zelanda",away:"Bélgica",hs:"-",as:"-",date:"23 Jun"},{home:"Irán",away:"Egipto",hs:"-",as:"-",date:"23 Jun"}]},
  H:{teams:["España","Uruguay","Arabia Saudita","Cabo Verde"],matches:[{home:"España",away:"Uruguay",hs:"-",as:"-",date:"15 Jun"},{home:"Arabia Saudita",away:"Cabo Verde",hs:"-",as:"-",date:"15 Jun"},{home:"España",away:"Arabia Saudita",hs:"-",as:"-",date:"20 Jun"},{home:"Uruguay",away:"Cabo Verde",hs:"-",as:"-",date:"20 Jun"},{home:"Cabo Verde",away:"España",hs:"-",as:"-",date:"24 Jun"},{home:"Uruguay",away:"Arabia Saudita",hs:"-",as:"-",date:"24 Jun"}]},
  I:{teams:["Francia","Senegal","Noruega","Irak"],matches:[{home:"Francia",away:"Senegal",hs:"-",as:"-",date:"16 Jun"},{home:"Noruega",away:"Irak",hs:"-",as:"-",date:"16 Jun"},{home:"Francia",away:"Noruega",hs:"-",as:"-",date:"20 Jun"},{home:"Senegal",away:"Irak",hs:"-",as:"-",date:"20 Jun"},{home:"Irak",away:"Francia",hs:"-",as:"-",date:"24 Jun"},{home:"Senegal",away:"Noruega",hs:"-",as:"-",date:"24 Jun"}]},
  J:{teams:["Argentina","Argelia","Austria","Jordania"],matches:[{home:"Argentina",away:"Argelia",hs:"-",as:"-",date:"16 Jun"},{home:"Austria",away:"Jordania",hs:"-",as:"-",date:"16 Jun"},{home:"Argentina",away:"Austria",hs:"-",as:"-",date:"21 Jun"},{home:"Argelia",away:"Jordania",hs:"-",as:"-",date:"21 Jun"},{home:"Jordania",away:"Argentina",hs:"-",as:"-",date:"25 Jun"},{home:"Argelia",away:"Austria",hs:"-",as:"-",date:"25 Jun"}]},
  K:{teams:["Portugal","Colombia","Uzbekistán","R.D. Congo"],matches:[{home:"Portugal",away:"Colombia",hs:"-",as:"-",date:"17 Jun"},{home:"Uzbekistán",away:"R.D. Congo",hs:"-",as:"-",date:"17 Jun"},{home:"Portugal",away:"Uzbekistán",hs:"-",as:"-",date:"21 Jun"},{home:"Colombia",away:"R.D. Congo",hs:"-",as:"-",date:"21 Jun"},{home:"R.D. Congo",away:"Portugal",hs:"-",as:"-",date:"25 Jun"},{home:"Colombia",away:"Uzbekistán",hs:"-",as:"-",date:"25 Jun"}]},
  L:{teams:["Inglaterra","Croacia","Ghana","Panamá"],matches:[{home:"Inglaterra",away:"Croacia",hs:"-",as:"-",date:"17 Jun"},{home:"Ghana",away:"Panamá",hs:"-",as:"-",date:"17 Jun"},{home:"Inglaterra",away:"Ghana",hs:"-",as:"-",date:"22 Jun"},{home:"Croacia",away:"Panamá",hs:"-",as:"-",date:"22 Jun"},{home:"Panamá",away:"Inglaterra",hs:"-",as:"-",date:"26 Jun"},{home:"Croacia",away:"Ghana",hs:"-",as:"-",date:"26 Jun"}]},
};

/* ─────────────────────────────────────
   DATOS: Goleadores
───────────────────────────────────── */
window.SCORERS = [];
// Se llenan desde /api/scorers cuando el torneo esté en curso

/* ─────────────────────────────────────
   DATOS: Tarjetas
───────────────────────────────────── */
window.CARDS = [];
// Se llenan desde la API cuando el torneo esté en curso

/* ─────────────────────────────────────
   DATOS: Historial de Mundiales
───────────────────────────────────── */
window.EDITIONS = [];

/* ─────────────────────────────────────
   TICKER: construir y duplicar para loop infinito
───────────────────────────────────── */
function buildTicker(matches = []) {
  const track = document.getElementById('tickerTrack');
  
  let items = [];
  
  if (matches.length > 0) {
    items = matches.map(m => {
      const isLive = m.estado === 'en_curso';
      const minText = isLive ? `${m.minuto}'` : (m.date || '');
      const hg = m.goles_local !== null && m.goles_local !== undefined ? m.goles_local : '-';
      const ag = m.goles_visitante !== null && m.goles_visitante !== undefined ? m.goles_visitante : '-';
      const grpText = m.grupo ? m.grupo.replace('GROUP_', 'GRP ') : '';
      
      return `<div class="ticker-item">${isLive ? '<span class="t-dot"></span>' : ''}<span class="t-min">${minText}</span><span class="t-team">${m.equipo_local || m.home}</span><span class="t-score">${hg} — ${ag}</span><span class="t-team">${m.equipo_visitante || m.away}</span><span class="t-grp">${grpText}</span></div>`;
    });
  } else {
    items = [
      `<div class="ticker-item"><span class="t-info">MUNDIAL 2026 &nbsp;·&nbsp; TODO FÚTBOL</span></div>`,
      `<div class="ticker-item"><span class="t-info">ESPERANDO PARTIDOS...</span></div>`
    ];
  }
  
  const html = items.join('');
  track.innerHTML = html + html;
}
buildTicker();

/* ─────────────────────────────────────
   TABS: mostrar/ocultar paneles
───────────────────────────────────── */
function switchTab(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
  
  if (id === 'groups') {
    // 🛑 EL ARREGLO: Buscamos el primer grupo que exista en la base de datos en vez de forzar la 'A'
    const primerGrupo = Object.keys(window.GROUPS).sort()[0];
    if (primerGrupo) renderGroups(primerGrupo);
  }
  if (id === 'fixtures') renderFixtures();
  if (id === 'scorers') renderScorers();
  if (id === 'cards')   renderCards();
  if (id === 'history') renderHistory();
  if (id === 'noticias') {
    window.cargarNoticias(document.getElementById('filtro-noticias')?.value || '');
  }
  if (id === 'tienda') {
    window.cargarProductos(document.getElementById('filtro-tienda')?.value || '');
  }
}

/* ─────────────────────────────────────
   GRUPOS: calcular posiciones
───────────────────────────────────── */
function computeStandings(key) {
  const g = window.GROUPS[key];
  const s = {};
  g.teams.forEach(t => s[t] = {p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0});
  
  g.matches.forEach(m => {
    // 🛑 EL ARREGLO: Solo calculamos puntos si hay números (si no hay guiones)
    if (m.hs !== '-' && m.as !== '-') {
      s[m.home].p++; s[m.away].p++;
      s[m.home].gf += m.hs; s[m.home].ga += m.as;
      s[m.away].gf += m.as; s[m.away].ga += m.hs;
      if (m.hs > m.as) { s[m.home].w++; s[m.away].l++; s[m.home].pts+=3; }
      else if (m.hs < m.as) { s[m.away].w++; s[m.home].l++; s[m.away].pts+=3; }
      else { s[m.home].d++; s[m.away].d++; s[m.home].pts++; s[m.away].pts++; }
    }
  });
  return Object.entries(s).sort((a,b) => b[1].pts-a[1].pts || (b[1].gf-b[1].ga)-(a[1].gf-a[1].ga));
}

function renderGroups(key) {
  const sel = document.getElementById('grpSelector');
  const sortedKeys = Object.keys(GROUPS).sort();
  sel.innerHTML = sortedKeys.map(g =>
    `<button class="grp-btn ${g===key?'active':''}" onclick="renderGroups('${g}')">Grupo ${g}</button>`
  ).join('');

  const standings = computeStandings(key);
  const gData = GROUPS[key];

  const standHtml = `
    <div>
      <p class="section-label">Tabla — Grupo ${key}</p>
      <div class="tbl">
        <div class="tbl-head">
          <span>#</span><span>EQUIPO</span>
          <span class="cc">PJ</span><span class="cc">G</span>
          <span class="cc">E</span><span class="cc">P</span>
          <span class="cc">DG</span><span class="cc">PTS</span>
        </div>
        ${standings.map(([team,s],i) => {
          const dg = s.gf - s.ga;
          return `<div class="tbl-row ${i<2?'qualify':''}">
            <span style="font-weight:900;color:${i<2?'var(--red)':'var(--text4)'}">${i+1}</span>
            <span style="font-weight:700;color:var(--text2);cursor:pointer;" onclick="abrirPerfilEquipo('${team}')" title="Ver perfil de ${team}">${team}</span>
            <span class="cc" style="color:var(--text3)">${s.p}</span>
            <span class="cc" style="color:var(--text3)">${s.w}</span>
            <span class="cc" style="color:var(--text3)">${s.d}</span>
            <span class="cc" style="color:var(--text3)">${s.l}</span>
            <span class="cc ${dg>0?'dg-pos':dg<0?'dg-neg':'dg-zer'}">${dg>0?'+':''}${dg}</span>
            <span class="pts-big">${s.pts}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;

  const matchHtml = `
    <div>
      <p class="section-label">Partidos — Grupo ${key}</p>
      ${gData.matches.map(m => `
        <div class="gmatch">
          <span class="gm-date">${m.date}</span>
          <div class="gm-teams">
            <span class="gm-home">${m.home}</span>
            <span class="gm-score">${m.hs}–${m.as}</span>
            <span class="gm-away">${m.away}</span>
          </div>
          <span class="gm-ft">FT</span>
        </div>`).join('')}
    </div>`;

  document.getElementById('grpContent').innerHTML = standHtml + matchHtml;
}

/* ─────────────────────────────────────
   FIXTURE
───────────────────────────────────── */
function renderFixtures() {
  const sortedEntries = Object.entries(GROUPS).sort((a,b) => a[0].localeCompare(b[0]));
  document.getElementById('fixtureContent').innerHTML = sortedEntries.map(([key,g]) => `
    <div class="fix-card">
      <div class="fix-hdr">
        <span class="fix-grp-name">GRUPO ${key}</span>
        <span class="fix-grp-teams">${g.teams.join(' · ')}</span>
      </div>
      ${g.matches.map(m => `
        <div class="fix-match" ${m.id ? `onclick="abrirDetallePartido(${m.id})" style="cursor:pointer"` : ''}>
          <span class="fix-date">${m.date}</span>
          <div class="fix-teams">
            <span class="fix-home">${m.home}</span>
            <span class="fix-score">${m.hs}–${m.as}</span>
            <span class="fix-away">${m.away}</span>
          </div>
          <span class="fix-ft">${m.estado === 'finalizado' ? 'FT' : m.estado === 'en_curso' ? '🔴' : '—'}</span>
        </div>`).join('')}
    </div>`).join('');
}

/* ─────────────────────────────────────
   GOLEADORES
───────────────────────────────────── */
function renderScorers() {
  const container = document.getElementById('scorersBody');
  if (!container) return;
  if (!SCORERS || SCORERS.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text4)">Sin datos de goleadores aún.</div>';
    return;
  }
  const max = SCORERS[0].goals || 1;
  const colors = ['var(--gold)','var(--silver)','var(--bronze)','var(--text4)','var(--text4)','var(--text4)','var(--text4)','var(--text4)'];
  container.innerHTML = SCORERS.map((s,i) => `
    <div class="sc-row">
      <span class="sc-rank" style="color:${colors[i] || 'var(--text4)'}">${i+1}</span>
      <span class="sc-flag">${s.flag || (s.escudo ? `<img src="${s.escudo}" style="width:24px;height:24px;object-fit:contain">` : '🏳️')}</span>
      <div><div class="sc-name">${s.name}</div><div class="sc-team">${s.team}</div></div>
      <span class="sc-team" style="font-size:13px">${s.team}</span>
      <div class="sc-goals-cell">
        <div class="sc-goals-num">${s.goals}</div>
        <div class="sc-bar-wrap"><div class="sc-bar" style="width:${Math.round(s.goals/max*100)}%"></div></div>
      </div>
      <span class="sc-ast">${s.assists}</span>
    </div>`).join('');
}

/* ─────────────────────────────────────
   TARJETAS
───────────────────────────────────── */
function renderCards() {
  const containerYellow = document.getElementById('cardsBodyYellow');
  const containerRed = document.getElementById('cardsBodyRed');
  if (!containerYellow || !containerRed) return;
  
  if (!window.CARDS || window.CARDS.length === 0) {
    containerYellow.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text4)">Sin datos aún.</div>';
    containerRed.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text4)">Sin datos aún.</div>';
    return;
  }

  // Filtrar y ordenar
  const yellowCards = [...window.CARDS].filter(c => c.yellow > 0).sort((a,b) => b.yellow - a.yellow);
  const redCards = [...window.CARDS].filter(c => c.red > 0).sort((a,b) => b.red - a.red);

  // Renderizador genérico
  const renderRows = (cardsList, type) => {
    if (cardsList.length === 0) return '<div style="text-align:center;padding:20px;color:var(--text4)">No hay tarjetas registradas</div>';
    return cardsList.map((c,i) => `
      <div class="cd-row" style="grid-template-columns: 36px 36px 1fr 110px;">
        <span class="cd-rank">${i+1}</span>
        <span class="cd-flag">${c.flag || (c.escudo ? `<img src="${c.escudo}" style="width:18px;height:18px;object-fit:contain">` : '🏳️')}</span>
        <div><div class="cd-name">${c.name}</div><div class="cd-team" style="font-size:11px;color:var(--text4)">${c.team}</div></div>
        <div class="cd-cards" style="justify-content:center">${Array(c[type] || 0).fill(`<span class="c${type === 'yellow' ? 'y' : 'r'}"></span>`).join('')}</div>
      </div>`).join('');
  };

  containerYellow.innerHTML = renderRows(yellowCards, 'yellow');
  containerRed.innerHTML = renderRows(redCards, 'red');
}

/* ─────────────────────────────────────
   HISTORIAL: render ediciones
───────────────────────────────────── */
function renderHistory() {
  const sel = document.getElementById('editionSelector');
  const cards = document.getElementById('editionCards');

  if (!window.EDITIONS || window.EDITIONS.length === 0) {
    sel.innerHTML = '';
    cards.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text4)">Cargando archivo histórico...</div>';
    return;
  }

  try {
    // Ordenamos de más reciente a más antiguo
    window.EDITIONS.sort((a,b) => b.year - a.year);
    const selectedYear = window.EDITIONS[0].year;

    sel.innerHTML = window.EDITIONS.map(e =>
      `<button class="ed-btn ${e.year===selectedYear?'active':''}" onclick="showEdition(${e.year})">${e.year}</button>`
    ).join('');

    cards.innerHTML = window.EDITIONS.map(e => {
      // Transformar finalist info si runnersUp existe en lugar del viejo arreglo finalists
      const finalistsHtml = e.runnersUp ? `
      <div class="finalist-row">
        <span class="fn-flag">${e.champFlag}</span>
        <span class="fn-team">${e.champion}</span>
        <span style="font-size:11px;color:var(--text4)">Campeón</span>
      </div>
      <div class="finalist-row">
        <span class="fn-flag">${e.runnersUpFlag}</span>
        <span class="fn-team">${e.runnersUp}</span>
        <span style="font-size:11px;color:var(--text4)">Subcampeón</span>
      </div>
    ` : '';

    return `
    <div class="ed-card ${e.year===selectedYear?'active':''}" id="ed-${e.year}">
      <div class="ed-header">
        <div class="ed-year">${e.year}</div>
        <div class="ed-info-main">
          <div class="ed-host">${e.host}</div>
          <div class="ed-dates">${e.dates}</div>
        </div>
        <div class="ed-champion-block">
          <div class="ed-champion-lbl">CAMPEÓN</div>
          <span class="ed-champion-flag">${e.champFlag}</span>
          <div class="ed-champion-name">${e.champion}</div>
        </div>
      </div>
      
      <!-- Videos Destacados -->
      ${e.videos && e.videos.length > 0 ? `
      <div class="ed-video-section" style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid var(--border3);">
        <div class="ed-section-title" style="margin-bottom: 15px;">▶️ Momentos Destacados</div>
        <div style="display:flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
          ${e.videos.map(v => `
            <div style="flex: 1; min-width: 300px; max-width: 500px; background: var(--navy1); border-radius: 8px; overflow: hidden; border: 1px solid var(--border3); margin-bottom: 15px;">
              ${v.url ? `
              <div style="aspect-ratio: 16/9; background: #000;">
                <iframe data-src="${getYouTubeEmbedUrl(v.url)}" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
              ` : `
              <div style="aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; font-style: italic; color: var(--text4);">Video no disponible</div>
              `}
              <div style="padding: 15px;">
                <h4 style="margin: 0 0 10px 0; color: var(--text1); font-size: 16px;">${v.title}</h4>
                <p style="margin: 0; color: var(--text3); font-size: 14px; line-height: 1.4;">${v.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="ed-body">

        <!-- Columna 1: Goleadores -->
        <div>
          <div class="ed-section-title">Goleadores del torneo</div>
          ${e.scorers.map((s,i) => `
            <div class="hist-scorer-row">
              <span class="hsr-pos">${i+1}</span>
              <span class="hsr-flag">${s.flag}</span>
              <span class="hsr-name">${s.name}</span>
              <span class="hsr-goals">${s.goals}</span>
            </div>`).join('')}
          <div class="ed-section-title" style="margin-top:20px">La Gran Final</div>
          ${finalistsHtml}
        </div>

        <!-- Columna 2: Récords -->
        <div>
          <div class="ed-section-title">Récords y datos</div>
          ${e.records.map(r => `
            <div class="record-item">
              <div class="record-cat">${r.cat}</div>
              <div class="record-val">${r.val}</div>
              <div class="record-desc">${r.desc}</div>
            </div>`).join('')}
        </div>

        <!-- Columna 3: Datos curiosos -->
        <div>
          <div class="ed-section-title">Curiosidades</div>
          ${e.facts.map(f => {
             // El viejo arreglo tenía emojis en los primeros 2 caracteres, ahora no hace falta si no hay emoji
             const hasEmoji = /^[^\w\s]/.test(f.slice(0,2));
             const emoji = hasEmoji ? f.slice(0,2) : '⚽';
             const text = hasEmoji ? f.slice(2) : f;
             return `
            <div class="fact-item">
              <span class="fact-emoji">${emoji}</span>
              <div class="fact-text">${text}</div>
            </div>`;
          }).join('')}
        </div>

      </div>
    </div>`;
    }).join('');

    // Activar los iframes de la primera edición visible
    const firstCard = document.getElementById('ed-' + selectedYear);
    if (firstCard) {
      firstCard.querySelectorAll('iframe[data-src]').forEach(ifr => {
        ifr.src = ifr.getAttribute('data-src');
        ifr.removeAttribute('data-src');
      });
    }

  } catch (error) {
    console.error("Error en renderHistory:", error);
    cards.innerHTML = `<div style="text-align:center;padding:40px;color:var(--red)">Error al renderizar el historial: ${error.message}</div>`;
  }
}

function showEdition(year) {
  // Desactivar todas las tarjetas
  document.querySelectorAll('.ed-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.ed-btn').forEach(b => b.classList.remove('active'));
  
  // Activar la seleccionada
  const targetCard = document.getElementById('ed-' + year);
  if (targetCard) {
    targetCard.classList.add('active');
    // Cargar iframes (Lazy Load) para evitar colapsar los contextos WebGL
    targetCard.querySelectorAll('iframe[data-src]').forEach(ifr => {
      ifr.src = ifr.getAttribute('data-src');
      ifr.removeAttribute('data-src');
    });
  }
  
  if (event && event.target) {
    event.target.classList.add('active');
  }
}

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  } else if (url.includes('embed/')) {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

/* ─────────────────────────────────────
   SIDEBAR: goleadores en vivo
───────────────────────────────────── */
function renderLiveScorers() {
  const container = document.getElementById('liveScorers');
  if (!container) return;
  if (!SCORERS || SCORERS.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:15px;color:var(--text4);font-size:13px">Sin datos aún</div>';
    return;
  }
  const colors = ['var(--gold)','var(--silver)','var(--bronze)','var(--text4)','var(--text4)'];
  container.innerHTML = SCORERS.slice(0,5).map((s,i) => `
    <div class="srow">
      <span class="srow-rank" style="color:${colors[i] || 'var(--text4)'}">${i+1}</span>
      <span class="srow-flag">${s.flag || (s.escudo ? `<img src="${s.escudo}" style="width:18px;height:18px;object-fit:contain">` : '🏳️')}</span>
      <div style="flex:1"><div class="srow-name">${s.name}</div><div class="srow-sub">${s.team}</div></div>
      <div style="text-align:right"><div class="srow-num">${s.goals}</div><div class="srow-unit">GOLES</div></div>
    </div>`).join('');
}

/* ─────────────────────────────────────
   TIEMPO REAL: minutos del partido
───────────────────────────────────── */
const liveMinutes = [{id:'live1-min', min:67, max:90}, {id:'live2-min', min:23, max:90}];
setInterval(() => {
  liveMinutes.forEach(d => {
    if (d.min < d.max) d.min++;
    const el = document.getElementById(d.id);
    if (el) el.textContent = d.min + "'";
  });
}, 5000);



// Funciones Globales para Noticias y Tienda
const API_URL = 'http://localhost:3000/api';

/* ── Utilidad: debounce ── */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 1. Carga los países en los selectores correspondientes
window.cargarFiltrosDinamicos = async function() {
  try {
    // A) Países para el filtro de Noticias (Todos los posibles del Mundial 2026)
    const selectNoticias = document.getElementById('filtro-noticias');
    if (selectNoticias) {
      const paisesMundial = [
        "Alemania", "Arabia Saudita", "Argelia", "Argentina", "Australia", "Bélgica", "Brasil", "Camerún", "Canadá", "Colombia", "Corea del Sur", "Costa Rica", "Costa de Marfil", "Croacia", "Dinamarca", "Ecuador", "Egipto", "Emiratos Árabes Unidos", "España", "Estados Unidos", "Francia", "Gales", "Ghana", "Honduras", "Inglaterra", "Irán", "Italia", "Jamaica", "Japón", "Marruecos", "México", "Nigeria", "Nueva Zelanda", "Países Bajos", "Panamá", "Perú", "Polonia", "Portugal", "Qatar", "Senegal", "Serbia", "Suecia", "Suiza", "Turquía", "Túnez", "Ucrania", "Uruguay", "Venezuela"
      ];
      paisesMundial.forEach(pais => {
        const opt = document.createElement('option');
        opt.value = pais;
        opt.textContent = `📍 ${pais}`;
        selectNoticias.appendChild(opt);
      });
    }

    // B) Países para el filtro de la Tienda (Solo los que tienen productos activos)
    const res = await fetch(`${API_URL}/categorias`);
    const paisesTienda = await res.json();
    const selectTienda = document.getElementById('filtro-tienda');
    
    if (selectTienda && paisesTienda.length > 0) {
      paisesTienda.forEach(pais => {
        const opt = document.createElement('option');
        opt.value = pais;
        opt.textContent = `📍 ${pais}`;
        selectTienda.appendChild(opt);
      });
    }
  } catch (e) { console.error("Error cargando filtros:", e); }
};

// ── Caché simple ──
const noticiasCache = {};
const productosCache = {};

// ── Imagen placeholder (SVG inline, no depende de servicios externos) ──
const PLACEHOLDER_IMG = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#0a2a4a"/><text x="200" y="90" text-anchor="middle" fill="#334466" font-size="48">⚽</text><text x="200" y="130" text-anchor="middle" fill="#445577" font-size="14" font-family="sans-serif">Mundialito 2026</text></svg>')}`;

// Función global para fallback de imágenes con 403 o error de carga
window.imgFallback = function(img) {
  img.onerror = null; // evitar loop infinito
  img.src = PLACEHOLDER_IMG;
};

// ══════════════════════════════════════
// 2. NOTICIAS — función independiente
// ══════════════════════════════════════
window.cargarNoticias = debounce(async function(pais = "") {
  const label = document.getElementById('label-pais-noticias');
  if (label) label.innerText = pais || "Todo el Mundial";

  const grid = document.getElementById('grid-noticias');
  if (!grid) return;

  // Usar caché si ya se cargó
  if (noticiasCache[pais]) {
    grid.innerHTML = noticiasCache[pais];
    return;
  }

  grid.innerHTML = '<p style="color: var(--text3); padding: 20px;">Buscando noticias...</p>';
  try {
    const res = await fetch(`${API_URL}/noticias?pais=${encodeURIComponent(pais)}`);
    const data = await res.json();
    let noticias = Array.isArray(data) ? data : [];

    // Mensaje estático si no hay noticias para ese país
    if (noticias.length === 0) {
      const emptyHtml = `
        <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; background: var(--navy2); border-radius: 8px; border: 1px dashed var(--border4); text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 10px; opacity: 0.8;">📰</div>
          <h3 style="color: var(--white); margin: 0 0 8px 0; font-size: 1.2rem;">Noticias no disponibles</h3>
          <p style="color: var(--text3); font-size: 0.95rem; margin: 0; max-width: 400px;">
            En este momento no hay noticias recientes sobre <strong>${pais || 'el Mundial'}</strong>. ¡Intentá más tarde o buscá otra selección!
          </p>
        </div>
      `;
      noticiasCache[pais] = emptyHtml;
      grid.innerHTML = emptyHtml;
      return;
    }

    const html = noticias.map(n => `
      <div class="card-item">
        <img src="${n.imagen || PLACEHOLDER_IMG}" class="card-img" onerror="window.imgFallback(this)" />
        <div class="card-body">
          <div class="card-title">${n.titulo}</div>
          ${n.fuente ? `<div style="color: var(--text4); font-size: 12px; margin-bottom: 8px;">📰 ${n.fuente}</div>` : ''}
          <a href="${n.link}" target="_blank" class="btn-card">Leer Noticia</a>
        </div>
      </div>
    `).join('');

    noticiasCache[pais] = html;
    grid.innerHTML = html;
  } catch (e) {
    console.error("Error noticias:", e);
    grid.innerHTML = '<p style="color: var(--text3); padding: 20px;">Error al cargar noticias.</p>';
  }
}, 500);

// ══════════════════════════════════════
// 3. PRODUCTOS — función independiente
// ══════════════════════════════════════
window.cargarProductos = debounce(async function(pais = "") {
  const tiendaLabel = document.getElementById('tienda-pais-nombre');
  if (tiendaLabel) tiendaLabel.innerText = pais || "Mundial 2026";

  const grid = document.getElementById('grid-productos');
  if (!grid) return;

  // Usar caché si ya se cargó
  if (productosCache[pais]) {
    grid.innerHTML = productosCache[pais];
    return;
  }

  grid.innerHTML = '<p style="color: var(--text3); padding: 20px;">Buscando productos...</p>';
  try {
    const res = await fetch(`${API_URL}/productos?pais=${encodeURIComponent(pais)}`);
    const productos = await res.json();
    const html = productos.length > 0 ? productos.map(p => `
      <div class="card-item">
        <img src="${p.imagen_url || PLACEHOLDER_IMG}" class="card-img" onerror="window.imgFallback(this)">
        <div class="card-body">
          <div class="card-title">${p.nombre}</div>
          <div style="color: #00ff88; font-size: 1.4rem; font-weight: bold; margin-bottom: 10px;">$${p.precio || 'Consultar'}</div>
          <a href="${p.link_afiliado}" target="_blank" class="btn-card">Comprar</a>
        </div>
      </div>
    `).join('') : '<p style="color: var(--text3); padding: 20px;">No hay productos para esta selección.</p>';

    productosCache[pais] = html;
    grid.innerHTML = html;
  } catch (e) {
    console.error("Error tienda:", e);
    grid.innerHTML = '<p style="color: var(--text3); padding: 20px;">Error al cargar productos.</p>';
  }
}, 500);

// ══════════════════════════════════════
// 4. CARGA DESDE API — fixture, standings, scorers, live
// ══════════════════════════════════════
async function cargarFixtureDesdeAPI() {
  try {
    const res = await fetch(`${API_URL}/fixture`);
    const partidos = await res.json();
    if (!partidos.length) return;

    // Agrupar por grupo para alimentar GROUPS
    const gruposAPI = {};
    partidos.forEach(p => {
      if (!p.grupo) return;
      const letra = p.grupo.replace('GROUP_', '');
      if (!gruposAPI[letra]) gruposAPI[letra] = { teams: [], matches: [] };
      const g = gruposAPI[letra];
      if (p.equipo_local && !g.teams.includes(p.equipo_local_short || p.equipo_local)) {
        g.teams.push(p.equipo_local_short || p.equipo_local);
      }
      if (p.equipo_visitante && !g.teams.includes(p.equipo_visitante_short || p.equipo_visitante)) {
        g.teams.push(p.equipo_visitante_short || p.equipo_visitante);
      }
      const fecha = new Date(p.fecha_utc);
      g.matches.push({
        id: p.id,
        home: p.equipo_local_short || p.equipo_local,
        away: p.equipo_visitante_short || p.equipo_visitante,
        hs: p.goles_local ?? '-', as: p.goles_visitante ?? '-',
        date: fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
        estado: p.estado, estadio: p.estadio,
        fecha_utc: p.fecha_utc,
        escudo_local: p.escudo_local, escudo_visitante: p.escudo_visitante,
      });
    });

    if (Object.keys(gruposAPI).length > 0) {
      window.GROUPS = gruposAPI;
      const primerGrupo = Object.keys(gruposAPI)[0];
      renderGroups(primerGrupo);
      renderFixtures();
      console.log('✅ Fixture cargado desde API:', Object.keys(gruposAPI).length, 'grupos');
    }
  } catch (e) {
    console.warn('⚠️ API fixture no disponible, usando datos estáticos:', e.message);
  }
}

async function cargarScorersDesdeAPI() {
  try {
    const res = await fetch(`${API_URL}/scorers`);
    const data = await res.json();
    if (!data.length) return;
    window.SCORERS = data.map(s => ({
      name: s.nombre, team: s.equipo_short || s.equipo,
      goals: s.goles, assists: s.asistencias, flag: '',
      escudo: s.escudo,
    }));
    renderScorers();
    renderLiveScorers();
    console.log('✅ Goleadores cargados:', data.length);
  } catch (e) { console.warn('⚠️ Goleadores no disponibles:', e.message); }
}

async function cargarCardsDesdeAPI() {
  try {
    const res = await fetch(`${API_URL}/tarjetas`);
    const data = await res.json();
    if (!data.length) return;
    window.CARDS = data.map(c => ({
      name: c.nombre, team: c.equipo_short || c.equipo,
      yellow: c.amarillas, red: c.rojas, flag: '',
      escudo: c.escudo,
    }));
    renderCards();
    console.log('✅ Tarjetas cargadas:', data.length);
  } catch (e) { console.warn('⚠️ Tarjetas no disponibles:', e.message); }
}

async function cargarPartidosEnVivo() {
  try {
    const res = await fetch(`${API_URL}/live`);
    const partidos = await res.json();
    renderLivePanel(partidos);
    
    if (partidos && partidos.length > 0) {
      buildTicker(partidos);
    } else {
      updateTickerWithUpcoming();
    }
  } catch (e) { console.warn('⚠️ Live no disponible:', e.message); }
}

window.updateTickerWithUpcoming = function() {
  if (!window.GROUPS) return;
  const allMatches = [];
  Object.entries(window.GROUPS).forEach(([letra, g]) => {
    g.matches.forEach(m => allMatches.push({...m, grupo: `Grupo ${letra}`}));
  });
  
  const upcoming = allMatches.filter(m => m.estado === 'programado' || m.hs === '-').slice(0, 5);
  
  if (upcoming.length > 0) {
    const formatted = upcoming.map(m => ({
      ...m,
      equipo_local: m.home,
      equipo_visitante: m.away,
      goles_local: m.hs,
      goles_visitante: m.as,
      estado: 'programado'
    }));
    buildTicker(formatted);
  }
}

// ══════════════════════════════════════
// 5. PANEL EN VIVO — dinámico desde API
// ══════════════════════════════════════
function renderLivePanel(partidos) {
  const container = document.getElementById('live-matches-container');
  if (!container) return;

  if (!partidos || partidos.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px;color:var(--text3)">
        <div style="font-size:2.5rem;margin-bottom:10px">⏳</div>
        <div style="font-size:14px">No hay partidos en vivo en este momento</div>
        <div style="font-size:12px;margin-top:5px;color:var(--text4)">El Mundial comienza el 11 de junio de 2026</div>
      </div>`;
    return;
  }

  container.innerHTML = partidos.map(p => `
    <div class="match-live" onclick="abrirDetallePartido(${p.id})" style="cursor:pointer">
      <div class="team-block home">
        ${p.escudo_local ? `<img src="${p.escudo_local}" style="width:28px;height:28px;margin-bottom:4px" onerror="this.style.display='none'">` : ''}
        <div class="team-name">${p.equipo_local}</div>
      </div>
      <div class="score-block">
        <div class="score-main">${p.goles_local}<span class="score-sep">–</span>${p.goles_visitante}</div>
        <div class="min-badge"><span class="min-dot"></span><span class="min-text">${p.minuto}'</span></div>
      </div>
      <div class="team-block away">
        ${p.escudo_visitante ? `<img src="${p.escudo_visitante}" style="width:28px;height:28px;margin-bottom:4px" onerror="this.style.display='none'">` : ''}
        <div class="team-name">${p.equipo_visitante}</div>
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════
// 6. MODAL DETALLE DE PARTIDO
// ══════════════════════════════════════
window.abrirDetallePartido = async function(matchId) {
  const modal = document.getElementById('match-detail-modal');
  const content = document.getElementById('match-detail-content');
  if (!modal || !content) return;

  content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">Cargando partido...</div>';
  modal.classList.add('active');

  try {
    const res = await fetch(`${API_URL}/fixture/${matchId}`);
    const p = await res.json();
    const fecha = new Date(p.fecha_utc);
    const fechaLocal = fecha.toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const horaLocal = fecha.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' });
    const estadoTexto = { programado:'Programado', en_curso:'En Vivo', finalizado:'Finalizado', suspendido:'Suspendido' };

    content.innerHTML = `
      <div class="md-header">
        <div class="md-comp">${p.competicion || 'Mundial 2026'} ${p.grupo ? '· ' + p.grupo.replace('GROUP_','Grupo ') : ''}</div>
        <div class="md-status md-status--${p.estado}">${estadoTexto[p.estado] || p.estado}</div>
      </div>
      <div class="md-teams">
        <div class="md-team">
          ${p.escudo_local ? `<img src="${p.escudo_local}" class="md-escudo" onerror="this.style.display='none'">` : ''}
          <div class="md-team-name">${p.equipo_local}</div>
        </div>
        <div class="md-score">
          <div class="md-score-num">${p.goles_local ?? '-'} – ${p.goles_visitante ?? '-'}</div>
        </div>
        <div class="md-team">
          ${p.escudo_visitante ? `<img src="${p.escudo_visitante}" class="md-escudo" onerror="this.style.display='none'">` : ''}
          <div class="md-team-name">${p.equipo_visitante}</div>
        </div>
      </div>
      <div class="md-info-grid">
        <div class="md-info-item"><span class="md-info-icon">📅</span><span>${fechaLocal}</span></div>
        <div class="md-info-item"><span class="md-info-icon">🕐</span><span>${horaLocal} (hora local)</span></div>
        ${p.estadio ? `<div class="md-info-item"><span class="md-info-icon">🏟️</span><span>${p.estadio}</span></div>` : ''}
        ${p.arbitro ? `<div class="md-info-item"><span class="md-info-icon">🟨</span><span>Árbitro: ${p.arbitro}</span></div>` : ''}
        ${p.fase ? `<div class="md-info-item"><span class="md-info-icon">📋</span><span>Fase: ${p.fase.replace(/_/g,' ')}</span></div>` : ''}
      </div>`;

    let golesHtml = `
      <div style="margin-top:20px; padding: 15px; background: var(--navy1); border-radius: 8px; border: 1px solid var(--border2);">
        <h4 style="margin: 0 0 10px 0; color: var(--text1); font-size: 15px; text-align: center;">⚽ Goles</h4>
        <div style="display:flex; flex-direction:column; gap:8px;">`;

    if (p.goles_detalle && p.goles_detalle.length > 0) {
      golesHtml += p.goles_detalle.map(g => {
        return `<div style="display:flex; justify-content: space-between; font-size: 14px;">
          <span style="color: var(--text2)">${g.minute}'</span>
          <span style="color: var(--gold); font-weight: bold;">${g.scorer?.name || 'Desconocido'}</span>
          <span style="color: var(--text3); font-size: 12px;">(${g.team?.name || ''})</span>
        </div>`;
      }).join('');
    } else {
      golesHtml += `<div style="text-align:center; color: var(--text4); font-size: 13px;">No hay detalles de goles disponibles.</div>`;
    }
    golesHtml += `</div></div>`;

    content.innerHTML += golesHtml;

    const st = p.estadisticas || {};
    const statsHtml = `
      <div style="margin-top:20px; padding: 15px; background: var(--navy1); border-radius: 8px; border: 1px solid var(--border2);">
        <h4 style="margin: 0 0 15px 0; color: var(--text1); font-size: 15px; text-align: center;">📊 Estadísticas</h4>
        
        <div style="display:flex; flex-direction:column; gap:12px; font-size: 14px;">
          <div style="display:flex; justify-content: space-between; align-items: center;">
            <span style="width: 30px; text-align: right; color: var(--gold); font-weight: bold;">${st.posesion_local ?? 0}%</span>
            <span style="color: var(--text3); font-size: 12px; text-transform: uppercase;">Posesión</span>
            <span style="width: 30px; text-align: left; color: var(--gold); font-weight: bold;">${st.posesion_visitante ?? 0}%</span>
          </div>
          
          <div style="display:flex; justify-content: space-between; align-items: center;">
            <span style="width: 30px; text-align: right; font-weight: bold;">${st.tiros_local ?? 0}</span>
            <span style="color: var(--text3); font-size: 12px; text-transform: uppercase;">Tiros Totales</span>
            <span style="width: 30px; text-align: left; font-weight: bold;">${st.tiros_visitante ?? 0}</span>
          </div>
          
          <div style="display:flex; justify-content: space-between; align-items: center;">
            <span style="width: 30px; text-align: right; font-weight: bold;">${st.tiros_al_arco_local ?? 0}</span>
            <span style="color: var(--text3); font-size: 12px; text-transform: uppercase;">Tiros al Arco</span>
            <span style="width: 30px; text-align: left; font-weight: bold;">${st.tiros_al_arco_visit ?? 0}</span>
          </div>
          
          <div style="display:flex; justify-content: space-between; align-items: center;">
            <span style="width: 30px; text-align: right; font-weight: bold;">${st.corners_local ?? 0}</span>
            <span style="color: var(--text3); font-size: 12px; text-transform: uppercase;">Córners</span>
            <span style="width: 30px; text-align: left; font-weight: bold;">${st.corners_visitante ?? 0}</span>
          </div>
          
          <div style="display:flex; justify-content: space-between; align-items: center;">
            <span style="width: 30px; text-align: right; font-weight: bold;">${st.faltas_local ?? 0}</span>
            <span style="color: var(--text3); font-size: 12px; text-transform: uppercase;">Faltas</span>
            <span style="width: 30px; text-align: left; font-weight: bold;">${st.faltas_visitante ?? 0}</span>
          </div>
          
          <div style="display:flex; justify-content: space-between; align-items: center;">
            <span style="width: 30px; text-align: right; color: #ffcc00; font-weight: bold;">${st.amarillas_local ?? 0} 🟨</span>
            <span style="color: var(--text3); font-size: 12px; text-transform: uppercase;">Tarjetas Amarillas</span>
            <span style="width: 30px; text-align: left; color: #ffcc00; font-weight: bold;">🟨 ${st.amarillas_visitante ?? 0}</span>
          </div>
        </div>
      </div>`;
    content.innerHTML += statsHtml;

    content.innerHTML += `
      <div style="margin-top:25px;">
        <h4 style="margin: 0 0 15px 0; color: var(--text1); font-size: 16px;">🛒 Productos Relacionados</h4>
        <div id="md-productos-grid" class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
          <p style="color: var(--text3); padding: 10px;">Buscando productos...</p>
        </div>
      </div>
    `;

    try {
      const resLocal = await fetch(`${API_URL}/productos?pais=${encodeURIComponent(p.equipo_local)}`);
      const resVisitante = await fetch(`${API_URL}/productos?pais=${encodeURIComponent(p.equipo_visitante)}`);
      const prodLocal = await resLocal.json();
      const prodVisitante = await resVisitante.json();
      
      const todosProductos = [...prodLocal, ...prodVisitante];
      const prodContainer = document.getElementById('md-productos-grid');
      
      if (todosProductos.length > 0) {
        prodContainer.innerHTML = todosProductos.slice(0,4).map(prod => `
          <div class="card-item" style="min-height: auto;">
            <img src="${prod.imagen_url || PLACEHOLDER_IMG}" class="card-img" style="height:120px;" onerror="window.imgFallback(this)">
            <div class="card-body" style="padding: 10px;">
              <div class="card-title" style="font-size:13px;">${prod.nombre}</div>
              <div style="color: #00ff88; font-size: 1.1rem; font-weight: bold; margin-bottom: 8px;">$${prod.precio || 'Consultar'}</div>
              <a href="${prod.link_afiliado}" target="_blank" class="btn-card" style="padding: 6px; font-size:12px;">Comprar</a>
            </div>
          </div>
        `).join('');
      } else {
        prodContainer.innerHTML = '<p style="color: var(--text4); font-size: 13px; grid-column: 1 / -1;">No hay productos disponibles para estos equipos en este momento.</p>';
      }
    } catch (e) {
      document.getElementById('md-productos-grid').innerHTML = '<p style="color: var(--red); font-size: 13px; grid-column: 1 / -1;">Error cargando productos.</p>';
    }

  } catch (e) {
    content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red)">Error al cargar el partido</div>';
  }
};

window.cerrarDetallePartido = function() {
  document.getElementById('match-detail-modal')?.classList.remove('active');
};

// ══════════════════════════════════════
// MODAL PERFIL DE EQUIPO
// ══════════════════════════════════════
window.abrirPerfilEquipo = async function(teamName) {
  let modal = document.getElementById('team-profile-modal');
  let content = document.getElementById('team-profile-content');
  
  if (!modal) {
    // Crear el modal si no existe en el DOM
    modal = document.createElement('div');
    modal.id = 'team-profile-modal';
    modal.className = 'modal-overlay';
    modal.onclick = function(e) { if(e.target===this) window.cerrarPerfilEquipo(); };
    
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 800px;">
        <button class="modal-close" onclick="window.cerrarPerfilEquipo()">✕</button>
        <div id="team-profile-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
    content = document.getElementById('team-profile-content');
  }

  content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">Cargando perfil de '+teamName+'...</div>';
  modal.classList.add('active');

  try {
    const res = await fetch(`${API_URL}/equipo/${encodeURIComponent(teamName)}`);
    if (!res.ok) throw new Error('No se encontró el equipo');
    const data = await res.json();
    
    const team = data.info;
    const next = data.next_matches || [];
    const last = data.last_matches || [];
    const squad = data.squad || [];

    // Próximos partidos: Extraer del fixture local (para mantener actualizaciones en vivo del Mundial)
    const localNext = [];
    if (window.GROUPS) {
      Object.values(window.GROUPS).forEach(g => {
        g.matches.forEach(m => {
          if ((m.home === teamName || m.away === teamName) && m.estado !== 'finalizado') {
            localNext.push(m);
          }
        });
      });
    }

    const renderLocalMatch = (m) => {
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--navy3); border:1px solid var(--border); border-radius:6px; margin-bottom:8px; font-size:13px; cursor:pointer;" onclick="window.abrirDetallePartido('${m.id}')">
          <div style="flex:1;">${m.date}</div>
          <div style="flex:3; text-align:center; font-weight:bold;">
            ${m.home} ${m.hs} – ${m.as} ${m.away}
          </div>
          <div style="flex:1; text-align:right;">
            <span style="color:var(--gold); font-size:11px;">${m.estado === 'en_curso' ? 'EN VIVO' : 'Prog.'}</span>
          </div>
        </div>
      `;
    };

    // Funciones auxiliares para renderizar partidos pasados (de la API externa)
    const renderMatch = (m) => {
      const isHome = m.teams.home.id === team.id;
      const resultColor = m.fixture.status.short === 'FT' ? 
        (m.teams.home.winner && isHome) || (m.teams.away.winner && !isHome) ? '#00AA5522' : 
        (m.teams.home.winner === false && m.teams.away.winner === false) ? '#FFD70022' : '#D5001C22' 
        : 'var(--navy3)';
      const resultText = m.fixture.status.short === 'FT' ? 
        (m.teams.home.winner && isHome) || (m.teams.away.winner && !isHome) ? '<span style="color:#00DD77">G</span>' : 
        (m.teams.home.winner === false && m.teams.away.winner === false) ? '<span style="color:var(--gold)">E</span>' : '<span style="color:#ff6680">P</span>' 
        : '-';

      const date = new Date(m.fixture.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:${resultColor}; border:1px solid var(--border); border-radius:6px; margin-bottom:8px; font-size:13px;">
          <div style="flex:1;">${date}</div>
          <div style="flex:3; text-align:center; font-weight:bold;">
            ${m.teams.home.name} ${m.goals.home ?? '-'} – ${m.goals.away ?? '-'} ${m.teams.away.name}
          </div>
          <div style="flex:1; text-align:right;">${resultText}</div>
        </div>
      `;
    };

    // Agrupar plantel por posición
    const squadByPos = { 'Goalkeeper': [], 'Defender': [], 'Midfielder': [], 'Attacker': [] };
    squad.forEach(p => { if (squadByPos[p.position]) squadByPos[p.position].push(p); });

    const renderPlayers = (players, title) => {
      if (players.length === 0) return '';
      return `
        <div style="margin-bottom: 15px;">
          <div style="font-size:12px; font-weight:bold; color:var(--text4); margin-bottom:8px; text-transform:uppercase;">${title}</div>
          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:8px;">
            ${players.map(p => `
              <div style="background:var(--navy3); border:1px solid var(--border); border-radius:6px; padding:8px; display:flex; align-items:center; gap:10px;">
                <img src="${p.photo}" style="width:30px; height:30px; border-radius:50%; object-fit:cover; background:var(--navy2);" onerror="this.style.display='none'">
                <div>
                  <div style="font-size:12px; color:var(--text2); font-weight:bold; line-height:1.2;">${p.name}</div>
                  ${p.age ? `<div style="font-size:10px; color:var(--text4);">${p.age} años</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    };

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px; padding-bottom:15px; border-bottom:1px solid var(--border);">
        <img src="${team.logo}" style="width:60px; height:60px; object-fit:contain;">
        <div>
          <h2 style="margin:0; font-size:24px; color:var(--white);">${team.name}</h2>
          <div style="font-size:13px; color:var(--text3);">${team.country || ''}</div>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
        <!-- Columna Izquierda: Partidos -->
        <div>
          <h3 style="font-size:16px; color:var(--white); margin-bottom:15px;">Partidos Anteriores</h3>
          ${last.length > 0 ? last.map(renderMatch).join('') : '<div style="font-size:13px; color:var(--text4);">No hay resultados recientes.</div>'}
          
          <h3 style="font-size:16px; color:var(--white); margin-top:25px; margin-bottom:15px;">Fixture del Mundial</h3>
          ${localNext.length > 0 ? localNext.map(renderLocalMatch).join('') : '<div style="font-size:13px; color:var(--text4);">No hay partidos pendientes en el fixture.</div>'}
        </div>
        
        <!-- Columna Derecha: Plantel -->
        <div>
          <h3 style="font-size:16px; color:var(--white); margin-bottom:15px;">Plantel ${squad.length > 0 ? '' : '(No confirmado)'}</h3>
          <div style="max-height:400px; overflow-y:auto; padding-right:5px;">
            ${squad.length > 0 ? `
              ${renderPlayers(squadByPos['Goalkeeper'], 'Arqueros')}
              ${renderPlayers(squadByPos['Defender'], 'Defensores')}
              ${renderPlayers(squadByPos['Midfielder'], 'Mediocampistas')}
              ${renderPlayers(squadByPos['Attacker'], 'Delanteros')}
            ` : '<div style="font-size:13px; color:var(--text4); padding:20px; text-align:center; background:var(--navy3); border-radius:8px;">La lista de convocados aún no está disponible para esta selección.</div>'}
          </div>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error(error);
    content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red);">Error al cargar los datos del equipo. Por favor, intenta de nuevo más tarde.</div>';
  }
};

window.cerrarPerfilEquipo = function() {
  document.getElementById('team-profile-modal')?.classList.remove('active');
};

// ══════════════════════════════════════
// INICIALIZACIÓN
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  buildTicker();
  renderGroups('A');
  renderFixtures();
  renderScorers();
  renderCards();

  window.cargarFiltrosDinamicos();
  window.cargarNoticias('');
  window.cargarProductos('');

  // Intentar cargar datos reales desde la API
  await cargarFixtureDesdeAPI();
  await cargarScorersDesdeAPI();
  await cargarCardsDesdeAPI();
  await cargarPartidosEnVivo();

  // 🛑 ELIMINADO: Refrescar partidos en vivo cada 60 segundos (Ahora usamos Supabase Realtime)
  // setInterval(cargarPartidosEnVivo, 60000);
});   

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

  // Procesar el texto para evitar problemas con etiquetas HTML (ej: <think>)
  let textoProcesado = texto || '';
  
  // Remover bloque <think> completo si existe
  textoProcesado = textoProcesado.replace(/<think>[\s\S]*?<\/think>/gi, '');
  // Por si el modelo fue interrumpido por tokens y quedó abierto
  textoProcesado = textoProcesado.replace(/<think>[\s\S]*/gi, '');
  
  textoProcesado = textoProcesado.trim();
  if (!textoProcesado) {
    textoProcesado = "..."; 
  }

  // Convertir saltos de línea y texto bold básico en HTML
  const textoHtml  = textoProcesado
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
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
