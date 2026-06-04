
/* ─────────────────────────────────────
   DATOS: Grupos (Mundial 2026 — 48 equipos, 12 grupos)
   Se sobreescriben con datos de la API al cargar
───────────────────────────────────── */
window.GROUPS = {
  A: { teams: ["México", "Sudáfrica", "Corea del Sur", "Chequia"], matches: [{ home: "México", away: "Sudáfrica", hs: "-", as: "-", date: "11 Jun" }, { home: "Corea del Sur", away: "Chequia", hs: "-", as: "-", date: "12 Jun" }, { home: "México", away: "Corea del Sur", hs: "-", as: "-", date: "16 Jun" }, { home: "Sudáfrica", away: "Chequia", hs: "-", as: "-", date: "16 Jun" }, { home: "Chequia", away: "México", hs: "-", as: "-", date: "20 Jun" }, { home: "Sudáfrica", away: "Corea del Sur", hs: "-", as: "-", date: "20 Jun" }] },
  B: { teams: ["Canadá", "Suiza", "Qatar", "Bosnia-Herzegovina"], matches: [{ home: "Canadá", away: "Suiza", hs: "-", as: "-", date: "12 Jun" }, { home: "Qatar", away: "Bosnia-Herzegovina", hs: "-", as: "-", date: "12 Jun" }, { home: "Canadá", away: "Qatar", hs: "-", as: "-", date: "17 Jun" }, { home: "Suiza", away: "Bosnia-Herzegovina", hs: "-", as: "-", date: "17 Jun" }, { home: "Bosnia-Herzegovina", away: "Canadá", hs: "-", as: "-", date: "21 Jun" }, { home: "Suiza", away: "Qatar", hs: "-", as: "-", date: "21 Jun" }] },
  C: { teams: ["Brasil", "Marruecos", "Escocia", "Haití"], matches: [{ home: "Brasil", away: "Marruecos", hs: "-", as: "-", date: "13 Jun" }, { home: "Escocia", away: "Haití", hs: "-", as: "-", date: "13 Jun" }, { home: "Brasil", away: "Escocia", hs: "-", as: "-", date: "17 Jun" }, { home: "Marruecos", away: "Haití", hs: "-", as: "-", date: "17 Jun" }, { home: "Haití", away: "Brasil", hs: "-", as: "-", date: "21 Jun" }, { home: "Marruecos", away: "Escocia", hs: "-", as: "-", date: "21 Jun" }] },
  D: { teams: ["EEUU", "Paraguay", "Australia", "Turquía"], matches: [{ home: "EEUU", away: "Paraguay", hs: "-", as: "-", date: "13 Jun" }, { home: "Australia", away: "Turquía", hs: "-", as: "-", date: "13 Jun" }, { home: "EEUU", away: "Australia", hs: "-", as: "-", date: "18 Jun" }, { home: "Paraguay", away: "Turquía", hs: "-", as: "-", date: "18 Jun" }, { home: "Turquía", away: "EEUU", hs: "-", as: "-", date: "22 Jun" }, { home: "Paraguay", away: "Australia", hs: "-", as: "-", date: "22 Jun" }] },
  E: { teams: ["Alemania", "Ecuador", "Costa de Marfil", "Curazao"], matches: [{ home: "Alemania", away: "Ecuador", hs: "-", as: "-", date: "14 Jun" }, { home: "Costa de Marfil", away: "Curazao", hs: "-", as: "-", date: "14 Jun" }, { home: "Alemania", away: "Costa de Marfil", hs: "-", as: "-", date: "18 Jun" }, { home: "Ecuador", away: "Curazao", hs: "-", as: "-", date: "18 Jun" }, { home: "Curazao", away: "Alemania", hs: "-", as: "-", date: "22 Jun" }, { home: "Ecuador", away: "Costa de Marfil", hs: "-", as: "-", date: "22 Jun" }] },
  F: { teams: ["Países Bajos", "Japón", "Túnez", "Suecia"], matches: [{ home: "Países Bajos", away: "Japón", hs: "-", as: "-", date: "14 Jun" }, { home: "Túnez", away: "Suecia", hs: "-", as: "-", date: "14 Jun" }, { home: "Países Bajos", away: "Túnez", hs: "-", as: "-", date: "19 Jun" }, { home: "Japón", away: "Suecia", hs: "-", as: "-", date: "19 Jun" }, { home: "Suecia", away: "Países Bajos", hs: "-", as: "-", date: "23 Jun" }, { home: "Japón", away: "Túnez", hs: "-", as: "-", date: "23 Jun" }] },
  G: { teams: ["Bélgica", "Irán", "Egipto", "Nueva Zelanda"], matches: [{ home: "Bélgica", away: "Irán", hs: "-", as: "-", date: "15 Jun" }, { home: "Egipto", away: "Nueva Zelanda", hs: "-", as: "-", date: "15 Jun" }, { home: "Bélgica", away: "Egipto", hs: "-", as: "-", date: "19 Jun" }, { home: "Irán", away: "Nueva Zelanda", hs: "-", as: "-", date: "19 Jun" }, { home: "Nueva Zelanda", away: "Bélgica", hs: "-", as: "-", date: "23 Jun" }, { home: "Irán", away: "Egipto", hs: "-", as: "-", date: "23 Jun" }] },
  H: { teams: ["España", "Uruguay", "Arabia Saudita", "Cabo Verde"], matches: [{ home: "España", away: "Uruguay", hs: "-", as: "-", date: "15 Jun" }, { home: "Arabia Saudita", away: "Cabo Verde", hs: "-", as: "-", date: "15 Jun" }, { home: "España", away: "Arabia Saudita", hs: "-", as: "-", date: "20 Jun" }, { home: "Uruguay", away: "Cabo Verde", hs: "-", as: "-", date: "20 Jun" }, { home: "Cabo Verde", away: "España", hs: "-", as: "-", date: "24 Jun" }, { home: "Uruguay", away: "Arabia Saudita", hs: "-", as: "-", date: "24 Jun" }] },
  I: { teams: ["Francia", "Senegal", "Noruega", "Irak"], matches: [{ home: "Francia", away: "Senegal", hs: "-", as: "-", date: "16 Jun" }, { home: "Noruega", away: "Irak", hs: "-", as: "-", date: "16 Jun" }, { home: "Francia", away: "Noruega", hs: "-", as: "-", date: "20 Jun" }, { home: "Senegal", away: "Irak", hs: "-", as: "-", date: "20 Jun" }, { home: "Irak", away: "Francia", hs: "-", as: "-", date: "24 Jun" }, { home: "Senegal", away: "Noruega", hs: "-", as: "-", date: "24 Jun" }] },
  J: { teams: ["Argentina", "Argelia", "Austria", "Jordania"], matches: [{ home: "Argentina", away: "Argelia", hs: "-", as: "-", date: "16 Jun" }, { home: "Austria", away: "Jordania", hs: "-", as: "-", date: "16 Jun" }, { home: "Argentina", away: "Austria", hs: "-", as: "-", date: "21 Jun" }, { home: "Argelia", away: "Jordania", hs: "-", as: "-", date: "21 Jun" }, { home: "Jordania", away: "Argentina", hs: "-", as: "-", date: "25 Jun" }, { home: "Argelia", away: "Austria", hs: "-", as: "-", date: "25 Jun" }] },
  K: { teams: ["Portugal", "Colombia", "Uzbekistán", "R.D. Congo"], matches: [{ home: "Portugal", away: "Colombia", hs: "-", as: "-", date: "17 Jun" }, { home: "Uzbekistán", away: "R.D. Congo", hs: "-", as: "-", date: "17 Jun" }, { home: "Portugal", away: "Uzbekistán", hs: "-", as: "-", date: "21 Jun" }, { home: "Colombia", away: "R.D. Congo", hs: "-", as: "-", date: "21 Jun" }, { home: "R.D. Congo", away: "Portugal", hs: "-", as: "-", date: "25 Jun" }, { home: "Colombia", away: "Uzbekistán", hs: "-", as: "-", date: "25 Jun" }] },
  L: { teams: ["Inglaterra", "Croacia", "Ghana", "Panamá"], matches: [{ home: "Inglaterra", away: "Croacia", hs: "-", as: "-", date: "17 Jun" }, { home: "Ghana", away: "Panamá", hs: "-", as: "-", date: "17 Jun" }, { home: "Inglaterra", away: "Ghana", hs: "-", as: "-", date: "22 Jun" }, { home: "Croacia", away: "Panamá", hs: "-", as: "-", date: "22 Jun" }, { home: "Panamá", away: "Inglaterra", hs: "-", as: "-", date: "26 Jun" }, { home: "Croacia", away: "Ghana", hs: "-", as: "-", date: "26 Jun" }] },
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
    const primerGrupo = Object.keys(window.GROUPS).sort(sortFases)[0];
    if (primerGrupo) renderGroups(primerGrupo);
  }
  if (id === 'fixtures') renderFixtures();
  if (id === 'scorers') renderScorers();
  if (id === 'cards') renderCards();
  if (id === 'history') renderHistory();
  if (id === 'noticias') {
    window.cargarNoticias(document.getElementById('filtro-noticias')?.value || '');
  }
  if (id === 'tienda') {
    window.cargarProductos(document.getElementById('filtro-tienda')?.value || '');
  }
  // Ocultar el FAB de guardar prode cuando se cambia de panel
  if (id !== 'prode') {
    const fab = document.getElementById('prode-save-fab');
    if (fab) fab.style.display = 'none';
  }
  if (id === 'idealxi') xiInit();
}

/* ─────────────────────────────────────
   GRUPOS: calcular posiciones
───────────────────────────────────── */
function sortFases(a, b) {
  const isGroupA = a.length <= 2;
  const isGroupB = b.length <= 2;
  if (isGroupA && isGroupB) {
    return a.localeCompare(b);
  }
  if (isGroupA) return -1;
  if (isGroupB) return 1;

  const seq = ['Ronda 1', 'Ronda 2', 'Ronda 3', 'Fase de Grupos', 'Dieciseisavos', 'Octavos de Final', 'Cuartos de Final', 'Semifinales', 'Tercer Puesto', 'Final'];
  const idxA = seq.indexOf(a);
  const idxB = seq.indexOf(b);

  if (idxA !== -1 && idxB !== -1) {
    return idxA - idxB;
  }
  if (idxA !== -1) return -1;
  if (idxB !== -1) return 1;
  return a.localeCompare(b);
}

function computeStandings(key) {
  const g = window.GROUPS[key];
  const s = {};
  g.teams.forEach(t => s[t] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });

  g.matches.forEach(m => {
    // 🛑 EL ARREGLO: Solo calculamos puntos si hay números (si no hay guiones)
    if (m.hs !== '-' && m.as !== '-') {
      s[m.home].p++; s[m.away].p++;
      s[m.home].gf += m.hs; s[m.home].ga += m.as;
      s[m.away].gf += m.as; s[m.away].ga += m.hs;
      if (m.hs > m.as) { s[m.home].w++; s[m.away].l++; s[m.home].pts += 3; }
      else if (m.hs < m.as) { s[m.away].w++; s[m.home].l++; s[m.away].pts += 3; }
      else { s[m.home].d++; s[m.away].d++; s[m.home].pts++; s[m.away].pts++; }
    }
  });
  return Object.entries(s).sort((a, b) => b[1].pts - a[1].pts || (b[1].gf - b[1].ga) - (a[1].gf - a[1].ga) || b[1].gf - a[1].gf);
}

function renderGroups(key) {
  const sel = document.getElementById('grpSelector');
  const sortedKeys = Object.keys(GROUPS).sort(sortFases);

  // Generar botones: primero grupos, luego eliminatorias en orden lógico
  const getLabel = (g) => g.length <= 2 ? `Grupo ${g}` : g;

  sel.innerHTML = sortedKeys.map(g =>
    `<button class="grp-btn ${g === key ? 'active' : ''}" onclick="renderGroups('${g}')">${getLabel(g)}</button>`
  ).join('');

  const standings = computeStandings(key);
  const gData = GROUPS[key];
  const isGroup = key.length <= 2;
  const sectionTitle = isGroup ? `Grupo ${key}` : key;

  const standHtml = `
    <div>
      <p class="section-label">Tabla — ${sectionTitle}</p>
      <div class="tbl">
        <div class="tbl-head">
          <span>#</span><span>EQUIPO</span>
          <span class="cc">PJ</span><span class="cc">G</span>
          <span class="cc">E</span><span class="cc">P</span>
          <span class="cc">DG</span><span class="cc">PTS</span>
        </div>
        ${standings.map(([team, s], i) => {
    const dg = s.gf - s.ga;
    return `<div class="tbl-row ${i < 2 ? 'qualify' : ''}">
            <span style="font-weight:900;color:${i < 2 ? 'var(--red)' : 'var(--text4)'}">${i + 1}</span>
            <span style="font-weight:700;color:var(--text2);cursor:pointer;" onclick="abrirPerfilEquipo('${team}')" title="Ver perfil de ${team}">${team}</span>
            <span class="cc" style="color:var(--text3)">${s.p}</span>
            <span class="cc" style="color:var(--text3)">${s.w}</span>
            <span class="cc" style="color:var(--text3)">${s.d}</span>
            <span class="cc" style="color:var(--text3)">${s.l}</span>
            <span class="cc ${dg > 0 ? 'dg-pos' : dg < 0 ? 'dg-neg' : 'dg-zer'}">${dg > 0 ? '+' : ''}${dg}</span>
            <span class="pts-big">${s.pts}</span>
          </div>`;
  }).join('')}
      </div>
    </div>`;

  const matchHtml = `
    <div>
      <p class="section-label">Partidos — ${sectionTitle}</p>
      ${gData.matches.map(m => `
        <div class="gmatch" ${m.id ? `onclick="abrirDetallePartido('${m.id}')" style="cursor:pointer"` : ''}>
          <span class="gm-date">${m.date}</span>
          <div class="gm-teams">
            <span class="gm-home">${m.home}</span>
            <span class="gm-score">${m.hs}–${m.as}</span>
            <span class="gm-away">${m.away}</span>
          </div>
          <span class="gm-ft">${m.estado === 'finalizado' ? 'FT' : m.estado === 'en_curso' ? '🔴' : '—'}</span>
        </div>`).join('')}
    </div>`;

  document.getElementById('grpContent').innerHTML = standHtml + matchHtml;
}

/* ─────────────────────────────────────
   FIXTURE
───────────────────────────────────── */
function populateFixtureFilters() {
  const selGroup = document.getElementById('filtro-fixture-grupo');
  const selDate = document.getElementById('filtro-fixture-fecha');
  if (!selGroup || !selDate) return;

  const currentGroup = selGroup.value;
  const currentDate = selDate.value;

  const groups = new Set();
  const dates = new Set();

  Object.entries(GROUPS).forEach(([key, g]) => {
    groups.add(key);
    g.matches.forEach(m => {
      if (m.date) dates.add(m.date);
    });
  });

  selGroup.innerHTML = '<option value="">Todos los grupos</option>';
  Array.from(groups).sort(sortFases).forEach(g => {
    const isGroup = g.length <= 2;
    const label = isGroup ? `Grupo ${g}` : g;
    selGroup.innerHTML += `<option value="${g}">${label}</option>`;
  });

  selDate.innerHTML = '<option value="">Todas las fechas</option>';
  Array.from(dates).forEach(d => {
    selDate.innerHTML += `<option value="${d}">${d}</option>`;
  });

  if (Array.from(groups).includes(currentGroup)) selGroup.value = currentGroup;
  if (Array.from(dates).includes(currentDate)) selDate.value = currentDate;
}

function renderFixtures() {
  populateFixtureFilters();

  const groupFilter = document.getElementById('filtro-fixture-grupo')?.value || '';
  const dateFilter = document.getElementById('filtro-fixture-fecha')?.value || '';

  const sortedEntries = Object.entries(GROUPS).sort((a, b) => sortFases(a[0], b[0]));

  let html = '';

  sortedEntries.forEach(([key, g]) => {
    if (groupFilter && key !== groupFilter) return;

    const matchesToShow = g.matches.filter(m => !dateFilter || m.date === dateFilter);
    if (matchesToShow.length === 0) return;

    const isGroup = key.length <= 2;
    const headerName = isGroup ? `GRUPO ${key}` : key.toUpperCase();

    html += `
    <div class="fix-card">
      <div class="fix-hdr">
        <span class="fix-grp-name">${headerName}</span>
        <span class="fix-grp-teams">${g.teams.join(' · ')}</span>
      </div>
      ${matchesToShow.map(m => `
        <div class="fix-match" ${m.id ? `onclick="abrirDetallePartido('${m.id}')" style="cursor:pointer"` : ''}>
          <span class="fix-date">${m.date}</span>
          <div class="fix-teams">
            <span class="fix-home">${m.home}</span>
            <span class="fix-score">${m.hs}–${m.as}</span>
            <span class="fix-away">${m.away}</span>
          </div>
          <span class="fix-ft">${m.estado === 'finalizado' ? 'FT' : m.estado === 'en_curso' ? `🔴 ${m.minuto || ''}'` : '—'}</span>
        </div>`).join('')}
    </div>`;
  });

  if (!html) {
    html = '<div style="text-align:center;padding:30px;color:var(--text4);width:100%">No hay partidos para los filtros seleccionados.</div>';
  }

  document.getElementById('fixtureContent').innerHTML = html;
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
  const colors = ['var(--gold)', 'var(--silver)', 'var(--bronze)', 'var(--text4)', 'var(--text4)', 'var(--text4)', 'var(--text4)', 'var(--text4)'];
  container.innerHTML = SCORERS.map((s, i) => `
    <div class="sc-row">
      <span class="sc-rank" style="color:${colors[i] || 'var(--text4)'}">${i + 1}</span>
      <span class="sc-flag">${s.flag || (s.escudo ? `<img src="${s.escudo}" style="width:24px;height:24px;object-fit:contain">` : '🏳️')}</span>
      <div><div class="sc-name">${s.name}</div><div class="sc-team">${s.team}</div></div>
      <span class="sc-team" style="font-size:13px">${s.team}</span>
      <div class="sc-goals-cell">
        <div class="sc-goals-num">${s.goals}</div>
        <div class="sc-bar-wrap"><div class="sc-bar" style="width:${Math.round(s.goals / max * 100)}%"></div></div>
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
  const yellowCards = [...window.CARDS].filter(c => c.yellow > 0).sort((a, b) => b.yellow - a.yellow);
  const redCards = [...window.CARDS].filter(c => c.red > 0).sort((a, b) => b.red - a.red);

  // Renderizador genérico
  const renderRows = (cardsList, type) => {
    if (cardsList.length === 0) return '<div style="text-align:center;padding:20px;color:var(--text4)">No hay tarjetas registradas</div>';
    return cardsList.map((c, i) => `
      <div class="cd-row" style="grid-template-columns: 36px 36px 1fr 110px;">
        <span class="cd-rank">${i + 1}</span>
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
    window.EDITIONS.sort((a, b) => b.year - a.year);
    const selectedYear = window.EDITIONS[0].year;

    sel.innerHTML = window.EDITIONS.map(e =>
      `<button class="ed-btn ${e.year === selectedYear ? 'active' : ''}" onclick="showEdition(${e.year})">${e.year}</button>`
    ).join('');

    const spotifySongs = {
      2022: { title: "Canción Oficial - Qatar 2022", url: "https://open.spotify.com/embed/track/7vAJiDFrFtMYVOrZbOw7jj?utm_source=generator&theme=0" },
      2018: { title: "Canción Oficial - Rusia 2018", url: "https://open.spotify.com/embed/track/4DnHUy01jEA4b5ydC3HgsT?utm_source=generator&theme=0" },
      2014: { title: "Canción Oficial - Brasil 2014", url: "https://open.spotify.com/embed/track/1PCvKFPWnTXAe2oaReVUcr?utm_source=generator&theme=0" },
      2010: { title: "Canción Oficial - Sudáfrica 2010", url: "https://open.spotify.com/embed/track/2Cd9iWfcOpGDHLz6tVA3G4?utm_source=generator&theme=0" },
      2006: { title: "Canción Oficial - Alemania 2006", url: "https://open.spotify.com/embed/track/67odGWQ12yMWFyxairuPN3?utm_source=generator&theme=0" },
      2002: { title: "Canción Oficial - Corea/Japón 2002", url: "https://open.spotify.com/embed/track/6UhIbqY2luV12f5FdSHpiU?utm_source=generator&theme=0" },
      1998: { title: "Canción Oficial - Francia 1998", url: "https://open.spotify.com/embed/track/5PrGG8gAKXl4bi1odVla7l?utm_source=generator&theme=0" },
      1994: { title: "Canción Oficial - Estados Unidos 1994", url: "https://open.spotify.com/embed/track/548gZRWmmxCtKoBuMIf1Id?utm_source=generator&theme=0" },
      1990: { title: "Canción Oficial - Italia 1990", url: "https://open.spotify.com/embed/track/50jCUPNEHtmLfK6PQzcnOH?utm_source=generator&theme=0" },
      1986: { title: "Canción Oficial - México 1986", url: "https://open.spotify.com/embed/track/4TlKsjoxSfwnPsX7wrJr3o?utm_source=generator&theme=0" },
      1978: { title: "Canción Oficial - Argentina 1978", url: "https://open.spotify.com/embed/track/49QXZ4GaxHSN8PlMRrjVK8?utm_source=generator" },
      1970: { title: "Canción Oficial - México 1970", url: "https://open.spotify.com/embed/track/1GSa6H0MaYZIszPuMipURB?utm_source=generator" },
      1966: { title: "Canción Oficial - Inglaterra 1966", url: "https://open.spotify.com/embed/track/6otZIO8NVB7xV3seYqUfGt?utm_source=generator" }
    };

    const worldCupExtras = {
      2022: { mascot: "La'eeb 👻", mascotImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCr-PMfoZHc7VSTYexCEIcRhwEVYh-Necy7A&s", ball: "Al Rihla ⚽", ballImg: "https://upload.wikimedia.org/wikipedia/commons/2/25/Al-Rihla_%28cropped%29.jpg" },
      2018: { mascot: "Zabivaka 🐺", mascotImg: "https://www.tudn.com/_next/image?url=https%3A%2F%2Fst1.uvnimg.com%2F5b%2Fc5%2F47bca6fa41ffb6a7a3be3853cc49%2Fzabivaka.png&w=1280&q=75", ball: "Telstar 18 ⚽", ballImg: "https://upload.wikimedia.org/wikipedia/commons/5/50/Adidas_Telstar_18_in_Russia_vs._Argentina.jpg" },
      2014: { mascot: "Fuleco 🦔", mascotImg: "https://s.yimg.com/ny/api/res/1.2/raMOxEUJQvEMbTXDYsexoQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTcyOTtjZj13ZWJw/https://media.zenfs.com/es_US/News/es.afp.com/photo_1347906101272-1-0.jpg", ball: "Brazuca ⚽", ballImg: "https://www.infobae.com/resizer/v2/QVJTGQEKQZCZRBSZ2BXDBHFAKU?auth=539c29e8b57d382e60a7080f6af1d1f3d06fe553d033e32f80b9dfd10bc7feaa&smart=true&width=1200&height=900&quality=85" },
      2010: { mascot: "Zakumi 🐆", mascotImg: "https://visitaxela.wordpress.com/wp-content/uploads/2010/06/zakumi.jpg", ball: "Jabulani ⚽", ballImg: "https://upload.wikimedia.org/wikipedia/commons/5/57/Adidas_Jabulani_Official_World_Cup_2010_%284158450149%29.jpg" },
      2006: { mascot: "Goleo VI 🦁", mascotImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqvYoadAnfFGuXQhfDFGhLZGQ18m4iG5q3pA&s", ball: "Teamgeist ⚽", ballImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeaJnGD3DtySQOMmkTfAz9845Y9unVmjis5A&s" },
      2002: { mascot: "Ato, Kaz & Nik 👽", mascotImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPxzAnScqCWGrqdArzgKXj4Y_B_9Wu5uHTWS4z7t9eXQ&s", ball: "Fevernova ⚽", ballImg: "https://i.ebayimg.com/images/g/iu4AAeSwqLZoqu6l/s-l1200.webp" },
      1998: { mascot: "Footix 🐓", mascotImg: "https://img.emisorasunidas.com/upload/2026/05/17161D524C43416D17110F54594947781F16171854434778141516.jpg", ball: "Tricolore ⚽", ballImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe9ThcYWNP1TksC5yREFyOUY_ByUVa-xOTMQ&s" },
      1994: { mascot: "Striker 🐶", mascotImg: "https://i.pinimg.com/736x/9a/12/cf/9a12cf867efe7bda136a13afbf3086c2.jpg", ball: "Questra ⚽", ballImg: "https://www.rionegro.com.ar/wp-content/uploads/documents/1/0/image_content_9678080_20180523105010.jpg" },
      1990: { mascot: "Ciao 🪆", mascotImg: "https://acdn-us.mitiendanube.com/stores/001/069/039/products/futbol0711-d3fd1dd3560da5cf8015856039727882-480-0.webp", ball: "Etrusco Unico ⚽", ballImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuYUPQopKkV7hp_OnYW8Oz9YIigUtx32iOTA&s" },
      1986: { mascot: "Pique 🌶️", mascotImg: "https://acdn-us.mitiendanube.com/stores/001/069/039/products/futbol051-62f73c0b1396e8267815856034166165-640-0.webp", ball: "Azteca ⚽", ballImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTkouJjcM07mBZVXjBrMtkOr5na1p8cL8Mqg&s" },
      1982: { mascot: "Naranjito 🍊", mascotImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYZUirtVmwg5ZQxs-U_dBlh1Vhaqp1xfwb-w&s", ball: "Tango España ⚽", ballImg: "https://i.pinimg.com/564x/0a/a9/4f/0aa94f31c6bf757472d47eed684d0e49.jpg" },
      1978: { mascot: "Gauchito 👦", mascotImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc82vVEOIgGkyII6jMVnLvmkHntVU_K2pK4A&s", ball: "Tango ⚽", ballImg: "https://lh6.googleusercontent.com/proxy/YvqCBi5_l5dl9Y_CuK4XL5svhR4MofODCjCB5htVp8R-vSTym-iWGPw32OV4YaroRLXX7izAd4N-ZITxfsZAv0hXaF1nYDVYdN4ROxN2xbIDvXkXy2VZlnWiYFxUy7T0ig" },
      1974: { mascot: "Tip y Tap 👦👦", mascotImg: "https://www.mundiario.com/media/mundiario/images/2018/05/24/2018052417443888580.jpg", ball: "Telstar Durlast ⚽", ballImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Telstar_Durlast.jpg/330px-Telstar_Durlast.jpg" },
      1970: { mascot: "Juanito 👦", mascotImg: "https://www.infobae.com/resizer/v2/RBFBVBU2HFGTLGB5P62V5Y2TTU.jpg?auth=b753e04443767024fe945b5b141fb16e5f4f61439f976c648b11591d7cf306d2&smart=true&width=350&height=467&quality=85", ball: "Telstar ⚽", ballImg: "https://http2.mlstatic.com/D_NQ_NP_634179-MLA89453347991_082025-O.webp" },
      1966: { mascot: "World Cup Willie 🦁", mascotImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxnG1Xy7Z8M7c3zRIf7TcsUiFraLyaSTr4tw&s", ball: "Challenge 4-Star ⚽", ballImg: "https://i.etsystatic.com/38427944/r/il/8aa2d8/4366871280/il_fullxfull.4366871280_3stk.jpg" },
      1962: { mascot: "N/A", mascotImg: "", ball: "Crack ⚽", ballImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbQZHMnsEugCp72n-rvsi4KIlhrvN6hCQKIw&s" },
      1958: { mascot: "N/A", mascotImg: "", ball: "Top Star ⚽", ballImg: "https://www.sopitas.com/wp-content/uploads/2025/10/balones-mundial-1958.jpg" },
      1954: { mascot: "N/A", mascotImg: "", ball: "Swiss World Champion ⚽", ballImg: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Balon_mundial_1954.jpg" },
      1950: { mascot: "N/A", mascotImg: "", ball: "Duplo T ⚽", ballImg: "https://phantom-expansion.unidadeditorial.es/021bff6c0ad3f2e8b8bc095b8952a719/assets/multimedia/imagenes/2022/11/22/16691363486911.jpg" },
      1938: { mascot: "N/A", mascotImg: "", ball: "Allen ⚽", ballImg: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Balon_mundial_1938.jpg" },
      1934: { mascot: "N/A", mascotImg: "", ball: "Federale 102 ⚽", ballImg: "https://i.pinimg.com/736x/a5/f5/30/a5f530fa350b3996b4ba96e88078f2fb.jpg" },
      1930: { mascot: "N/A", mascotImg: "", ball: "T-Model / Tiento ⚽", ballImg: "https://www.rionegro.com.ar/wp-content/uploads/documents/1/0/image_content_9678126_20180523105001.jpg" }
    };

    
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
    <div class="ed-card ${e.year === selectedYear ? 'active' : ''}" id="ed-${e.year}">
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
      
      <!-- Mascot and Ball Section -->
      <div style="display: flex; gap: 20px; margin-bottom: 25px; background: var(--navy2); padding: 20px; border-radius: 8px; border: 1px solid var(--border3); flex-wrap: wrap;">
         <div style="flex: 1; min-width: 250px; display: flex; align-items: center; gap: 20px;">
            ${(e.mascota_img || worldCupExtras[e.year]?.mascotImg) ? `<img src="${e.mascota_img || worldCupExtras[e.year]?.mascotImg}" style="width: 120px; height: 120px; object-fit: contain; border-radius: 8px; background: rgba(255,255,255,0.05); padding: 10px;" alt="Mascota">` : `<div style="width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; font-size: 48px; background: rgba(255,255,255,0.05); border-radius: 8px;">👻</div>`}
            <div>
              <div style="font-size: 12px; color: var(--text4); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Mascota Oficial</div>
              <div style="font-weight: bold; color: var(--text1); font-size: 20px; margin-bottom: 5px;">${e.mascota || worldCupExtras[e.year]?.mascot || 'No tuvo mascota 🤷‍♂️'}</div>
            </div>
         </div>
         <div style="flex: 1; min-width: 250px; display: flex; align-items: center; gap: 20px;">
            ${(e.pelota_img || worldCupExtras[e.year]?.ballImg) ? `<img src="${e.pelota_img || worldCupExtras[e.year]?.ballImg}" style="width: 120px; height: 120px; object-fit: contain; border-radius: 8px; background: rgba(255,255,255,0.05); padding: 10px;" alt="Pelota">` : `<div style="width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; font-size: 48px; background: rgba(255,255,255,0.05); border-radius: 8px;">⚽</div>`}
            <div>
              <div style="font-size: 12px; color: var(--text4); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Pelota Oficial</div>
              <div style="font-weight: bold; color: var(--text1); font-size: 20px; margin-bottom: 5px;">${e.pelota || worldCupExtras[e.year]?.ball || 'Desconocida ⚽'}</div>
            </div>
         </div>
      </div>

      <!-- Videos Destacados & Canciones -->
      ${(e.videos && e.videos.length > 0) || spotifySongs[e.year] ? `
      <div class="ed-video-section" style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid var(--border3);">
        <div class="ed-section-title" style="margin-bottom: 15px;">▶️ Momentos Destacados & 🎵 Música Oficial</div>
        <div style="display:flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
          ${e.videos && e.videos.length > 0 ? e.videos.map(v => `
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
          `).join('') : ''}
          
          ${spotifySongs[e.year] ? `
            <div style="flex: 1; min-width: 300px; max-width: 500px; background: var(--navy1); border-radius: 8px; overflow: hidden; border: 1px solid var(--border3); margin-bottom: 15px; display: flex; flex-direction: column;">
              <div style="padding: 15px;">
                <h4 style="margin: 0 0 15px 0; color: var(--text1); font-size: 16px;">🎵 ${spotifySongs[e.year].title}</h4>
                <iframe data-testid="embed-iframe" style="border-radius:12px" data-src="${spotifySongs[e.year].url}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <div class="ed-body">

        <!-- Columna 1: Goleadores -->
        <div>
          <div class="ed-section-title">Goleadores del torneo</div>
          ${e.scorers.map((s, i) => `
            <div class="hist-scorer-row">
              <span class="hsr-pos">${i + 1}</span>
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
        const hasEmoji = /^[^\w\s]/.test(f.slice(0, 2));
        const emoji = hasEmoji ? f.slice(0, 2) : '⚽';
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
  const colors = ['var(--gold)', 'var(--silver)', 'var(--bronze)', 'var(--text4)', 'var(--text4)'];
  container.innerHTML = SCORERS.slice(0, 5).map((s, i) => `
    <div class="srow">
      <span class="srow-rank" style="color:${colors[i] || 'var(--text4)'}">${i + 1}</span>
      <span class="srow-flag">${s.flag || (s.escudo ? `<img src="${s.escudo}" style="width:18px;height:18px;object-fit:contain">` : '🏳️')}</span>
      <div style="flex:1"><div class="srow-name">${s.name}</div><div class="srow-sub">${s.team}</div></div>
      <div style="text-align:right"><div class="srow-num">${s.goals}</div><div class="srow-unit">GOLES</div></div>
    </div>`).join('');
}

/* ─────────────────────────────────────
   TIEMPO REAL: minutos del partido
───────────────────────────────────── */
const liveMinutes = [{ id: 'live1-min', min: 67, max: 90 }, { id: 'live2-min', min: 23, max: 90 }];
setInterval(() => {
  liveMinutes.forEach(d => {
    if (d.min < d.max) d.min++;
    const el = document.getElementById(d.id);
    if (el) el.textContent = d.min + "'";
  });
}, 5000);



// Define tu URL base de Render (la que te dará Render cuando crees el Web Service)
const BACKEND_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://mundialito-hzhf.onrender.com'; // 👈 Tu URL de Render
const API_URL = `${BACKEND_BASE_URL}/api`;

/* ── Utilidad: debounce ── */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 1. Carga los países en los selectores correspondientes
window.cargarFiltrosDinamicos = async function () {
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
window.imgFallback = function (img) {
  img.onerror = null; // evitar loop infinito
  img.src = PLACEHOLDER_IMG;
};

// ══════════════════════════════════════
// 2. NOTICIAS — función independiente
// ══════════════════════════════════════
window.cargarNoticias = debounce(async function (pais = "") {
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
window.cargarProductos = debounce(async function (pais = "") {
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

      // Extraer la clave: "Grupo A" → "A", "Grupo B" → "B"
      // Fases eliminatorias como "Ronda 1", "Final", etc. → se usan como clave directa
      let clave;
      if (p.grupo.startsWith('Grupo ')) {
        clave = p.grupo.replace('Grupo ', '').trim();
      } else {
        clave = p.grupo; // "Ronda 1", "Octavos de Final", etc.
      }

      if (!gruposAPI[clave]) gruposAPI[clave] = { teams: [], matches: [] };
      const g = gruposAPI[clave];

      const localName = p.equipo_local || 'Por definirse';
      const awayName = p.equipo_visitante || 'Por definirse';

      if (localName && !g.teams.includes(localName)) g.teams.push(localName);
      if (awayName && !g.teams.includes(awayName)) g.teams.push(awayName);

      const fecha = new Date(p.fecha_utc);
      g.matches.push({
        id: p.id,
        home: localName,
        away: awayName,
        hs: p.goles_local ?? '-', as: p.goles_visitante ?? '-',
        date: fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
        estado: p.estado, estadio: p.estadio,
        fecha_utc: p.fecha_utc,
        escudo_local: p.escudo_local, escudo_visitante: p.escudo_visitante,
        minuto: p.minuto
      });
    });

    if (Object.keys(gruposAPI).length > 0) {
      window.GROUPS = gruposAPI;
      // Seleccionar el primer grupo real (letra de 1-2 chars) como inicial
      const sortedKeys = Object.keys(gruposAPI).sort(sortFases);
      const primerGrupo = sortedKeys.find(k => k.length <= 2) || sortedKeys[0];
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
    if (!data.length) {
      window.SCORERS = [];
      renderScorers();
      renderLiveScorers();
      return;
    }
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
    if (!data.length) {
      window.CARDS = [];
      renderCards();
      return;
    }
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

    // Cachear los partidos en vivo para cuando el módulo de encuestas se cargue después
    window._ultimosPartidosVivos = partidos;

    renderLivePanel(partidos);

    if (partidos && partidos.length > 0) {
      buildTicker(partidos);

      // Sincronizar goles en vivo con el objeto GROUPS para que la tabla de posiciones se actualice
      if (window.GROUPS) {
        let updated = false;
        partidos.forEach(liveM => {
          Object.values(window.GROUPS).forEach(g => {
            const matchInGroup = g.matches.find(m => m.id === liveM.id);
            if (matchInGroup) {
              matchInGroup.hs = liveM.goles_local ?? 0;
              matchInGroup.as = liveM.goles_visitante ?? 0;
              matchInGroup.estado = 'en_curso';
              updated = true;
            }
          });
        });

        // Re-renderizar si hubo cambios y estamos en la pestaña correcta
        if (updated) {
          const activeGrpBtn = document.querySelector('.grp-btn.active');
          if (activeGrpBtn && document.getElementById('panel-groups').classList.contains('active')) {
            const activeKey = activeGrpBtn.textContent.replace('Grupo ', '').trim();
            renderGroups(activeKey);
          }
          if (document.getElementById('panel-fixtures').classList.contains('active')) {
            renderFixtures();
          }
        }
      }
    } else {
      updateTickerWithUpcoming();
    }
  } catch (e) { console.warn('⚠️ Live no disponible:', e.message); }
}
window.cargarPartidosEnVivo = cargarPartidosEnVivo;

// El módulo de encuestas (ES module) puede cargarse DESPUÉS del DOMContentLoaded de app.js.
// Cuando esté listo, re-inicializa las encuestas con el último lote de partidos en vivo.
window.addEventListener('encuestasReady', () => {
  console.log('[Encuestas] ✅ Módulo listo. Inicializando con partidos cacheados...');
  if (window._ultimosPartidosVivos && window._ultimosPartidosVivos.length > 0) {
    window._encuestasModule.inicializarEncuestasEnVivo(window._ultimosPartidosVivos);
  }
});

window.updateTickerWithUpcoming = function () {
  if (!window.GROUPS) return;
  const allMatches = [];
  Object.entries(window.GROUPS).forEach(([letra, g]) => {
    g.matches.forEach(m => allMatches.push({ ...m, grupo: `Grupo ${letra}` }));
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
    // Limpiar encuestas si no hay partidos
    if (window._encuestasModule) window._encuestasModule.limpiarTodasEncuestas();
    return;
  }

  // Renderizar tarjetas de partidos.
  // Cada partido se envuelve en .match-live-wrapper para que encuestas.js
  // pueda insertar el panel de encuestas inmediatamente después del .match-live.
  container.innerHTML = partidos.map(p => `
    <div class="match-live-wrapper" style="margin-bottom:12px;">
      <div class="match-live" data-partido-id="${p.id}"
           onclick="abrirDetallePartido('${p.id}')" style="cursor:pointer;margin-bottom:0;">
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
      </div>
    </div>`).join('');

  // Inicializar encuestas para cada partido en vivo (async, no bloquea el UI)
  if (window._encuestasModule) {
    window._encuestasModule.inicializarEncuestasEnVivo(partidos);
  }
}

// ══════════════════════════════════════
// 6. MODAL DETALLE DE PARTIDO
// ══════════════════════════════════════
window.abrirDetallePartido = async function (matchId) {
  const modal = document.getElementById('match-detail-modal');
  const content = document.getElementById('match-detail-content');
  if (!modal || !content) return;

  content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">Cargando partido...</div>';
  modal.classList.add('active');

  try {
    const res = await fetch(`${API_URL}/fixture/${matchId}`);
    const p = await res.json();
    const fecha = new Date(p.fecha_utc);
    const fechaLocal = fecha.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const horaLocal = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    const estadoTexto = { programado: 'Programado', en_curso: 'En Vivo', finalizado: 'Finalizado', suspendido: 'Suspendido' };

    content.innerHTML = `
      <div class="md-header">
        <div class="md-comp">${p.competicion || 'Mundial 2026'} ${p.grupo ? '· ' + p.grupo.replace('GROUP_', 'Grupo ') : ''}</div>
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
        ${p.fase ? `<div class="md-info-item"><span class="md-info-icon">📋</span><span>Fase: ${p.fase.replace(/_/g, ' ')}</span></div>` : ''}
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
        prodContainer.innerHTML = todosProductos.slice(0, 4).map(prod => `
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

window.cerrarDetallePartido = function () {
  document.getElementById('match-detail-modal')?.classList.remove('active');
};

// ══════════════════════════════════════
// MODAL PERFIL DE EQUIPO
// ══════════════════════════════════════
window.abrirPerfilEquipo = async function (teamName) {
  let modal = document.getElementById('team-profile-modal');
  let content = document.getElementById('team-profile-content');

  if (!modal) {
    // Crear el modal si no existe en el DOM
    modal = document.createElement('div');
    modal.id = 'team-profile-modal';
    modal.className = 'modal-overlay';
    modal.onclick = function (e) { if (e.target === this) window.cerrarPerfilEquipo(); };

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 800px;">
        <button class="modal-close" onclick="window.cerrarPerfilEquipo()">✕</button>
        <div id="team-profile-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
    content = document.getElementById('team-profile-content');
  }

  content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">Cargando perfil de ' + teamName + '...</div>';
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
        <img src="${team.logo || PLACEHOLDER_IMG}" style="width:60px; height:60px; object-fit:contain;" onerror="this.src='${PLACEHOLDER_IMG}'">
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

window.cerrarPerfilEquipo = function () {
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

  // Refrescar partidos en vivo cada 60 segundos como fallback
  setInterval(cargarPartidosEnVivo, 60000);
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
// Detecta automáticamente si usa local o Render
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
  input.value = '';
  chatbotEsperando = true;
  autoResizeTextarea(input);

  // Actualizar contador de caracteres
  document.getElementById('chatbot-char-count').textContent = '0/500';

  // Deshabilitar botón de envío visualmente
  const sendBtn = document.getElementById('chatbot-send-btn');
  sendBtn.disabled = true;

  // 1. Mostrar el mensaje del usuario en el chat
  agregarMensajeChatbot('user', texto);

  // 2. Agregar al historial (formato que espera Gemini)
  chatbotHistorial.push({
    role: 'user',
    parts: [{ text: texto }]
  });

  // 3. Mostrar indicador de "escribiendo..."
  const typingId = mostrarTyping();

  try {
    // 4. Llamar al backend
    //    El backend llama a Gemini con el historial completo
    const respuesta = await fetch(`${CHATBOT_BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje: texto,
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
      role: 'model',
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

    // 8. Calendario: solo mostrar cuando Gemini devuelve datos exactos del partido
    //    (equipo1 + equipo2 + fecha + hora_arg). Caso B (solo equipo/fecha_aprox) = ignorar.
    if (
      datos.calendario &&
      datos.calendario.equipo1 &&
      datos.calendario.equipo2 &&
      datos.calendario.fecha &&
      datos.calendario.hora_arg
    ) {
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

  const esUsuario = rol === 'user';
  const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  // Obtener inicial del username para el avatar del usuario
  const perfil = window.currentProfile; // Viene de auth.js
  const inicial = perfil?.username?.[0]?.toUpperCase() || 'U';

  const div = document.createElement('div');
  div.className = `chatbot-msg ${esUsuario ? 'chatbot-msg--user' : 'chatbot-msg--bot'}`;

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
  const textoHtml = textoProcesado
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

  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chatbot-msg chatbot-msg--bot';
  div.id = id;
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
  const info = document.getElementById('chatbot-calendario-info');
  if (!section || !info) return;

  // Caso A: datos exactos del partido
  const tituloPartido = `${evento.equipo1} vs ${evento.equipo2}`;
  const [anio, mes, dia] = evento.fecha.split('-');
  const fechaLegible = `${dia}/${mes}/${anio}`;

  info.innerHTML = `
    <div style="margin-bottom:6px;font-weight:700;color:var(--gold)">📅 Partido detectado</div>
    <div style="margin-bottom:4px"><strong>⚽ Partido:</strong> ${tituloPartido}</div>
    <div style="margin-bottom:4px"><strong>📅 Fecha:</strong> ${fechaLegible} · ${evento.hora_arg} hs (Argentina)</div>
    <div><strong>📝</strong> ${evento.descripcion || 'Mundial FIFA 2026'}</div>
  `;

  section.style.display = 'block';
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

  const evento = ultimoEventoCalendario;

  // SOLO crear el evento si tenemos datos exactos del partido.
  // Sin equipo1, equipo2, fecha y hora_arg exactos → no hacer nada.
  if (!evento.equipo1 || !evento.equipo2 || !evento.fecha || !evento.hora_arg) {
    console.warn('[agendarEnCalendario] Faltan datos exactos del partido. No se abre Google Calendar.');
    return;
  }

  // Parsear fecha y hora de Argentina (UTC-3) → UTC
  const [anio, mes, dia] = evento.fecha.split('-').map(Number);
  const [hora, minuto] = evento.hora_arg.split(':').map(Number);
  const OFFSET_ARG_MS = 3 * 60 * 60 * 1000;  // UTC-3 → sumar 3h para obtener UTC
  const inicioUTC = new Date(Date.UTC(anio, mes - 1, dia, hora, minuto, 0) + OFFSET_ARG_MS);
  const finUTC = new Date(inicioUTC.getTime() + 2 * 60 * 60 * 1000); // +2 horas

  // Formatear a YYYYMMDDTHHMMSSZ
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${evento.equipo1} vs ${evento.equipo2}`,
    details: `⚽ Partido del Mundial FIFA 2026\n🕐 ${evento.hora_arg} hs (Argentina) · Duración: 2 horas\n\nAgendado desde Mundialito.app`,
    dates: `${fmt(inicioUTC)}/${fmt(finUTC)}`,
    location: 'Mundial FIFA 2026 — USA / México / Canadá',
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');

  // Feedback visual en el botón del sidebar
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
  const texto = btn.textContent.trim();
  const input = document.getElementById('chatbot-input');
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
  const badge = document.getElementById('chatbot-fab-badge');
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje: texto,
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
  const div = document.createElement('div');
  div.className = `chatbot-msg ${esUsuario ? 'chatbot-msg--user' : 'chatbot-msg--bot'}`;
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

/* ══════════════════════════════════════════════════════════════
   ██████╗ ██████╗  ██████╗ ██████╗ ███████╗
   ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝
   ██████╔╝██████╔╝██║   ██║██║  ██║█████╗
   ██╔═══╝ ██╔══██╗██║   ██║██║  ██║██╔══╝
   ██║     ██║  ██║╚██████╔╝██████╔╝███████╗
   ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
   Módulo de Predicciones Deportivas — Vanilla JS
   Usa window.supabaseClient (expuesto desde el módulo ESM del HTML)
   Usa window.__mundialitoUserId (seteado en onMundialitoAuth)
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Utilidades internas ───────────────────────────────────────
  function sb() {
    return window.supabaseClient;
  }

  function userId() {
    return window.__mundialitoUserId || null;
  }

  function prodeToast(msg, tipo = 'success') {
    const existing = document.getElementById('prode-toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = 'prode-toast';
    el.className = `prode-toast toast--${tipo}`;
    el.innerHTML = `<span>${tipo === 'success' ? '✅' : '❌'}</span> ${msg}`;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity .4s';
      setTimeout(() => el.remove(), 400);
    }, 3500);
  }

  function prodeSetMsg(elId, msg, tipo) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.className = `community-msg msg--${tipo}`;
    el.textContent = msg;
    if (tipo === 'success') setTimeout(() => { el.style.display = 'none'; }, 5000);
  }

  /**
   * Determina si un partido debe estar bloqueado para predicciones.
   * Regla: si faltan ≤ 60 minutos para el inicio, o ya comenzó / terminó.
   */
  function esBloqueado(partido) {
    const ahora = Date.now();
    const inicio = new Date(partido.fecha_utc || partido.date_utc).getTime();
    const unaHoraMs = 60 * 60 * 1000;
    const estado = (partido.estado || '').toLowerCase();
    return estado === 'finalizado'
      || estado === 'en_curso'
      || estado === 'suspendido'
      || (inicio - ahora) <= unaHoraMs;
  }

  /**
   * Calcula los puntos de una predicción.
   * @returns {{ puntos: number|null, tipo: string }}
   */
  function calcPts(pL, pV, rL, rV) {
    if (rL === null || rL === undefined || rV === null || rV === undefined)
      return { puntos: null, tipo: 'pendiente' };
    if (pL === rL && pV === rV) return { puntos: 3, tipo: 'exacto' };
    if (Math.sign(pL - pV) === Math.sign(rL - rV)) return { puntos: 1, tipo: 'signo' };
    return { puntos: 0, tipo: 'fallo' };
  }

  // ─── Estado del módulo ─────────────────────────────────────────
  let _uid = null;
  let _partidos = [];     // array de partidos desde Supabase
  let _preds = {};     // { [partido_id]: { local, visitante, puntos, bonusAplicado } }
  let _pendientes = new Set();
  let _grupoActivo = null;   // group_id seleccionado en la vista de comunidades

  // ══════════════════════════════════════════════════════════════
  // PUNTO DE ENTRADA
  // ══════════════════════════════════════════════════════════════
  window.prodeInit = async function (uid) {
    _uid = uid;
    if (!_uid || !sb()) {
      // Supabase aún no está listo — reintentar en 500ms
      setTimeout(() => {
        if (userId() && sb()) window.prodeInit(userId());
      }, 500);
      return;
    }
    console.log('[Prode] Iniciando para usuario', _uid);
    await _cargarPartidos();
    await _cargarPredicciones();
    _renderPredicciones();
    _bindSaveButton();
    _bindSearchBar();
  };

  // ══════════════════════════════════════════════════════════════
  // FETCH: Partidos desde Supabase
  // ══════════════════════════════════════════════════════════════
  async function _cargarPartidos() {
    try {
      const { data, error } = await sb()
        .from('partidos')
        .select('id, fase, equipo_local, equipo_visitante, escudo_local, escudo_visitante, fecha_utc, goles_local, goles_visitante, estado')
        .neq('edicion_mundial', 'libertadores_2026')
        .order('fecha_utc', { ascending: true });
      if (error) throw error;
      _partidos = data || [];
    } catch (e) {
      console.error('[Prode] Error cargando partidos:', e);
      _partidos = [];
    }
  }

  // ══════════════════════════════════════════════════════════════
  // FETCH: Predicciones del usuario
  // ══════════════════════════════════════════════════════════════
  async function _cargarPredicciones() {
    if (!_uid) return;
    try {
      const { data, error } = await sb()
        .from('prode_predictions')
        .select('partido_id, pred_goles_local, pred_goles_visitante, puntos_obtenidos, bonus_aplicado')
        .eq('user_id', _uid);
      if (error) throw error;
      _preds = {};
      (data || []).forEach(p => {
        _preds[p.partido_id] = {
          local: p.pred_goles_local,
          visitante: p.pred_goles_visitante,
          puntos: p.puntos_obtenidos,
          bonusAplicado: p.bonus_aplicado,
        };
      });
    } catch (e) {
      console.error('[Prode] Error cargando predicciones:', e);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: Panel de predicciones
  // ══════════════════════════════════════════════════════════════
  function _renderPredicciones() {
    const cont = document.getElementById('prode-predictions-content');
    if (!cont) return;

    if (_partidos.length === 0) {
      cont.innerHTML = `
        <div class="prode-empty">
          <span class="prode-empty-icon">⚽</span>
          <div class="prode-empty-title">Sin partidos cargados</div>
          <div class="prode-empty-sub">Volvé más tarde cuando el fixture esté disponible.</div>
        </div>`;
      return;
    }

    // ── Clasificar ──
    const grupos = {};
    const playoffs = [];

    _partidos.forEach(p => {
      const fase = (p.fase || '').trim();
      const m = fase.match(/^(?:Grupo\s*)?([A-L])$/i);
      if (m) {
        const l = m[1].toUpperCase();
        if (!grupos[l]) grupos[l] = [];
        grupos[l].push(p);
      } else {
        playoffs.push(p);
      }
    });

    let html = '';

    // ── Grupos ──
    const letras = Object.keys(grupos).sort();
    if (letras.length > 0) {
      html += `<div class="prode-section-header">
        <div class="prode-section-title">Fase de Grupos</div>
        <div class="prode-section-badge">GRUPOS</div>
        <div class="prode-section-line"></div>
      </div>`;
      letras.forEach(l => {
        html += `<div class="prode-group-block" data-group="${l}">
          <div class="prode-group-label">Grupo ${l}</div>
          <div class="prode-matches-grid">
            ${grupos[l].map(p => _cardHTML(p)).join('')}
          </div>
        </div>`;
      });
    }

    // ── Playoffs ──
    if (playoffs.length > 0) {
      // Agrupar por fase
      const fases = {};
      playoffs.forEach(p => {
        const f = p.fase || 'Por definirse';
        if (!fases[f]) fases[f] = [];
        fases[f].push(p);
      });

      html += `<div class="prode-section-header" style="margin-top:40px">
        <div class="prode-section-title">Playoffs</div>
        <div class="prode-section-badge">ELIMINATORIAS</div>
        <div class="prode-section-line"></div>
      </div>`;

      Object.entries(fases).forEach(([fase, pds]) => {
        html += `<div class="prode-group-block" data-group="${fase}">
          <div class="prode-group-label">${fase}</div>
          <div class="prode-matches-grid">
            ${pds.map(p => _cardHTML(p)).join('')}
          </div>
        </div>`;
      });
    }

    cont.innerHTML = html;
    _attachInputListeners();
  }

  // ──────────────────────────────────────────────────────────────
  // HTML de cada tarjeta de partido
  // ──────────────────────────────────────────────────────────────
  function _cardHTML(p) {
    const pred = _preds[p.id] || null;
    const bloqueado = esBloqueado(p);
    const finalizado = (p.estado || '').toLowerCase() === 'finalizado';

    // Fecha / hora
    const fecha = new Date(p.fecha_utc);
    const fechaStr = fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
    const horaStr = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    // Clases de la card
    let cardCls = 'prode-match-card';
    if (bloqueado) cardCls += ' card--locked';
    if (pred) cardCls += ' card--saved';

    // Badge estado
    let statusBadge;
    if (finalizado) statusBadge = `<span class="pmc-status pmc-status--finished">✅ Finalizado</span>`;
    else if ((p.estado || '') === 'en_curso') statusBadge = `<span class="pmc-status pmc-status--locked">🔴 En Vivo</span>`;
    else if (bloqueado) statusBadge = `<span class="pmc-status pmc-status--locked">🔒 Bloqueado</span>`;
    else statusBadge = `<span class="pmc-status pmc-status--open">✏️ Abierto</span>`;

    // Escudos
    const shieldL = p.escudo_local
      ? `<img class="pmc-shield" src="${p.escudo_local}" alt="${p.equipo_local}" onerror="this.style.display='none'">`
      : `<div class="pmc-shield-fallback">⚽</div>`;
    const shieldV = p.escudo_visitante
      ? `<img class="pmc-shield" src="${p.escudo_visitante}" alt="${p.equipo_visitante}" onerror="this.style.display='none'">`
      : `<div class="pmc-shield-fallback">⚽</div>`;

    // Valores de inputs
    const valL = pred !== null ? pred.local : '';
    const valV = pred !== null ? pred.visitante : '';
    const dis = bloqueado ? 'disabled' : '';
    const inputCls = pred ? 'pmc-input input--saved' : 'pmc-input';

    // Resultado real
    let resultHTML = '';
    if (finalizado && p.goles_local !== null) {
      resultHTML = `<div class="pmc-result">
        <span class="pmc-result-label">FT</span>
        <span class="pmc-result-score">${p.goles_local} – ${p.goles_visitante}</span>
      </div>`;
    }

    // Footer: puntos
    let footerHTML = '';
    if (finalizado && pred) {
      const r = calcPts(pred.local, pred.visitante, p.goles_local, p.goles_visitante);
      const pts = r.puntos ?? 0;
      const ptsCls = pts === 3 ? 'pts--3' : pts === 1 ? 'pts--1' : 'pts--0';
      const ptsLbl = pts === 3 ? '¡Exacto!' : pts === 1 ? 'Signo OK' : 'Fallaste';
      const bonus = pred.bonusAplicado ? `<span class="pmc-bonus-badge">⭐ +5 BONUS</span>` : '';
      footerHTML = `<div class="pmc-footer">
        <div class="pmc-points">
          <span class="pmc-points-val ${ptsCls}">${pts}</span>
          <span class="pmc-points-label">pts · ${ptsLbl}</span>
        </div>${bonus}
      </div>`;
    } else if (bloqueado && !finalizado) {
      footerHTML = `<div class="pmc-footer">
        <div class="pmc-lock-msg">🔒 Cerrado — el partido está próximo o en curso</div>
      </div>`;
    } else {
      footerHTML = `<div class="pmc-footer">
        <div class="pmc-points">
          <span class="pmc-points-val pts--null">—</span>
          <span class="pmc-points-label">pts · Pendiente</span>
        </div>
      </div>`;
    }

    return `
      <div class="${cardCls}"
           data-id="${p.id}"
           data-search="${(p.equipo_local + ' ' + p.equipo_visitante).toLowerCase()}">
        <div class="pmc-header">
          <div>
            <div class="pmc-date">${fechaStr} · ${horaStr}h</div>
            <div class="pmc-phase">${p.fase || 'Grupos'}</div>
          </div>
          ${statusBadge}
        </div>
        <div class="pmc-body">
          <div class="pmc-team">
            ${shieldL}
            <div class="pmc-team-name">${p.equipo_local}</div>
          </div>
          <div class="pmc-center">
            ${resultHTML}
            <div class="pmc-inputs">
              <input type="number" class="${inputCls}"
                id="prd-l-${p.id}" data-partido="${p.id}" data-side="local"
                value="${valL}" min="0" max="99" ${dis} placeholder="—"
                aria-label="Goles ${p.equipo_local}">
              <span class="pmc-dash">–</span>
              <input type="number" class="${inputCls}"
                id="prd-v-${p.id}" data-partido="${p.id}" data-side="visitante"
                value="${valV}" min="0" max="99" ${dis} placeholder="—"
                aria-label="Goles ${p.equipo_visitante}">
            </div>
            <div class="pmc-vs">VS</div>
          </div>
          <div class="pmc-team">
            ${shieldV}
            <div class="pmc-team-name">${p.equipo_visitante}</div>
          </div>
        </div>
        ${footerHTML}
      </div>`;
  }

  // ──────────────────────────────────────────────────────────────
  // Listeners de inputs
  // ──────────────────────────────────────────────────────────────
  function _attachInputListeners() {
    const cont = document.getElementById('prode-predictions-content');
    if (!cont) return;

    cont.addEventListener('input', e => {
      if (!e.target.classList.contains('pmc-input')) return;
      const pid = e.target.dataset.partido;
      if (!pid) return;

      // Validar rango
      let v = parseInt(e.target.value, 10);
      if (isNaN(v) || v < 0) { e.target.value = ''; return; }
      if (v > 99) { e.target.value = 99; }

      _pendientes.add(pid);
      _actualizarFAB();

      // Marcar card con borde dorado (pendiente de guardar)
      const card = cont.querySelector(`.prode-match-card[data-id="${pid}"]`);
      if (card) card.style.borderColor = 'var(--gold)';
    });
  }

  // ══════════════════════════════════════════════════════════════
  // GUARDAR PREDICCIONES (batch upsert)
  // ══════════════════════════════════════════════════════════════
  function _bindSaveButton() {
    const btn = document.getElementById('prode-save-fab');
    if (!btn) return;
    btn.addEventListener('click', prodeGuardar);
  }

  async function prodeGuardar() {
    if (!_uid || !sb()) { prodeToast('Necesitás iniciar sesión.', 'error'); return; }
    if (_pendientes.size === 0) { prodeToast('Nada que guardar aún.', 'error'); return; }

    const btn = document.getElementById('prode-save-fab');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="fab-icon">⏳</span> Guardando...'; }

    const filas = [];
    for (const pid of _pendientes) {
      const inputL = document.getElementById(`prd-l-${pid}`);
      const inputV = document.getElementById(`prd-v-${pid}`);
      if (!inputL || !inputV) continue;
      const vL = parseInt(inputL.value, 10);
      const vV = parseInt(inputV.value, 10);
      if (isNaN(vL) || isNaN(vV)) continue;
      filas.push({
        partido_id: pid,
        user_id: _uid,
        pred_goles_local: vL,
        pred_goles_visitante: vV,
        updated_at: new Date().toISOString(),
      });
    }

    if (filas.length === 0) {
      prodeToast('Completá los dos campos de cada partido.', 'error');
      _resetFAB();
      return;
    }

    try {
      const { error } = await sb()
        .from('prode_predictions')
        .upsert(filas, { onConflict: 'partido_id,user_id' });
      if (error) throw error;

      // Actualizar caché local y marcar cards como guardadas
      const cont = document.getElementById('prode-predictions-content');
      filas.forEach(f => {
        _preds[f.partido_id] = { local: f.pred_goles_local, visitante: f.pred_goles_visitante, puntos: null, bonusAplicado: false };
        if (cont) {
          const card = cont.querySelector(`.prode-match-card[data-id="${f.partido_id}"]`);
          if (card) {
            card.classList.add('card--saved');
            card.style.borderColor = '';
            card.querySelectorAll('.pmc-input').forEach(inp => inp.classList.add('input--saved'));
          }
        }
      });

      _pendientes.clear();
      prodeToast(`${filas.length} predicción${filas.length !== 1 ? 'es' : ''} guardada${filas.length !== 1 ? 's' : ''} ✅`);

    } catch (err) {
      console.error('[Prode] Error al guardar:', err);
      prodeToast('Error al guardar. Intentá de nuevo.', 'error');
    }

    _resetFAB();
    _actualizarFAB();
  }

  function _actualizarFAB() {
    const btn = document.getElementById('prode-save-fab');
    const cnt = document.getElementById('prode-fab-count');
    if (cnt) cnt.textContent = _pendientes.size;
    if (btn) btn.style.display = _pendientes.size > 0 ? 'flex' : 'none';
  }

  function _resetFAB() {
    const btn = document.getElementById('prode-save-fab');
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = `<span class="fab-icon">💾</span> Guardar Predicciones <span class="prode-fab-count" id="prode-fab-count">${_pendientes.size}</span>`;
  }

  // ══════════════════════════════════════════════════════════════
  // BUSCADOR POR PAÍS
  // ══════════════════════════════════════════════════════════════
  function _bindSearchBar() {
    const inp = document.getElementById('prode-search');
    if (!inp) return;
    let t;
    inp.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => _filtrarCards(inp.value.trim().toLowerCase()), 200);
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Escape') { inp.value = ''; _filtrarCards(''); }
    });
  }

  function _filtrarCards(q) {
    const cards = document.querySelectorAll('#prode-predictions-content .prode-match-card');
    let visible = 0;
    cards.forEach(c => {
      const match = !q || (c.dataset.search || '').includes(q);
      c.classList.toggle('card--hidden', !match);
      if (match) visible++;
    });

    // Ocultar grupos vacíos
    document.querySelectorAll('#prode-predictions-content .prode-group-block').forEach(b => {
      const shown = b.querySelectorAll('.prode-match-card:not(.card--hidden)').length;
      b.style.display = shown === 0 ? 'none' : '';
    });

    const nr = document.getElementById('prode-no-results');
    if (nr) nr.style.display = visible === 0 && q ? 'block' : 'none';
  }

  // ══════════════════════════════════════════════════════════════
  // SUB-TABS (expuesto globalmente)
  // ══════════════════════════════════════════════════════════════
  window.prodeChangeSubTab = function (tab) {
    document.querySelectorAll('.prode-sub-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.prode-subpanel').forEach(p => p.classList.toggle('active', p.id === `prode-${tab}-panel`));

    // Ocultar FAB si no estamos en predicciones
    const fab = document.getElementById('prode-save-fab');
    if (fab) fab.style.display = (tab === 'predictions' && _pendientes.size > 0) ? 'flex' : 'none';

    // Cargar comunidades al entrar
    if (tab === 'communities') _renderComunidades();
  };

  // ══════════════════════════════════════════════════════════════
  // COMUNIDADES
  // ══════════════════════════════════════════════════════════════
  async function _renderComunidades() {
    if (!_uid || !sb()) return;

    // Bindear botones de crear / unirse (solo una vez)
    _bindComunidadBtns();

    await _cargarMisGrupos();
    await _cargarRankingGlobal();
  }

  function _bindComunidadBtns() {
    // Ya no hacemos bind acá, se usa onclick="crearComunidad()" en el HTML
  }

  // ──────────────────────────────────────────────────────────────
  // CREAR GRUPO
  // ──────────────────────────────────────────────────────────────
  window.crearComunidad = async function () {
    // 1. Validaciones explícitas según requerimiento
    if (!window.supabaseClient || !window.__mundialitoUserId) {
      alert("Error de sesión: No se pudo verificar tu usuario o la conexión a la base de datos.");
      return;
    }

    const nombre = (document.getElementById('prode-nuevo-grupo')?.value || '').trim();
    const esPublic = document.getElementById('new-group-public')?.checked || false;
    const msgId = 'create-group-msg';

    if (nombre.length < 2) {
      prodeSetMsg(msgId, 'El nombre debe tener al menos 2 caracteres.', 'error');
      return;
    }

    const btn = document.getElementById('btn-create-group');
    if (btn) { btn.disabled = true; btn.textContent = 'Creando...'; }

    try {
      // Data a insertar - Generamos IDs en frontend para saltar el bug de .select()
      const generatedId = crypto.randomUUID();
      const generatedInvite = Math.random().toString(36).substring(2, 8).toUpperCase();

      const insertData = {
        id: generatedId,
        invite_code: generatedInvite,
        nombre,
        admin_id: window.__mundialitoUserId,
        es_publico: esPublic
      };
      console.log('[Prode] Intentando crear comunidad. Data:', insertData);

      // 1. Insertar el grupo SIN .select() para evitar disparar la política recursiva de SELECT
      const { error: errGrupo } = await sb()
        .from('prode_groups')
        .insert(insertData);

      if (errGrupo) throw errGrupo;

      const memberData = { group_id: generatedId, user_id: window.__mundialitoUserId };
      console.log('[Prode] Comunidad creada. Intentando auto-unirse como admin. Data:', memberData);

      // 2. Auto-unirse como admin/miembro
      const { error: errMiembro } = await sb()
        .from('prode_group_members')
        .insert(memberData);

      // Ignoramos el error 23505 (Duplicate Key) porque si salta en una PK nueva, 
      // significa que tienes un Trigger en tu base de datos que ya insertó al admin automáticamente.
      if (errMiembro && errMiembro.code !== '23505') throw errMiembro;

      // 3. Mostrar código de invitación
      prodeSetMsg(msgId,
        `✅ Grupo "${insertData.nombre}" creado. Código de invitación: ${insertData.invite_code}`,
        'success');
      document.getElementById('prode-nuevo-grupo').value = '';

      // 4. Refrescar lista de grupos
      setTimeout(() => _cargarMisGrupos(), 600);

    } catch (err) {
      console.error('[Prode] Error crítico creando comunidad:', err);
      alert("Error: " + err.message);
      prodeSetMsg(msgId, err.message || 'Error al crear el grupo.', 'error');
    }

    if (btn) { btn.disabled = false; btn.textContent = 'Crear Grupo'; }
  };

  // ──────────────────────────────────────────────────────────────
  // UNIRSE A UN GRUPO CON CÓDIGO
  // ──────────────────────────────────────────────────────────────
  window.unirseComunidad = async function () {
    // Validaciones explícitas
    if (!window.supabaseClient || !window.__mundialitoUserId) {
      alert("Error de sesión: No se pudo verificar tu usuario o la conexión a la base de datos.");
      return;
    }

    const codigo = (document.getElementById('join-group-code')?.value || '').trim().toUpperCase();
    const msgId = 'join-group-msg';

    if (codigo.length !== 6) { prodeSetMsg(msgId, 'El código debe tener exactamente 6 caracteres.', 'error'); return; }

    const btn = document.getElementById('btn-join-group');
    if (btn) { btn.disabled = true; btn.textContent = 'Buscando...'; }

    try {
      console.log(`[Prode] Intentando unirse al grupo con código: ${codigo}`);

      // 1. Buscar el grupo por invite_code
      const { data: grupo, error: errFind } = await sb()
        .from('prode_groups')
        .select('id, nombre')
        .eq('invite_code', codigo)
        .single();

      if (errFind || !grupo) {
        prodeSetMsg(msgId, 'Código inválido. Revisá y volvé a intentar.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Unirse al Grupo'; }
        return;
      }

      // 2. Verificar que no sea ya miembro
      const { data: ya } = await sb()
        .from('prode_group_members')
        .select('group_id')
        .eq('group_id', grupo.id)
        .eq('user_id', window.__mundialitoUserId)
        .maybeSingle();

      if (ya) {
        prodeSetMsg(msgId, `Ya sos miembro de "${grupo.nombre}".`, 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Unirse al Grupo'; }
        return;
      }

      // 2.5 Verificar límite de miembros (máx 25)
      const { count, error: errCount } = await sb()
        .from('prode_group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', grupo.id);

      if (errCount) {
        prodeSetMsg(msgId, 'Error al verificar la capacidad del grupo.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Unirse al Grupo'; }
        return;
      }

      if (count >= 25) {
        prodeSetMsg(msgId, 'El grupo ya alcanzó el límite máximo de 25 participantes.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Unirse al Grupo'; }
        return;
      }

      const joinData = { group_id: grupo.id, user_id: window.__mundialitoUserId };
      console.log(`[Prode] Insertando nuevo miembro en prode_group_members. Data:`, joinData);

      // 3. Unirse
      const { error: errJoin } = await sb()
        .from('prode_group_members')
        .insert(joinData);

      if (errJoin) throw errJoin;

      prodeSetMsg(msgId, `✅ Te uniste a "${grupo.nombre}"!`, 'success');
      document.getElementById('join-group-code').value = '';
      setTimeout(() => _cargarMisGrupos(), 600);

    } catch (err) {
      console.error('[Prode] Error crítico uniéndose al grupo:', err);
      alert("Error: " + err.message);
      prodeSetMsg(msgId, err.message || 'Error al unirse al grupo.', 'error');
    }

    if (btn) { btn.disabled = false; btn.textContent = 'Unirse al Grupo'; }
  };

  // ──────────────────────────────────────────────────────────────
  // CARGAR MIS GRUPOS + RANKING DE CADA UNO
  // ──────────────────────────────────────────────────────────────
  async function _cargarMisGrupos() {
    const cont = document.getElementById('prode-my-groups-list');
    if (!cont) return;

    cont.innerHTML = `<div style="color:var(--text4);font-size:13px;padding:14px 0">Cargando grupos...</div>`;

    try {
      const { data, error } = await sb()
        .from('prode_group_members')
        .select(`
          group_id,
          prode_groups!prode_group_members_group_id_fkey ( id, nombre, invite_code, es_publico, admin_id, created_at )
        `)
        .eq('user_id', window.__mundialitoUserId);

      if (error) {
        console.error("Error cargando comunidades:", error);
        alert("Error al cargar tus grupos: " + error.message);
        return;
      }

      console.log("Comunidades recibidas:", data);

      // Si Supabase devuelve un arreglo dentro de prode_groups, extraemos el primer elemento.
      const grupos = (data || []).map(r => {
        if (Array.isArray(r.prode_groups)) return r.prode_groups[0];
        return r.prode_groups;
      }).filter(Boolean);

      // Badge contador
      const badge = document.getElementById('prode-groups-count');
      if (badge) badge.textContent = `${grupos.length} grupo${grupos.length !== 1 ? 's' : ''}`;

      if (grupos.length === 0) {
        cont.innerHTML = `<div class="prode-empty" style="padding:30px 0">
          <span class="prode-empty-icon">👥</span>
          <div class="prode-empty-title">Sin grupos todavía</div>
          <div class="prode-empty-sub">Creá tu propio grupo o pedile el código a un amigo.</div>
        </div>`;
        return;
      }

      // Para cada grupo, cargar miembros y renderizar card
      const cards = await Promise.all(grupos.map(g => _grupoCardHTML(g)));
      cont.innerHTML = cards.join('');

      // Bind de botones de admin/copy dentro de las cards
      _bindGrupoCardBtns();

    } catch (err) {
      console.error('[Prode] Error cargando grupos:', err);
      cont.innerHTML = `<div style="color:#ff6680;font-size:13px;padding:14px 0">Error cargando grupos.</div>`;
    }
  }

  async function _grupoCardHTML(g) {
    const esAdmin = g.admin_id === _uid;

    // Miembros + puntos
    const { data: miembros } = await sb()
      .from('prode_group_members')
      .select(`
        user_id,
        profiles ( id, username, avatar_url, puntos_prode, aciertos_exactos, aciertos_signo )
      `)
      .eq('group_id', g.id);

    const members = ((miembros || []).map(m => m.profiles).filter(Boolean))
      .sort((a, b) => (b.puntos_prode || 0) - (a.puntos_prode || 0));

    const visiBadge = g.es_publico
      ? `<span class="group-visibility-badge badge--public">🌐 Público</span>`
      : `<span class="group-visibility-badge badge--private">🔒 Privado</span>`;
    const adminBadge = esAdmin ? `<span class="group-visibility-badge badge--admin">⭐ Admin</span>` : '';

    const renderMemberRow = (m, i) => {
      const posCls = i === 0 ? 'pos-1' : i === 1 ? 'pos-2' : i === 2 ? 'pos-3' : '';
      const isMe = m.id === _uid;
      const avatar = m.avatar_url
        ? `<img class="grr-avatar" src="${m.avatar_url}" alt="${m.username}" onerror="this.style.display='none'">`
        : `<div class="grr-avatar-fallback">👤</div>`;

      const kickBtn = (esAdmin && !isMe)
        ? `<button class="group-admin-btn btn--danger prode-kick-btn"
              data-group="${g.id}" data-user="${m.id}" data-name="${m.username || 'este usuario'}"
              style="padding:3px 8px;font-size:10px;margin-left:auto">🚫</button>`
        : '';

      return `<div class="group-ranking-row" id="mbr-${g.id}-${m.id}">
        <span class="grr-pos ${posCls}">${i + 1}</span>
        ${avatar}
        <span class="grr-name ${isMe ? 'is-me' : ''}">${m.username || 'Anónimo'}${isMe ? ' (vos)' : ''}</span>
        <span class="grr-exactos">🎯 ${m.aciertos_exactos || 0}</span>
        <span class="grr-pts">${m.puntos_prode || 0}</span>
        ${kickBtn}
      </div>`;
    };

    const visibleMembersHTML = members.slice(0, 5).map((m, i) => renderMemberRow(m, i)).join('');
    const hiddenMembersHTML = members.slice(5).map((m, i) => renderMemberRow(m, i + 5)).join('');

    let membersHTML = visibleMembersHTML;
    if (members.length > 5) {
      membersHTML += `
        <div class="prode-ver-mas-container">
          <button class="community-btn btn--secondary" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 6px;" onclick="this.parentElement.nextElementSibling.style.display='block'; this.parentElement.style.display='none';">Ver más (${members.length - 5})</button>
        </div>
        <div style="display: none;">
          ${hiddenMembersHTML}
        </div>
      `;
    }

    const adminActsHTML = esAdmin ? `
      <div class="group-admin-actions">
        <button class="group-admin-btn prode-edit-name-btn" data-group="${g.id}" data-name="${(g.nombre).replace(/'/g, "\\'")}">
          ✏️ Editar nombre
        </button>
        <button class="group-admin-btn prode-toggle-public-btn"
            data-group="${g.id}" data-public="${g.es_publico}">
          ${g.es_publico ? '🔒 Hacer privado' : '🌐 Hacer público'}
        </button>
        <button class="group-admin-btn" style="background-color: var(--primary); color: white; margin-top: 8px; width: 100%; border-radius: 4px;" onclick="window.eliminarComunidad('${g.id}')">
          🗑️ Eliminar Comunidad
        </button>
      </div>` : '';

    return `
      <div class="group-card" id="group-card-${g.id}">
        <div class="group-card-header">
          <div class="group-card-name">${g.nombre}</div>
          <div class="group-card-meta">${visiBadge}${adminBadge}</div>
        </div>
        <div class="group-card-body">
          <div class="invite-code-display prode-copy-code" data-code="${g.invite_code}" title="Clic para copiar">
            <span class="invite-code-val">${g.invite_code}</span>
            <span class="invite-code-copy">📋</span>
          </div>
          <div style="font-size:11px;color:var(--text4);margin-bottom:12px">
            Compartí este código · ${members.length}/25 miembros
          </div>
          <div class="group-ranking-table">
            ${membersHTML || '<div style="color:var(--text4);font-size:13px;padding:8px 0">Sin miembros.</div>'}
          </div>
          ${adminActsHTML}
        </div>
      </div>`;
  }

  function _bindGrupoCardBtns() {
    // Copiar código
    document.querySelectorAll('.prode-copy-code').forEach(el => {
      if (el._bound) return; el._bound = true;
      el.addEventListener('click', () => {
        const code = el.dataset.code;
        navigator.clipboard.writeText(code)
          .then(() => prodeToast(`Código ${code} copiado 📋`))
          .catch(() => prodeToast(`Código: ${code}`));
      });
    });

    // Expulsar miembro
    document.querySelectorAll('.prode-kick-btn').forEach(btn => {
      if (btn._bound) return; btn._bound = true;
      btn.addEventListener('click', async () => {
        const { group, user, name } = btn.dataset;
        if (!confirm(`¿Expulsar a "${name}" del grupo?`)) return;
        try {
          const { error } = await sb()
            .from('prode_group_members')
            .delete()
            .eq('group_id', group)
            .eq('user_id', user);
          if (error) throw error;
          const row = document.getElementById(`mbr-${group}-${user}`);
          if (row) { row.style.animation = 'slideOut .3s ease forwards'; setTimeout(() => row.remove(), 320); }
          prodeToast(`${name} fue expulsado.`);
        } catch (err) { prodeToast('Error al expulsar.', 'error'); }
      });
    });

    // Editar nombre
    document.querySelectorAll('.prode-edit-name-btn').forEach(btn => {
      if (btn._bound) return; btn._bound = true;
      btn.addEventListener('click', async () => {
        const { group, name } = btn.dataset;
        const nuevo = prompt(`Nuevo nombre (actual: "${name}"):`, name);
        if (!nuevo || nuevo.trim().length < 2 || nuevo.trim() === name) return;
        try {
          const { error } = await sb()
            .from('prode_groups')
            .update({ nombre: nuevo.trim(), updated_at: new Date().toISOString() })
            .eq('id', group).eq('admin_id', _uid);
          if (error) throw error;
          const card = document.getElementById(`group-card-${group}`);
          if (card) card.querySelector('.group-card-name').textContent = nuevo.trim();
          prodeToast('Nombre actualizado.');
        } catch (err) { prodeToast('Error al actualizar nombre.', 'error'); }
      });
    });

    // Toggle público/privado
    document.querySelectorAll('.prode-toggle-public-btn').forEach(btn => {
      if (btn._bound) return; btn._bound = true;
      btn.addEventListener('click', async () => {
        const { group } = btn.dataset;
        const actual = btn.dataset.public === 'true';
        const nuevo = !actual;
        try {
          const { error } = await sb()
            .from('prode_groups')
            .update({ es_publico: nuevo, updated_at: new Date().toISOString() })
            .eq('id', group).eq('admin_id', _uid);
          if (error) throw error;
          btn.dataset.public = nuevo;
          btn.textContent = nuevo ? '🔒 Hacer privado' : '🌐 Hacer público';
          const card = document.getElementById(`group-card-${group}`);
          if (card) {
            const badge = card.querySelector('.group-visibility-badge.badge--public, .group-visibility-badge.badge--private');
            if (badge) {
              badge.className = `group-visibility-badge ${nuevo ? 'badge--public' : 'badge--private'}`;
              badge.textContent = nuevo ? '🌐 Público' : '🔒 Privado';
            }
          }
          prodeToast(`Grupo ahora es ${nuevo ? 'público' : 'privado'}.`);
        } catch (err) { prodeToast('Error al cambiar visibilidad.', 'error'); }
      });
    });
  }

  // ──────────────────────────────────────────────────────────────
  // ELIMINAR COMUNIDAD
  // ──────────────────────────────────────────────────────────────
  window.eliminarComunidad = async function (groupId) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta comunidad? Esta acción no se puede deshacer.")) return;

    try {
      // 1. Eliminar a los miembros primero por restricción de Foreign Key
      const { error: errMembers } = await window.supabaseClient
        .from('prode_group_members')
        .delete()
        .eq('group_id', groupId);
      if (errMembers) throw errMembers;

      // 2. Eliminar el grupo
      const { error: errGroup } = await window.supabaseClient
        .from('prode_groups')
        .delete()
        .eq('id', groupId);
      if (errGroup) throw errGroup;

      alert("Comunidad eliminada");
      _cargarMisGrupos();
    } catch (err) {
      console.error("[Prode] Error eliminando comunidad:", err);
      alert("Error al eliminar comunidad: " + err.message);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // RANKING GLOBAL (top 50 -> Paginado)
  // ──────────────────────────────────────────────────────────────
  let _rankingOffset = 0;
  const _RANKING_LIMIT = 10;

  async function _cargarRankingGlobal(append = false) {
    const cont = document.getElementById('prode-global-ranking-cont');
    if (!cont) return;

    if (!append) {
      _rankingOffset = 0;
    }

    try {
      const btn = document.getElementById('btn-load-more-ranking-app');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Cargando...';
      }

      const { data, error } = await sb()
        .from('profiles')
        .select('id, username, avatar_url, puntos_prode, aciertos_exactos, aciertos_signo')
        .order('puntos_prode', { ascending: false })
        .range(_rankingOffset, _rankingOffset + _RANKING_LIMIT - 1);

      if (error) throw error;

      if (!data || data.length === 0) {
        if (!append) {
          cont.innerHTML = `<div style="color:var(--text4);font-size:13px;padding:14px 0">Sin datos de ranking aún.</div>`;
        } else {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Ver menos';
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
              _cargarRankingGlobal(false);
            });
          }
        }
        return;
      }

      const rows = data.map((p, i) => {
        const pos = _rankingOffset + i + 1;
        const posCls = pos === 1 ? 'pos-1' : pos === 2 ? 'pos-2' : pos === 3 ? 'pos-3' : '';
        const isMe = p.id === _uid;
        const avatar = p.avatar_url
          ? `<img class="grt-avatar" src="${p.avatar_url}" alt="${p.username}" onerror="this.style.display='none'">`
          : `<div class="grt-avatar-fallback">👤</div>`;
        const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos;
        return `<div class="grt-row ${isMe ? 'row--me' : ''}">
          <span class="grt-pos ${posCls}">${medal}</span>
          ${avatar}
          <span class="grt-name ${isMe ? 'is-me' : ''}">${p.username || 'Anónimo'}${isMe ? ' ★' : ''}</span>
          <span class="grt-pts">${p.puntos_prode || 0}</span>
          <span class="grt-exactos">🎯 ${p.aciertos_exactos || 0}</span>
          <span class="grt-signo">⚖️ ${p.aciertos_signo || 0}</span>
        </div>`;
      }).join('');

      const hasMore = data.length === _RANKING_LIMIT;
      const btnHtml = hasMore
        ? `<button id="btn-load-more-ranking-app" class="community-btn btn--secondary" style="margin-top: 15px; width: 100%;">Ver más</button>`
        : '';

      if (!append) {
        cont.innerHTML = `
          <div class="global-ranking-table">
            <div class="grt-header">
              <span>#</span><span></span>
              <span>Usuario</span>
              <span style="text-align:center">Pts</span>
              <span style="text-align:center">Exactos</span>
              <span style="text-align:center">Signo</span>
            </div>
            <div id="global-ranking-rows-app">
              ${rows}
            </div>
          </div>
          ${btnHtml}`;
      } else {
        const rowsCont = document.getElementById('global-ranking-rows-app');
        if (rowsCont) rowsCont.insertAdjacentHTML('beforeend', rows);

        if (btn) {
          if (!hasMore) {
            btn.disabled = false;
            btn.textContent = 'Ver menos';
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
              _cargarRankingGlobal(false);
            });
          } else {
            btn.disabled = false;
            btn.textContent = 'Ver más';
          }
        }
      }

      if (!append && hasMore) {
        const newBtn = document.getElementById('btn-load-more-ranking-app');
        if (newBtn) {
          newBtn.addEventListener('click', () => {
            _rankingOffset += _RANKING_LIMIT;
            _cargarRankingGlobal(true);
          });
        }
      }

    } catch (err) {
      console.error('[Prode] Error cargando ranking global:', err);
      const btn = document.getElementById('btn-load-more-ranking-app');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Error, reintentar';
      }
    }
  }

})(); // fin IIFE Prode

/* ══════════════════════════════════════════════════════════════════
   HIGHERLOWER_04_js.js
   DÓNDE: al final de Frontend/app.js
   ══════════════════════════════════════════════════════════════════

   IMPORTANTE: el uso de localStorage aquí es INTENCIONAL y necesario.
   Este archivo NO corre dentro de un Artifact de Claude —
   corre en el navegador del usuario final como parte del proyecto.
   localStorage es perfectamente válido en este contexto.
   ══════════════════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────────────────────────────
   BASE DE DATOS DEL JUEGO
   Cada entidad tiene: nombre, tipo, imagen (URL o emoji de respaldo),
   y un objeto 'stats' con sus métricas.

   Para agregar imágenes de fondo reales, reemplazá image_url
   con una URL directa (ej: escudo de la selección en tamaño grande,
   o una foto de estadio).
──────────────────────────────────────────────────────────────────── */
const HL_DATA = {

  /* ── SELECCIONES ── */
  selecciones: [
    { name: 'Argentina', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/1280px-Flag_of_Argentina.svg.png', stats: { mundiales_ganados: 3, goles_mundiales: 137, participaciones: 18, copas_jugadas: 18 } },
    { name: 'Brasil', type: 'SELECCIÓN', image_url: 'https://img.magnific.com/foto-gratis/composicion-bandera-brasilena_23-2150169446.jpg?semt=ais_hybrid&w=740&q=80', stats: { mundiales_ganados: 5, goles_mundiales: 229, participaciones: 22, copas_jugadas: 22 } },
    { name: 'Alemania', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg', stats: { mundiales_ganados: 4, goles_mundiales: 226, participaciones: 20, copas_jugadas: 20 } },
    { name: 'Francia', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ensign_of_France.svg/250px-Ensign_of_France.svg.png', stats: { mundiales_ganados: 2, goles_mundiales: 120, participaciones: 16, copas_jugadas: 16 } },
    { name: 'Italia', type: 'SELECCIÓN', image_url: 'https://static.vecteezy.com/system/resources/previews/041/930/718/non_2x/flat-illustration-of-italy-national-flag-italy-flag-design-italy-wave-flag-free-vector.jpg', stats: { mundiales_ganados: 4, goles_mundiales: 128, participaciones: 18, copas_jugadas: 18 } },
    { name: 'España', type: 'SELECCIÓN', image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnCAMAAAAPIrEmAAAADFBMVEX6vQCtFRnGTRHIYmWmYosvAAAAlElEQVR4nO3cAQ3AMBDEsF/Ln/NgvKrYCC4Ebr6s2R6wR3qR9CLpRdKLpBdJL5JeJL1IepH0IulF0oukF0kvkl4kvUh6kfQi6UXl9JM1AAAAAAAAAAAAAAAAAAAAAAAAAADP2z633CO9SHqR9CLpRdKLpBdJL5JeJL1IepH0IulF0oukF0kvkl4kvUh6kfQi6UVzs34nvVT34eIO6gAAAABJRU5ErkJggg==', stats: { mundiales_ganados: 1, goles_mundiales: 98, participaciones: 16, copas_jugadas: 16 } },
    { name: 'Uruguay', type: 'SELECCIÓN', image_url: 'https://conocelasbanderas.com/wp-content/uploads/2018/04/Bandera-de-Uruguay-1-1024x576.png', stats: { mundiales_ganados: 2, goles_mundiales: 88, participaciones: 14, copas_jugadas: 14 } },
    { name: 'Países Bajos', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg', stats: { mundiales_ganados: 0, goles_mundiales: 82, participaciones: 11, copas_jugadas: 11 } },
    { name: 'Portugal', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg', stats: { mundiales_ganados: 0, goles_mundiales: 45, participaciones: 8, copas_jugadas: 8 } },
    { name: 'Inglaterra', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg', stats: { mundiales_ganados: 1, goles_mundiales: 79, participaciones: 16, copas_jugadas: 16 } },
    { name: 'México', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg', stats: { mundiales_ganados: 0, goles_mundiales: 63, participaciones: 17, copas_jugadas: 17 } },
    { name: 'Colombia', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg', stats: { mundiales_ganados: 0, goles_mundiales: 28, participaciones: 7, copas_jugadas: 7 } },
    { name: 'Croacia', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg', stats: { mundiales_ganados: 0, goles_mundiales: 28, participaciones: 6, copas_jugadas: 6 } },
    { name: 'Marruecos', type: 'SELECCIÓN', image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg', stats: { mundiales_ganados: 0, goles_mundiales: 14, participaciones: 7, copas_jugadas: 7 } },
  ],

  /* ── ESTADIOS ── */
  estadios: [
    { name: 'MetLife Stadium', type: 'ESTADIO', image_url: 'https://prodebardo.com/news/77f44be2-7056-4683-9437-ec558a82e53c.png', stats: { capacidad: 82500, año_inauguracion: 2010, costo_millones_usd: 1600 } },
    { name: 'SoFi Stadium', type: 'ESTADIO', image_url: 'https://ca-times.brightspotcdn.com/dims4/default/1d18285/2147483647/strip/true/crop/4000x2667+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F67%2Fbb%2F2630f7f57255b508f7e20825dba2%2Fdcaab2b011a442dd86b5c5c3ada7b471', stats: { capacidad: 70240, año_inauguracion: 2020, costo_millones_usd: 5500 } },
    { name: 'AT&T Stadium', type: 'ESTADIO', image_url: 'https://images.copaamerica.com/editions/copa-america-2024/stadiums/att-stadium-photo.webp', stats: { capacidad: 80000, año_inauguracion: 2009, costo_millones_usd: 1150 } },
    { name: 'Estadio Azteca', type: 'ESTADIO', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg/1280px-Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg', stats: { capacidad: 87523, año_inauguracion: 1966, costo_millones_usd: 400 } },
    { name: 'Hard Rock Stadium', type: 'ESTADIO', image_url: 'https://archello.s3.eu-central-1.amazonaws.com/images/2020/06/19/hok-hard-rock-stadium-florida-usa-archello--8-.1592571084.9599.jpg', stats: { capacidad: 65326, año_inauguracion: 1987, costo_millones_usd: 600 } },
    { name: 'NRG Stadium', type: 'ESTADIO', image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Nrg_stadium.jpg', stats: { capacidad: 72220, año_inauguracion: 2002, costo_millones_usd: 352 } },
    { name: "Levi's Stadium", type: 'ESTADIO', image_url: 'https://media.admagazine.com/photos/69829971dea91f04e6ae7326/16:9/w_5472,h_3078,c_limit/GettyImages-2255009698.jpg', stats: { capacidad: 68500, año_inauguracion: 2014, costo_millones_usd: 1300 } },
    { name: 'BC Place', type: 'ESTADIO', image_url: 'https://images.spaicelabs.com/images/flus6j8v/production/37d069f71f67b4591905dfab4aa98bb4c9703e07-2048x1360.jpg?rect=0,143,2048,1075&w=1200&h=630', stats: { capacidad: 54500, año_inauguracion: 1983, costo_millones_usd: 514 } },
    { name: 'BMO Field', type: 'ESTADIO', image_url: 'https://static2.gensler.com/uploads/image/65575/project_BMO_large_01_1475515240.jpg', stats: { capacidad: 45736, año_inauguracion: 2007, costo_millones_usd: 62 } },
    { name: 'Estadio Akron', type: 'ESTADIO', image_url: 'https://www.infobae.com/new-resizer/6YWG0GaylQ-Y2tFBUg0sOS7c51s=/arc-anglerfish-arc2-prod-infobae/public/JCE3S3ZT55CD3BRYQDJ6QVDNBE.jpg', stats: { capacidad: 45000, año_inauguracion: 2010, costo_millones_usd: 160 } },
    { name: 'Estadio BBVA', type: 'ESTADIO', image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Estadio_BBVA_Bancomer_%281%29.jpg', stats: { capacidad: 53500, año_inauguracion: 2015, costo_millones_usd: 200 } },
    { name: 'Lincoln Financial', type: 'ESTADIO', image_url: 'https://s3.amazonaws.com/cdn.chatsports.com/wp-content/uploads/2014/07/stads/lincoln-feeld.jpg', stats: { capacidad: 69796, año_inauguracion: 2003, costo_millones_usd: 512 } },
    { name: 'Arrowhead Stadium', type: 'ESTADIO', image_url: 'https://a57.foxsports.com/statics.foxsports.com/www.foxsports.com/content/uploads/2024/02/1294/728/1da64565-chiefs1.jpg?ve=1&tl=1', stats: { capacidad: 76416, año_inauguracion: 1972, costo_millones_usd: 375 } },
  ],

  /* ── LEYENDAS (stats de carrera en mundiales) ── */
  leyendas: [
    { name: 'Miroslav Klose', type: 'LEYENDA', image_url: 'https://i0.wp.com/thesefootballtimes.co/wp-content/uploads/2016/05/klose.jpg?fit=4050%2C1904&ssl=1', stats: { goles_mundiales: 16, mundiales_jugados: 4, partidos_mundiales: 24, copas_ganadas: 1 } },
    { name: 'Ronaldo (Brasil)', type: 'LEYENDA', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8GhBNR4NdKlNiOQGWnrYP9WzCpNqgnyQJaA&s', stats: { goles_mundiales: 15, mundiales_jugados: 4, partidos_mundiales: 19, copas_ganadas: 2 } },
    { name: 'Gerd Müller', type: 'LEYENDA', image_url: 'https://noticiasnet1.cdn.net.ar/252/noticiasnet/images/01/56/85/1568586_b6aec616a4513e7b6788f87d4f69fbc583116d3e21c8d72a72e71df52809eea8/md.webp', stats: { goles_mundiales: 14, mundiales_jugados: 2, partidos_mundiales: 13, copas_ganadas: 1 } },
    { name: 'Just Fontaine', type: 'LEYENDA', image_url: 'https://images.ecestaticos.com/XRMVJSDZkfb-ZJZPtF_VEYm1_i4=/0x5:400x305/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Ff13%2Fd51%2Fa63%2Ff13d51a637c0ea0e412b83ad6dd72fda.jpg', stats: { goles_mundiales: 13, mundiales_jugados: 1, partidos_mundiales: 6, copas_ganadas: 0 } },
    { name: 'Pelé', type: 'LEYENDA', image_url: 'https://img.vavel.com/pele-1670369741960.webp', stats: { goles_mundiales: 12, mundiales_jugados: 4, partidos_mundiales: 14, copas_ganadas: 3 } },
    { name: 'Lionel Messi', type: 'LEYENDA', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/250px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg', stats: { goles_mundiales: 13, mundiales_jugados: 5, partidos_mundiales: 26, copas_ganadas: 1 } },
    { name: 'Jürgen Klinsmann', type: 'LEYENDA', image_url: 'https://cdn.britannica.com/37/275137-050-0CA1D775/Germany-forward-and-team-captain-Jurgen-Klinsmann-during-1998-World-Cup-July-1998.jpg?w=400&h=300&c=crop', stats: { goles_mundiales: 11, mundiales_jugados: 3, partidos_mundiales: 17, copas_ganadas: 1 } },
    { name: 'Gabriel Batistuta', type: 'LEYENDA', image_url: 'https://www.infobae.com/resizer/v2/https%3A%2F%2Fs3.amazonaws.com%2Farc-wordpress-client-uploads%2Finfobae-wp%2Fwp-content%2Fuploads%2F2016%2F06%2F12095828%2FGabriel-Batistuta-1920.jpg?auth=a81c969ffb8b7efdd168f44a71f0c98a68756b7c6772fd47d261607c6c54f0cc&smart=true&width=1200&height=900&quality=85', stats: { goles_mundiales: 10, mundiales_jugados: 3, partidos_mundiales: 12, copas_ganadas: 0 } },
    { name: 'Kylian Mbappé', type: 'LEYENDA', image_url: 'https://cdn.britannica.com/39/239139-050-49A950D1/French-soccer-player-Kylian-Mbappe-FIFA-World-Cup-December-10-2022.jpg', stats: { goles_mundiales: 12, mundiales_jugados: 2, partidos_mundiales: 14, copas_ganadas: 1 } },
    { name: 'Sándor Kocsis', type: 'LEYENDA', image_url: 'https://vision360-s3.cdn.net.ar/s3i233/2026/05/vision360/images/02/60/77/2607723_912b3059a039961ab34241e2edb117b1ac358cbed52f811a87ccf33be3e5b5bb/xs.webp', stats: { goles_mundiales: 11, mundiales_jugados: 1, partidos_mundiales: 5, copas_ganadas: 0 } },
    { name: 'Thomas Müller', type: 'LEYENDA', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdBfSIqovXIW3KcBpqjpmGlz1T7Krczabqxg&s', stats: { goles_mundiales: 10, mundiales_jugados: 3, partidos_mundiales: 17, copas_ganadas: 1 } },
    { name: 'Eusébio', type: 'LEYENDA', image_url: 'https://lncimg.lance.com.br/cdn-cgi/image/width=950,quality=75,fit=pad,format=webp/uploads/2018/04/14/5ad28259c9144.jpeg', stats: { goles_mundiales: 9, mundiales_jugados: 1, partidos_mundiales: 6, copas_ganadas: 0 } },
  ],
};

/* ──────────────────────────────────────────────────────────────────
   DEFINICIÓN DE MÉTRICAS
   Cada métrica define:
   - id: clave en el objeto stats de la entidad
   - label: texto mostrado en pantalla
   - unit: unidad mostrada bajo el número
   - types: qué categorías de HL_DATA usa esta métrica
   - format: función para formatear el valor (opcional)
──────────────────────────────────────────────────────────────────── */
const HL_METRICS = [
  {
    id: 'goles_mundiales',
    label: 'Goles en Mundiales',
    unit: 'goles totales',
    types: ['selecciones', 'leyendas'],
    entityType: 'mixed',
  },
  {
    id: 'participaciones',
    label: 'Participaciones en Mundiales',
    unit: 'copas jugadas',
    types: ['selecciones'],
    entityType: 'selecciones',
  },
  {
    id: 'mundiales_ganados',
    label: 'Títulos Mundiales',
    unit: 'copas ganadas',
    types: ['selecciones'],
    entityType: 'selecciones',
  },
  {
    id: 'capacidad',
    label: 'Capacidad del Estadio',
    unit: 'espectadores',
    types: ['estadios'],
    entityType: 'estadios',
    format: (v) => v.toLocaleString('es-AR'),
  },
  {
    id: 'año_inauguracion',
    label: 'Año de Inauguración',
    unit: 'año',
    types: ['estadios'],
    entityType: 'estadios',
  },
  {
    id: 'costo_millones_usd',
    label: 'Costo de Construcción',
    unit: 'millones USD',
    types: ['estadios'],
    entityType: 'estadios',
    format: (v) => '$' + v.toLocaleString('es-AR'),
  },
  {
    id: 'partidos_mundiales',
    label: 'Partidos en Mundiales',
    unit: 'partidos jugados',
    types: ['leyendas'],
    entityType: 'leyendas',
  },
  {
    id: 'goles_mundiales',
    label: 'Goles en Mundiales',
    unit: 'goles anotados',
    types: ['leyendas'],
    entityType: 'leyendas',
  },
];

/* ──────────────────────────────────────────────────────────────────
   CONSTANTES Y ESTADO GLOBAL
──────────────────────────────────────────────────────────────────── */
const HL_MAX_DAILY_ATTEMPTS = Infinity;
const HL_LS_KEY = 'mundialito_hl_data';

let hlState = {
  score: 0,
  currentLeft: null,
  currentRight: null,
  currentMetric: null,
  isAnswered: false,
  previousRightEntity: null,
};

/* ──────────────────────────────────────────────────────────────────
   GESTIÓN DE localStorage (intentos diarios y récord)
──────────────────────────────────────────────────────────────────── */
function hlGetStorage() {
  try {
    const raw = localStorage.getItem(HL_LS_KEY);
    if (!raw) return { attempts: 0, date: '', record: 0 };
    return JSON.parse(raw);
  } catch { return { attempts: 0, date: '', record: 0 }; }
}

function hlSaveStorage(data) {
  try { localStorage.setItem(HL_LS_KEY, JSON.stringify(data)); } catch { }
}

function hlGetTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function hlGetAttemptsLeft() {
  // Límite diario desactivado — intentos ilimitados
  return Infinity;
}

function hlIncrementAttempt() {
  const data = hlGetStorage();
  const today = hlGetTodayStr();
  if (data.date !== today) {
    data.date = today;
    data.attempts = 0;
  }
  data.attempts = (data.attempts || 0) + 1;
  hlSaveStorage(data);
}

function hlGetRecord() {
  return hlGetStorage().record || 0;
}

function hlUpdateRecord(score) {
  const data = hlGetStorage();
  if (score > (data.record || 0)) {
    data.record = score;
    hlSaveStorage(data);
    return true;
  }
  return false;
}

/* ──────────────────────────────────────────────────────────────────
   LÓGICA DE SELECCIÓN ALEATORIA
──────────────────────────────────────────────────────────────────── */
function hlPickRandom(arr, excludeItem = null) {
  const pool = excludeItem ? arr.filter(x => x.name !== excludeItem.name) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

function hlPickMetric() {
  return HL_METRICS[Math.floor(Math.random() * HL_METRICS.length)];
}

function hlGetPool(metric) {
  let pool = [];
  metric.types.forEach(type => {
    if (HL_DATA[type]) pool = pool.concat(HL_DATA[type]);
  });
  return pool;
}

function hlNewRound(keepLeft = false) {
  const metric = hlPickMetric();
  const pool = hlGetPool(metric);

  let leftEntity, rightEntity;

  if (keepLeft && hlState.previousRightEntity) {
    leftEntity = hlState.previousRightEntity;
    const leftPool = pool.filter(e => e.stats && e.stats[metric.id] !== undefined);
    rightEntity = hlPickRandom(leftPool, leftEntity);
  } else {
    const validPool = pool.filter(e => e.stats && e.stats[metric.id] !== undefined);
    leftEntity = hlPickRandom(validPool);
    rightEntity = hlPickRandom(validPool, leftEntity);
  }

  if (!leftEntity || !rightEntity) {
    return hlNewRound(false);
  }

  hlState.currentLeft = leftEntity;
  hlState.currentRight = rightEntity;
  hlState.currentMetric = metric;
  hlState.isAnswered = false;
}

/* ──────────────────────────────────────────────────────────────────
   RENDERIZADO DE LA UI
──────────────────────────────────────────────────────────────────── */
function hlRenderRound() {
  const { currentLeft: L, currentRight: R, currentMetric: M } = hlState;
  if (!L || !R || !M) return;

  const formatVal = (v) => M.format ? M.format(v) : v.toLocaleString('es-AR');
  const leftVal = L.stats[M.id];
  const rightVal = R.stats[M.id];

  document.getElementById('hl-metric-label').textContent = M.label;

  document.getElementById('hl-left-type').textContent = L.type;
  document.getElementById('hl-left-name').textContent = L.name;
  document.getElementById('hl-left-metric-name').textContent = M.label;
  document.getElementById('hl-left-value').textContent = formatVal(leftVal);
  document.getElementById('hl-left-unit').textContent = M.unit;

  document.getElementById('hl-right-type').textContent = R.type;
  document.getElementById('hl-right-name').textContent = R.name;
  document.getElementById('hl-right-metric-name').textContent = M.label;
  document.getElementById('hl-right-value').textContent = formatVal(rightVal);
  document.getElementById('hl-right-unit').textContent = M.unit;

  const rightValEl = document.getElementById('hl-right-value');
  rightValEl.classList.add('hl-hidden');
  rightValEl.classList.remove('hl-reveal');

  document.getElementById('hl-buttons').style.display = 'flex';
  const resultEl = document.getElementById('hl-result');
  resultEl.style.display = 'none';
  resultEl.className = 'hl-result';

  if (L.image_url) {
    document.getElementById('hl-bg-left').style.backgroundImage = `url('${L.image_url}')`;
  } else {
    document.getElementById('hl-bg-left').style.backgroundImage = '';
  }
  if (R.image_url) {
    document.getElementById('hl-bg-right').style.backgroundImage = `url('${R.image_url}')`;
  } else {
    document.getElementById('hl-bg-right').style.backgroundImage = '';
  }
}

function hlUpdateScoreDisplay() {
  document.getElementById('hl-score').textContent = hlState.score;
  // Intentos ilimitados — no se muestran los puntos de intentos
  const miniEl = document.getElementById('hl-attempts-mini');
  if (miniEl) miniEl.innerHTML = '';
}

/* ──────────────────────────────────────────────────────────────────
   INICIO DEL JUEGO
──────────────────────────────────────────────────────────────────── */
function hlStartGame() {
  hlIncrementAttempt();
  hlState.score = 0;
  hlState.previousRightEntity = null;

  hlNewRound(false);
  hlRenderRound();
  hlUpdateScoreDisplay();

  hlShowScreen('game');
}

/* ──────────────────────────────────────────────────────────────────
   ADIVINAR: higher o lower
──────────────────────────────────────────────────────────────────── */
function hlGuess(direction) {
  if (hlState.isAnswered) return;
  hlState.isAnswered = true;

  const { currentLeft: L, currentRight: R, currentMetric: M } = hlState;
  const leftVal = L.stats[M.id];
  const rightVal = R.stats[M.id];

  const rightValEl = document.getElementById('hl-right-value');
  rightValEl.classList.remove('hl-hidden');
  rightValEl.classList.add('hl-reveal');

  document.getElementById('hl-buttons').style.display = 'none';

  let isCorrect = false;
  let isEqual = leftVal === rightVal;

  if (isEqual) {
    isCorrect = true;
  } else if (direction === 'higher') {
    isCorrect = rightVal > leftVal;
  } else {
    isCorrect = rightVal < leftVal;
  }

  const resultEl = document.getElementById('hl-result');
  resultEl.style.display = 'flex';

  if (isEqual) {
    resultEl.className = 'hl-result hl-result--equal';
    document.getElementById('hl-result-icon').textContent = '🤝';
    document.getElementById('hl-result-text').textContent = '¡EMPATE! SIGUE';
    document.getElementById('hl-btn-next').style.display = 'inline-block';
    document.getElementById('hl-card-right').classList.add('hl-celebrate');
    hlState.score++;
    hlState.previousRightEntity = R;
  } else if (isCorrect) {
    resultEl.className = 'hl-result hl-result--correct';
    document.getElementById('hl-result-icon').textContent = '✓';
    document.getElementById('hl-result-text').textContent = '¡CORRECTO!';
    document.getElementById('hl-btn-next').style.display = 'inline-block';
    document.getElementById('hl-card-right').classList.add('hl-celebrate');
    hlState.score++;
    hlState.previousRightEntity = R;
  } else {
    resultEl.className = 'hl-result hl-result--wrong';
    document.getElementById('hl-result-icon').textContent = '✗';
    document.getElementById('hl-result-text').textContent = '¡INCORRECTO!';
    document.getElementById('hl-btn-next').style.display = 'none';
    document.getElementById('hl-card-right').classList.add('hl-shake');

    setTimeout(() => hlShowGameOver(false), 1200);
  }

  hlUpdateScoreDisplay();

  setTimeout(() => {
    document.getElementById('hl-card-right').classList.remove('hl-shake', 'hl-celebrate');
  }, 500);
}

/* ──────────────────────────────────────────────────────────────────
   SIGUIENTE RONDA
──────────────────────────────────────────────────────────────────── */
function hlNextRound() {
  hlNewRound(true);
  hlRenderRound();
}

/* ──────────────────────────────────────────────────────────────────
   GAME OVER
──────────────────────────────────────────────────────────────────── */
async function hlShowGameOver(isVictory = false) {
  const score = hlState.score;
  const isRecord = hlUpdateRecord(score);

  const { currentLeft: L, currentRight: R, currentMetric: M } = hlState;
  const formatVal = (v) => M ? (M.format ? M.format(v) : v.toLocaleString('es-AR')) : v;

  document.getElementById('hl-go-icon').textContent = score === 0 ? '😬' : score >= 10 ? '🏆' : '💀';
  document.getElementById('hl-go-title').textContent = score >= 10 ? '¡MAESTRO!' : score >= 5 ? '¡BUEN JUEGO!' : '¡PERDISTE!';
  document.getElementById('hl-go-sub').textContent = `Llegaste hasta el round ${score + 1}`;
  document.getElementById('hl-go-score').textContent = score;

  if (L && R && M) {
    const lv = L.stats[M.id];
    const rv = R.stats[M.id];
    document.getElementById('hl-go-comparison').innerHTML =
      `La respuesta era: <strong>${R.name}</strong> tiene <strong>${formatVal(rv)}</strong> ${M.unit}<br>` +
      `vs. <strong>${L.name}</strong> con <strong>${formatVal(lv)}</strong> ${M.unit}`;
  } else {
    document.getElementById('hl-go-comparison').innerHTML = '';
  }

  document.getElementById('hl-go-record-msg').textContent =
    isRecord && score > 0 ? `🏆 ¡NUEVO RÉCORD PERSONAL!` : `Tu récord: ${hlGetRecord()} puntos`;

  // ── INTEGRACIÓN CON BACKEND ────────────────────────────────────────
  const attemptsEl = document.getElementById('hl-go-attempts-left');

  if (window.isUserAuthenticated && window.isUserAuthenticated()) {
    // Usuario logueado → guardar puntaje en el servidor
    if (attemptsEl) {
      attemptsEl.innerHTML = `<span style="color:var(--gold);font-size:13px;">&#9203; Guardando puntaje...</span>`;
    }
    try {
      const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3000' 
        : 'https://mundialito-hzhf.onrender.com';

      const res = await fetch(`${API_BASE_URL}/api/stats/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_name: 'higher_lower',
          score: score,
          user_id: window.getCurrentUserId()
        })
      });
      if (res.ok) {
        if (attemptsEl) {
          attemptsEl.innerHTML = `<span style="color:#4caf50;font-size:13px;display:flex;align-items:center;gap:6px;justify-content:center;">&#10003; Puntaje guardado en tu perfil</span>`;
        }
        // Refrescar el widget de ranking para reflejar el nuevo puntaje
        if (typeof window.refreshGameRanking === 'function') {
          window.refreshGameRanking('higher_lower');
        }
      } else {
        console.error('[HL] Error al guardar stats:', await res.json().catch(() => ({})));
        if (attemptsEl) attemptsEl.innerHTML = '';
      }
    } catch (err) {
      console.error('[HL] Error de red al guardar stats:', err);
      if (attemptsEl) attemptsEl.innerHTML = '';
    }
  } else {
    // Usuario anónimo → mostrar CTA para iniciar sesión
    if (attemptsEl) {
      attemptsEl.innerHTML = `
        <div style="margin-top:10px;padding:12px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:10px;text-align:center;font-size:13px;color:var(--text2,#ccc);line-height:1.5;">
          🏆 <strong style="color:var(--gold,#f0c040);">Iniciá sesión para guardar tu récord en el ranking global</strong>
          <br>
          <button
            id="hl-go-login-btn"
            onclick="document.getElementById('auth-overlay').classList.remove('hidden')"
            style="margin-top:10px;padding:8px 20px;background:var(--gold,#f0c040);color:#111;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;transition:opacity 0.2s;"
            onmouseover="this.style.opacity='0.85'"
            onmouseout="this.style.opacity='1'"
          >Iniciá sesión &#128100;</button>
        </div>`;
    }
  }
  // ──────────────────────────────────────────────────────────────────

  document.getElementById('hl-btn-retry').disabled = false;

  hlShowScreen('gameover');
}

/* ──────────────────────────────────────────────────────────────────
   VOLVER AL INICIO
──────────────────────────────────────────────────────────────────── */
function hlGoHome() {
  hlUpdateHomeScreen();
  hlShowScreen('start');
}

function hlUpdateHomeScreen() {
  const attLeft = hlGetAttemptsLeft();
  const record = hlGetRecord();

  document.getElementById('hl-attempts-display').textContent = 'Intentos ilimitados';

  const startBtn = document.getElementById('hl-btn-start');
  if (startBtn) {
    startBtn.disabled = false;
    startBtn.textContent = 'JUGAR';
  }

  const recordEl = document.getElementById('hl-start-record');
  if (recordEl) {
    recordEl.textContent = record > 0 ? `Tu récord: ${record} puntos` : '';
  }
}

/* ──────────────────────────────────────────────────────────────────
   GESTIÓN DE PANTALLAS
──────────────────────────────────────────────────────────────────── */
function hlShowScreen(name) {
  ['start', 'game', 'gameover'].forEach(s => {
    const el = document.getElementById(`hl-screen-${s}`);
    if (el) el.style.display = s === name ? 'block' : 'none';
  });
}

/* ──────────────────────────────────────────────────────────────────
   INICIALIZACIÓN
   Se llama desde switchTab() en app.js cuando se abre la pestaña
──────────────────────────────────────────────────────────────────── */
function hlInit() {
  hlUpdateHomeScreen();
  hlShowScreen('start');
}

/* ──────────────────────────────────────────────────────────────────
   DEFINICIÓN DE FORMACIONES
   Cada posición: [x, y] en el viewBox 440×620 (0,0 = arriba-izq)
   El arquero está abajo (y alto), los delanteros arriba (y bajo).
   Coordenada Y: 570=arquero, 480=defensas, 380=medio, 200=delanteros
──────────────────────────────────────────────────────────────────── */
const XI_FORMATIONS = {
  '4-4-2': {
    label: '4-4-2 — Clásico',
    positions: [
      // GK
      { x: 220, y: 565, label: 'POR' },
      // DEF
      { x: 70, y: 470, label: 'LD' },
      { x: 157, y: 460, label: 'DFC' },
      { x: 283, y: 460, label: 'DFC' },
      { x: 370, y: 470, label: 'LI' },
      // MID
      { x: 70, y: 345, label: 'MCD' },
      { x: 163, y: 335, label: 'MC' },
      { x: 277, y: 335, label: 'MC' },
      { x: 370, y: 345, label: 'MCO' },
      // FWD
      { x: 157, y: 195, label: 'DC' },
      { x: 283, y: 195, label: 'DC' },
    ]
  },
  '4-3-3': {
    label: '4-3-3 — Ofensivo',
    positions: [
      { x: 220, y: 565, label: 'POR' },
      { x: 70, y: 470, label: 'LD' },
      { x: 157, y: 460, label: 'DFC' },
      { x: 283, y: 460, label: 'DFC' },
      { x: 370, y: 470, label: 'LI' },
      { x: 110, y: 340, label: 'MC' },
      { x: 220, y: 320, label: 'MCD' },
      { x: 330, y: 340, label: 'MC' },
      { x: 88, y: 175, label: 'ED' },
      { x: 220, y: 150, label: 'DC' },
      { x: 352, y: 175, label: 'EI' },
    ]
  },
  '3-5-2': {
    label: '3-5-2 — Equilibrado',
    positions: [
      { x: 220, y: 565, label: 'POR' },
      { x: 120, y: 455, label: 'DFC' },
      { x: 220, y: 445, label: 'DFC' },
      { x: 320, y: 455, label: 'DFC' },
      { x: 55, y: 340, label: 'LD' },
      { x: 145, y: 325, label: 'MC' },
      { x: 220, y: 310, label: 'MCD' },
      { x: 295, y: 325, label: 'MC' },
      { x: 385, y: 340, label: 'LI' },
      { x: 157, y: 185, label: 'DC' },
      { x: 283, y: 185, label: 'DC' },
    ]
  },
  '3-4-3': {
    label: '3-4-3 — Ultra Ofensivo',
    positions: [
      { x: 220, y: 565, label: 'POR' },
      { x: 120, y: 460, label: 'DFC' },
      { x: 220, y: 448, label: 'DFC' },
      { x: 320, y: 460, label: 'DFC' },
      { x: 80, y: 345, label: 'LD' },
      { x: 175, y: 330, label: 'MC' },
      { x: 265, y: 330, label: 'MC' },
      { x: 360, y: 345, label: 'LI' },
      { x: 88, y: 175, label: 'ED' },
      { x: 220, y: 150, label: 'DC' },
      { x: 352, y: 175, label: 'EI' },
    ]
  },
  '5-3-2': {
    label: '5-3-2 — Defensivo',
    positions: [
      { x: 220, y: 565, label: 'POR' },
      { x: 55, y: 480, label: 'LDD' },
      { x: 135, y: 455, label: 'DFC' },
      { x: 220, y: 445, label: 'DFC' },
      { x: 305, y: 455, label: 'DFC' },
      { x: 385, y: 480, label: 'LID' },
      { x: 120, y: 330, label: 'MC' },
      { x: 220, y: 315, label: 'MCD' },
      { x: 320, y: 330, label: 'MC' },
      { x: 157, y: 185, label: 'DC' },
      { x: 283, y: 185, label: 'DC' },
    ]
  },
  '4-2-3-1': {
    label: '4-2-3-1 — Moderno',
    positions: [
      { x: 220, y: 565, label: 'POR' },
      { x: 70, y: 470, label: 'LD' },
      { x: 157, y: 460, label: 'DFC' },
      { x: 283, y: 460, label: 'DFC' },
      { x: 370, y: 470, label: 'LI' },
      { x: 157, y: 375, label: 'MCD' },
      { x: 283, y: 375, label: 'MCD' },
      { x: 88, y: 275, label: 'ED' },
      { x: 220, y: 265, label: 'MCO' },
      { x: 352, y: 275, label: 'EI' },
      { x: 220, y: 155, label: 'DC' },
    ]
  },
  '4-1-4-1': {
    label: '4-1-4-1 — Control',
    positions: [
      { x: 220, y: 565, label: 'POR' },
      { x: 70, y: 470, label: 'LD' },
      { x: 157, y: 460, label: 'DFC' },
      { x: 283, y: 460, label: 'DFC' },
      { x: 370, y: 470, label: 'LI' },
      { x: 220, y: 390, label: 'MCD' },
      { x: 62, y: 300, label: 'MC' },
      { x: 160, y: 285, label: 'MC' },
      { x: 280, y: 285, label: 'MCO' },
      { x: 378, y: 300, label: 'MC' },
      { x: 220, y: 155, label: 'DC' },
    ]
  },
  '5-4-1': {
    label: '5-4-1 — Ultra Defensivo',
    positions: [
      { x: 220, y: 565, label: 'POR' },
      { x: 48, y: 475, label: 'LDD' },
      { x: 130, y: 452, label: 'DFC' },
      { x: 220, y: 442, label: 'DFC' },
      { x: 310, y: 452, label: 'DFC' },
      { x: 392, y: 475, label: 'LID' },
      { x: 70, y: 345, label: 'MCD' },
      { x: 168, y: 335, label: 'MC' },
      { x: 272, y: 335, label: 'MC' },
      { x: 370, y: 345, label: 'MCO' },
      { x: 220, y: 170, label: 'DC' },
    ]
  },
};

/* ──────────────────────────────────────────────────────────────────
   ESTADO GLOBAL
──────────────────────────────────────────────────────────────────── */
let xiState = {
  formation: '4-4-2',
  pitch: 'cesped',
  primaryColor: '#D5001C',
  secondaryColor: '#FFFFFF',
  shortsColor: '#111111',
  teamName: '',
  playerNames: {},
};

/* ──────────────────────────────────────────────────────────────────
   INICIALIZACIÓN
──────────────────────────────────────────────────────────────────── */
function xiInit() {
  xiRenderPlayers();
  xiApplyPitch(xiState.pitch);
  document.getElementById('xi-team-name-input').value = xiState.teamName;
  document.getElementById('xi-pitch-team-name').textContent = xiState.teamName || '';
}

/* ──────────────────────────────────────────────────────────────────
   CAMBIAR FORMACIÓN
──────────────────────────────────────────────────────────────────── */
function xiChangeFormation(val) {
  xiState.formation = val;
  xiRenderPlayers();
}

/* ──────────────────────────────────────────────────────────────────
   CAMBIAR TIPO DE CANCHA
──────────────────────────────────────────────────────────────────── */
function xiChangePitch(val) {
  xiState.pitch = val;
  xiApplyPitch(val);
}

function xiApplyPitch(val) {
  const svg = document.getElementById('xi-pitch-svg');
  if (!svg) return;

  svg.className.baseVal = '';

  const pitchColors = {
    cesped: { base: '#2d8a4e', stripe: 'rgba(0,0,0,0.06)', line: 'rgba(255,255,255,0.7)' },
    sintetico: { base: '#1a6b3d', stripe: 'rgba(0,0,0,0.08)', line: 'rgba(255,255,255,0.75)' },
    noche: { base: '#112d1c', stripe: 'rgba(0,0,0,0.15)', line: 'rgba(255,255,255,0.45)' },
    argentina: { base: '#75AADB', stripe: 'rgba(0,0,0,0.04)', line: 'rgba(255,255,255,0.92)' },
  };

  const theme = pitchColors[val] || pitchColors.cesped;

  const base = document.getElementById('xi-pitch-base');
  if (base) base.setAttribute('fill', theme.base);

  const lines = document.getElementById('xi-pitch-lines');
  if (lines) lines.setAttribute('stroke', theme.line);

  /* Actualizar todas las líneas hijas también */
  if (lines) {
    lines.querySelectorAll('rect, line, circle, path').forEach(el => {
      el.setAttribute('stroke', theme.line);
    });
    /* Puntos (filled) */
    lines.querySelectorAll('circle[fill]').forEach(el => {
      el.setAttribute('fill', theme.line);
    });
  }

  /* Franjas */
  const stripeRect = svg.querySelector('#xi-stripe-pattern rect:last-child');
  if (stripeRect) stripeRect.setAttribute('fill', theme.stripe);
}

/* ──────────────────────────────────────────────────────────────────
   ACTUALIZAR COLORES DESDE LOS INPUTS
──────────────────────────────────────────────────────────────────── */
function xiUpdateColors() {
  xiState.primaryColor = document.getElementById('xi-color-primary').value;
  xiState.secondaryColor = document.getElementById('xi-color-secondary').value;
  xiState.shortsColor = document.getElementById('xi-color-shorts').value;

  document.getElementById('xi-preview-primary').style.background = xiState.primaryColor;
  document.getElementById('xi-preview-secondary').style.background = xiState.secondaryColor;
  document.getElementById('xi-preview-shorts').style.background = xiState.shortsColor;

  xiRenderPlayers();
}

/* ──────────────────────────────────────────────────────────────────
   NOMBRE DEL EQUIPO
──────────────────────────────────────────────────────────────────── */
function xiUpdateTeamName(val) {
  xiState.teamName = val;
  const el = document.getElementById('xi-pitch-team-name');
  if (el) el.textContent = val;
}

function xiSyncTeamName(val) {
  xiState.teamName = val.trim();
  const input = document.getElementById('xi-team-name-input');
  if (input) input.value = xiState.teamName;
}

/* ──────────────────────────────────────────────────────────────────
   RENDERIZAR JUGADORES EN EL SVG
──────────────────────────────────────────────────────────────────── */
function xiRenderPlayers() {
  const formation = XI_FORMATIONS[xiState.formation];
  if (!formation) return;

  const group = document.getElementById('xi-players-group');
  if (!group) return;
  group.innerHTML = '';

  const R = 22;
  const primary = xiState.primaryColor;
  const secondary = xiState.secondaryColor;
  const shorts = xiState.shortsColor;

  formation.positions.forEach((pos, i) => {
    const key = `${xiState.formation}_${i}`;
    const name = xiState.playerNames[key] || `Jugador ${i + 1}`;
    const posLabel = pos.label;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'xi-player-group');
    g.setAttribute('data-index', i);
    g.setAttribute('data-key', key);

    /* ── Camiseta SVG path-based ── */
    const shirtGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    shirtGroup.setAttribute('transform', `translate(${pos.x - R}, ${pos.y - R - 8})`);

    /* Cuerpo camiseta */
    const shirt = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const sw = R * 2;
    const sh = R * 1.7;
    shirt.setAttribute('d',
      `M ${sw * 0.25} 4 ` +
      `L ${sw * 0.05} ${sh * 0.2} ` +
      `L ${sw * 0.22} ${sh * 0.3} ` +
      `L ${sw * 0.22} ${sh} ` +
      `L ${sw * 0.78} ${sh} ` +
      `L ${sw * 0.78} ${sh * 0.3} ` +
      `L ${sw * 0.95} ${sh * 0.2} ` +
      `L ${sw * 0.75} 4 ` +
      `C ${sw * 0.65} 0 ${sw * 0.35} 0 ${sw * 0.25} 4 Z`
    );
    shirt.setAttribute('fill', primary);
    shirt.setAttribute('stroke', secondary);
    shirt.setAttribute('stroke-width', '1.5');
    shirtGroup.appendChild(shirt);

    /* Franja horizontal (secundario) */
    const stripe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    stripe.setAttribute('x', sw * 0.22);
    stripe.setAttribute('y', sh * 0.38);
    stripe.setAttribute('width', sw * 0.56);
    stripe.setAttribute('height', sh * 0.18);
    stripe.setAttribute('fill', secondary);
    stripe.setAttribute('opacity', '0.5');
    shirtGroup.appendChild(stripe);

    /* Short */
    const shortEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    shortEl.setAttribute('x', sw * 0.24);
    shortEl.setAttribute('y', sh);
    shortEl.setAttribute('width', sw * 0.52);
    shortEl.setAttribute('height', sh * 0.28);
    shortEl.setAttribute('rx', '2');
    shortEl.setAttribute('fill', shorts);
    shirtGroup.appendChild(shortEl);

    /* Cabeza */
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    head.setAttribute('cx', sw * 0.5);
    head.setAttribute('cy', -5);
    head.setAttribute('r', R * 0.55);
    head.setAttribute('fill', '#f0c8a0');
    head.setAttribute('stroke', secondary);
    head.setAttribute('stroke-width', '1.5');
    shirtGroup.appendChild(head);

    /* Número en la camiseta */
    const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    numText.setAttribute('x', sw * 0.5);
    numText.setAttribute('y', sh * 0.55);
    numText.setAttribute('text-anchor', 'middle');
    numText.setAttribute('dominant-baseline', 'middle');
    numText.setAttribute('font-size', '11');
    numText.setAttribute('font-weight', '900');
    numText.setAttribute('font-family', 'Bebas Neue, sans-serif');
    numText.setAttribute('fill', secondary);
    numText.setAttribute('opacity', '0.85');
    numText.textContent = i + 1;
    shirtGroup.appendChild(numText);

    g.appendChild(shirtGroup);

    /* ── Etiqueta de nombre ── */
    const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const labelY = pos.y + R * 0.9 + 4;
    labelBg.setAttribute('x', pos.x - 36);
    labelBg.setAttribute('y', labelY - 9);
    labelBg.setAttribute('width', 72);
    labelBg.setAttribute('height', 17);
    labelBg.setAttribute('rx', '3');
    labelBg.setAttribute('fill', 'rgba(0,0,0,0.72)');
    g.appendChild(labelBg);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', pos.x);
    label.setAttribute('y', labelY);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.setAttribute('font-size', '10.5');
    label.setAttribute('font-weight', '700');
    label.setAttribute('font-family', 'Barlow Condensed, sans-serif');
    label.setAttribute('fill', 'white');
    label.setAttribute('class', 'xi-player-label');
    label.setAttribute('data-key', key);
    label.setAttribute('data-index', i);
    label.textContent = name;

    /* Click en label → editar nombre */
    label.addEventListener('click', (e) => {
      e.stopPropagation();
      xiStartEditPlayer(i, key, pos, labelY, name);
    });
    labelBg.addEventListener('click', (e) => {
      e.stopPropagation();
      xiStartEditPlayer(i, key, pos, labelY, name);
    });

    g.appendChild(label);

    /* ── Etiqueta de posición (pequeña, arriba del jugador) ── */
    const posLabelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    posLabelEl.setAttribute('x', pos.x);
    posLabelEl.setAttribute('y', pos.y - R * 1.6 - 14);
    posLabelEl.setAttribute('text-anchor', 'middle');
    posLabelEl.setAttribute('dominant-baseline', 'middle');
    posLabelEl.setAttribute('font-size', '9');
    posLabelEl.setAttribute('font-weight', '700');
    posLabelEl.setAttribute('font-family', 'Barlow Condensed, sans-serif');
    posLabelEl.setAttribute('fill', 'rgba(255,255,255,0.65)');
    posLabelEl.textContent = posLabel;
    g.appendChild(posLabelEl);

    group.appendChild(g);
  });
}

/* ──────────────────────────────────────────────────────────────────
   EDICIÓN DE NOMBRE DE JUGADOR
──────────────────────────────────────────────────────────────────── */
let xiEditInput = null;

function xiGetOrCreateEditInput() {
  const container = document.querySelector('.xi-pitch-container');
  if (!container) return null;
  let inp = document.getElementById('xi-floating-input');
  if (!inp) {
    inp = document.createElement('input');
    inp.id = 'xi-floating-input';
    inp.className = 'xi-edit-input';
    inp.maxLength = 20;
    container.appendChild(inp);
  }
  return inp;
}

function xiStartEditPlayer(index, key, pos, labelY, currentName) {
  const container = document.querySelector('.xi-pitch-container');
  const svg = document.getElementById('xi-pitch-svg');
  if (!container || !svg) return;

  const svgRect = svg.getBoundingClientRect();
  const contRect = container.getBoundingClientRect();
  const viewW = 440;
  const viewH = 620;
  const scaleX = svgRect.width / viewW;
  const scaleY = svgRect.height / viewH;

  const inp = xiGetOrCreateEditInput();
  if (!inp) return;

  const inputW = 90;
  const inputH = 24;
  const svgX = pos.x * scaleX + (svgRect.left - contRect.left);
  const svgY = labelY * scaleY + (svgRect.top - contRect.top);

  inp.style.left = `${svgX - inputW / 2}px`;
  inp.style.top = `${svgY - inputH / 2 - 2}px`;
  inp.style.width = `${inputW}px`;
  inp.style.display = 'block';
  inp.value = currentName.startsWith('Jugador') ? '' : currentName;
  inp.placeholder = currentName;
  inp.setAttribute('data-key', key);

  inp.focus();
  inp.select();

  const commit = () => {
    const val = inp.value.trim() || currentName;
    xiState.playerNames[key] = val;
    inp.style.display = 'none';
    xiRenderPlayers();
  };

  inp.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { inp.style.display = 'none'; }
  };
  inp.onblur = commit;
}

/* Cerrar editor si se hace clic fuera */
document.addEventListener('click', () => {
  const inp = document.getElementById('xi-floating-input');
  if (inp && inp.style.display !== 'none') {
    inp.blur();
  }
});

/* ──────────────────────────────────────────────────────────────────
   RESETEAR
──────────────────────────────────────────────────────────────────── */
function xiReset() {
  xiState.playerNames = {};
  xiState.teamName = '';
  xiState.primaryColor = '#D5001C';
  xiState.secondaryColor = '#FFFFFF';
  xiState.shortsColor = '#111111';

  document.getElementById('xi-color-primary').value = '#D5001C';
  document.getElementById('xi-color-secondary').value = '#FFFFFF';
  document.getElementById('xi-color-shorts').value = '#111111';
  document.getElementById('xi-preview-primary').style.background = '#D5001C';
  document.getElementById('xi-preview-secondary').style.background = '#FFFFFF';
  document.getElementById('xi-preview-shorts').style.background = '#111111';
  document.getElementById('xi-team-name-input').value = '';
  document.getElementById('xi-pitch-team-name').textContent = '';

  xiRenderPlayers();
}

/* ──────────────────────────────────────────────────────────────────
   DESCARGAR COMO IMAGEN PNG
   Usa html2canvas para capturar el panel de la cancha.
──────────────────────────────────────────────────────────────────── */
function xiDownload() {
  const svg = document.getElementById('xi-pitch-svg');
  if (!svg) return;

  /* Serializar el SVG con estado actual */
  const serializer = new XMLSerializer();
  const teamName = xiState.teamName || '11 Ideal';

  /* Canvas manual */
  const vw = 460;
  const vh = 680;
  const canvas = document.createElement('canvas');
  canvas.width = vw * 2;
  canvas.height = (vh + 60) * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  /* Fondo */
  ctx.fillStyle = '#0A2A4A';
  ctx.fillRect(0, 0, vw, vh + 60);

  /* Título */
  ctx.fillStyle = '#E8F4FF';
  ctx.font = 'bold 16px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText((teamName || 'MI 11 IDEAL').toUpperCase(), vw / 2, 36);

  /* SVG a imagen */
  const svgData = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  img.onload = () => {
    ctx.drawImage(img, 0, 50, vw, vh);
    URL.revokeObjectURL(url);

    const a = document.createElement('a');
    a.download = `11-ideal-${teamName.replace(/\s+/g, '-').toLowerCase() || 'mundial-2026'}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    alert('No se pudo exportar la imagen. Intentá con otro navegador.');
  };
  img.src = url;
}

/* ──────────────────────────────────────────────────────────────────
   HOOK en switchTab — xiInit se llama desde switchTab('idealxi')
──────────────────────────────────────────────────────────────────── */