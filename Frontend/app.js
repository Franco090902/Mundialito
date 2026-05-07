
/* ─────────────────────────────────────
   DATOS: Grupos (Mundial 2022 / base 2026)
───────────────────────────────────── */
window.GROUPS = {
  A:{teams:["Qatar","Ecuador","Senegal","Países Bajos"],matches:[{home:"Qatar",away:"Ecuador",hs:0,as:2,date:"20 Nov"},{home:"Senegal",away:"Países Bajos",hs:0,as:2,date:"21 Nov"},{home:"Qatar",away:"Senegal",hs:1,as:3,date:"25 Nov"},{home:"Países Bajos",away:"Ecuador",hs:1,as:1,date:"25 Nov"},{home:"Ecuador",away:"Senegal",hs:1,as:2,date:"29 Nov"},{home:"Países Bajos",away:"Qatar",hs:2,as:0,date:"29 Nov"}]},
  B:{teams:["Inglaterra","Iran","EEUU","Gales"],matches:[{home:"Inglaterra",away:"Iran",hs:6,as:2,date:"21 Nov"},{home:"EEUU",away:"Gales",hs:1,as:1,date:"21 Nov"},{home:"Gales",away:"Iran",hs:0,as:2,date:"25 Nov"},{home:"Inglaterra",away:"EEUU",hs:0,as:0,date:"25 Nov"},{home:"Gales",away:"Inglaterra",hs:0,as:3,date:"29 Nov"},{home:"Iran",away:"EEUU",hs:0,as:1,date:"29 Nov"}]},
  C:{teams:["Argentina","Arabia Saudita","México","Polonia"],matches:[{home:"Argentina",away:"Arabia Saudita",hs:1,as:2,date:"22 Nov"},{home:"México",away:"Polonia",hs:0,as:0,date:"22 Nov"},{home:"Polonia",away:"Arabia Saudita",hs:2,as:0,date:"26 Nov"},{home:"Argentina",away:"México",hs:2,as:0,date:"26 Nov"},{home:"Polonia",away:"Argentina",hs:0,as:2,date:"30 Nov"},{home:"Arabia Saudita",away:"México",hs:1,as:2,date:"30 Nov"}]},
  D:{teams:["Francia","Australia","Túnez","Dinamarca"],matches:[{home:"Dinamarca",away:"Túnez",hs:0,as:0,date:"22 Nov"},{home:"Francia",away:"Australia",hs:4,as:1,date:"22 Nov"},{home:"Túnez",away:"Australia",hs:0,as:1,date:"26 Nov"},{home:"Francia",away:"Dinamarca",hs:2,as:1,date:"26 Nov"},{home:"Australia",away:"Dinamarca",hs:1,as:0,date:"30 Nov"},{home:"Túnez",away:"Francia",hs:1,as:0,date:"30 Nov"}]},
};

/* ─────────────────────────────────────
   DATOS: Goleadores
───────────────────────────────────── */
window.SCORERS = [
  {name:"Kylian Mbappé",    team:"Francia",      goals:8, assists:2, flag:"🇫🇷"},
  {name:"Lionel Messi",     team:"Argentina",    goals:7, assists:3, flag:"🇦🇷"},
  {name:"Olivier Giroud",   team:"Francia",      goals:4, assists:1, flag:"🇫🇷"},
  {name:"Marcus Rashford",  team:"Inglaterra",   goals:3, assists:0, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
  {name:"Cody Gakpo",       team:"Países Bajos", goals:3, assists:1, flag:"🇳🇱"},
  {name:"Richarlison",      team:"Brasil",       goals:3, assists:0, flag:"🇧🇷"},
  {name:"Bukayo Saka",      team:"Inglaterra",   goals:3, assists:2, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
  {name:"Raheem Sterling",  team:"Inglaterra",   goals:3, assists:1, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
];

/* ─────────────────────────────────────
   DATOS: Tarjetas
───────────────────────────────────── */
window.CARDS = [
  {name:"Sofyan Amrabat",   team:"Marruecos",  yellow:3,red:0,flag:"🇲🇦"},
  {name:"Mason Mount",      team:"Inglaterra", yellow:2,red:0,flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
  {name:"Adrien Rabiot",    team:"Francia",    yellow:2,red:0,flag:"🇫🇷"},
  {name:"Idrissa Gueye",    team:"Senegal",    yellow:1,red:1,flag:"🇸🇳"},
  {name:"Gonçalo Ramos",    team:"Portugal",   yellow:2,red:0,flag:"🇵🇹"},
  {name:"Granit Xhaka",     team:"Suiza",      yellow:2,red:0,flag:"🇨🇭"},
  {name:"A.F. Zambo",       team:"Camerún",    yellow:1,red:1,flag:"🇨🇲"},
];

/* ─────────────────────────────────────
   DATOS: Historial de Mundiales
───────────────────────────────────── */
window.EDITIONS = [
  {
    year:1970, host:"México", dates:"31 May – 21 Jun", champion:"Brasil", champFlag:"🇧🇷",
    scorers:[{name:"Gerd Müller",flag:"🇩🇪",goals:10},{name:"Jairzinho",flag:"🇧🇷",goals:7},{name:"Teofilo Cubillas",flag:"🇵🇪",goals:5}],
    finalists:[{team:"Brasil",flag:"🇧🇷",note:"Campeón"},{team:"Italia",flag:"🇮🇹",note:"Subcampeón"},{team:"Alemania",flag:"🇩🇪",note:"3er lugar"},{team:"Uruguay",flag:"🇺🇾",note:"4to lugar"}],
    records:[{cat:"Goles totales",val:"95",desc:"En 32 partidos jugados"},{cat:"Récord histórico",val:"4–1",desc:"Brasil vs Italia en la final"},{cat:"Debutantes",val:"3",desc:"El Salvador, Marruecos, Israel"}],
    facts:["⚽ Pelé disputó su último Mundial y ganó su 3er título","🎨 Considerado el torneo más bello de la historia por muchos","📺 Primer Mundial transmitido en color"],
  },
  {
    year:1986, host:"México", dates:"31 May – 29 Jun", champion:"Argentina", champFlag:"🇦🇷",
    scorers:[{name:"Gary Lineker",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",goals:6},{name:"Diego Maradona",flag:"🇦🇷",goals:5},{name:"Emilio Butragueño",flag:"🇪🇸",goals:5}],
    finalists:[{team:"Argentina",flag:"🇦🇷",note:"Campeón"},{team:"Alemania Occ.",flag:"🇩🇪",note:"Subcampeón"},{team:"Francia",flag:"🇫🇷",note:"3er lugar"},{team:"Bélgica",flag:"🇧🇪",note:"4to lugar"}],
    records:[{cat:"El gol del siglo",val:"11 jun",desc:"Maradona vs Inglaterra – el mejor gol de la historia"},{cat:"Primer Hat-trick",val:"x3",desc:"Emilio Butragueño marcó 4 goles a Dinamarca"},{cat:"Equipos",val:"24",desc:"El formato amplió a 24 selecciones"}],
    facts:["🙌 Maradona marcó 'La Mano de Dios' y 'El Gol del Siglo' en el mismo partido","🏟️ El Estadio Azteca fue sede de la final por segunda vez","🌡️ Partidos jugados con +40°C de temperatura"],
  },
  {
    year:1998, host:"Francia", dates:"10 Jun – 12 Jul", champion:"Francia", champFlag:"🇫🇷",
    scorers:[{name:"Davor Šuker",flag:"🇭🇷",goals:6},{name:"Gabriel Batistuta",flag:"🇦🇷",goals:5},{name:"Ronaldo",flag:"🇧🇷",goals:4}],
    finalists:[{team:"Francia",flag:"🇫🇷",note:"Campeón"},{team:"Brasil",flag:"🇧🇷",note:"Subcampeón"},{team:"Croacia",flag:"🇭🇷",note:"3er lugar"},{team:"Países Bajos",flag:"🇳🇱",note:"4to lugar"}],
    records:[{cat:"Equipos",val:"32",desc:"Primera edición con 32 selecciones"},{cat:"Goles en la final",val:"3–0",desc:"Francia vs Brasil: Zidane marcó dos cabezazos"},{cat:"Debutante histórico",val:"🇭🇷",desc:"Croacia llegó a 3er puesto en su primer Mundial"}],
    facts:["🏆 Francia ganó su primer Mundial siendo local","😱 Ronaldo tuvo un episodio médico horas antes de la final","🎯 Zinedine Zidane fue elegido mejor jugador del torneo"],
  },
  {
    year:2002, host:"Corea/Japón", dates:"31 May – 30 Jun", champion:"Brasil", champFlag:"🇧🇷",
    scorers:[{name:"Ronaldo",flag:"🇧🇷",goals:8},{name:"Miroslav Klose",flag:"🇩🇪",goals:5},{name:"Jon Dahl Tomasson",flag:"🇩🇰",goals:4}],
    finalists:[{team:"Brasil",flag:"🇧🇷",note:"Campeón"},{team:"Alemania",flag:"🇩🇪",note:"Subcampeón"},{team:"Turquía",flag:"🇹🇷",note:"3er lugar"},{team:"Corea del Sur",flag:"🇰🇷",note:"4to lugar"}],
    records:[{cat:"Primera vez en Asia",val:"2002",desc:"Primer Mundial celebrado en el continente asiático"},{cat:"Sorpresa histórica",val:"🇰🇷",desc:"Corea del Sur llegó a semifinales como local"},{cat:"Ronaldo",val:"8",desc:"Ronaldo terminó como máximo goleador histórico del torneo"}],
    facts:["⚽ Ronaldo redimió el desastre de 1998 con 8 goles y el título","🌍 Primer Mundial organizado por dos países simultáneamente","🇫🇷 Francia, campeón defensor, fue eliminada en fase de grupos sin anotar"],
  },
  {
    year:2010, host:"Sudáfrica", dates:"11 Jun – 11 Jul", champion:"España", champFlag:"🇪🇸",
    scorers:[{name:"Thomas Müller",flag:"🇩🇪",goals:5},{name:"David Villa",flag:"🇪🇸",goals:5},{name:"Wesley Sneijder",flag:"🇳🇱",goals:5}],
    finalists:[{team:"España",flag:"🇪🇸",note:"Campeón"},{team:"Países Bajos",flag:"🇳🇱",note:"Subcampeón"},{team:"Alemania",flag:"🇩🇪",note:"3er lugar"},{team:"Uruguay",flag:"🇺🇾",note:"4to lugar"}],
    records:[{cat:"Primer Mundial en África",val:"2010",desc:"Africa debutó como anfitrión de la Copa del Mundo"},{cat:"Gol de la final",val:"116'",desc:"Andrés Iniesta marcó el gol más tarde en una final"},{cat:"Vuvuzela",val:"∞",desc:"El instrumento se hizo viral en todo el mundo"}],
    facts:["🦑 El pulpo Paul predijo todos los resultados de Alemania","🏆 España ganó su primer Mundial con el estilo Tiki-Taka","🎵 El sonido de la vuvuzela marcó una era"],
  },
  {
    year:2014, host:"Brasil", dates:"12 Jun – 13 Jul", champion:"Alemania", champFlag:"🇩🇪",
    scorers:[{name:"James Rodríguez",flag:"🇨🇴",goals:6},{name:"Thomas Müller",flag:"🇩🇪",goals:5},{name:"Neymar",flag:"🇧🇷",goals:4}],
    finalists:[{team:"Alemania",flag:"🇩🇪",note:"Campeón"},{team:"Argentina",flag:"🇦🇷",note:"Subcampeón"},{team:"Países Bajos",flag:"🇳🇱",note:"3er lugar"},{team:"Brasil",flag:"🇧🇷",note:"4to lugar"}],
    records:[{cat:"Goleada histórica",val:"7–1",desc:"Alemania goleó al local Brasil en semifinales (el Mineirazo)"},{cat:"Gol más rápido",val:"18''",desc:"Hakan Şükür sigue siendo el más rápido (Turquía 2002)"},{cat:"Gol dorado",val:"113'",desc:"Mario Götze definió la final vs Argentina en alargue"}],
    facts:["💥 El 7-1 de Alemania a Brasil es el resultado más impactante de la historia","🥇 Alemania se convirtió en el primer equipo europeo en ganar en América","🇦🇷 Messi ganó el Balón de Oro del torneo pese a perder la final"],
  },
  {
    year:2018, host:"Rusia", dates:"14 Jun – 15 Jul", champion:"Francia", champFlag:"🇫🇷",
    scorers:[{name:"Harry Kane",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",goals:6},{name:"Romelu Lukaku",flag:"🇧🇪",goals:4},{name:"Cristiano Ronaldo",flag:"🇵🇹",goals:4}],
    finalists:[{team:"Francia",flag:"🇫🇷",note:"Campeón"},{team:"Croacia",flag:"🇭🇷",note:"Subcampeón"},{team:"Bélgica",flag:"🇧🇪",note:"3er lugar"},{team:"Inglaterra",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",note:"4to lugar"}],
    records:[{cat:"Goles en propia meta",val:"12",desc:"Récord: 12 autogoles en el mismo torneo"},{cat:"VAR debut mundial",val:"2018",desc:"Primera Copa del Mundo con tecnología VAR"},{cat:"Croacia",val:"3",desc:"Croacia ganó 3 partidos en penaltis para llegar a la final"}],
    facts:["🤖 Fue el primer Mundial con VAR (árbitro asistente de video)","🇭🇷 Croacia (4 millones de habitantes) llegó a la final","🇲🇦 Marruecos fue el mejor equipo africano, llegó a cuartos"],
  },
  {
    year:2022, host:"Qatar", dates:"20 Nov – 18 Dic", champion:"Argentina", champFlag:"🇦🇷",
    scorers:[{name:"Kylian Mbappé",flag:"🇫🇷",goals:8},{name:"Lionel Messi",flag:"🇦🇷",goals:7},{name:"Olivier Giroud",flag:"🇫🇷",goals:4}],
    finalists:[{team:"Argentina",flag:"🇦🇷",note:"Campeón"},{team:"Francia",flag:"🇫🇷",note:"Subcampeón"},{team:"Croacia",flag:"🇭🇷",note:"3er lugar"},{team:"Marruecos",flag:"🇲🇦",note:"4to lugar"}],
    records:[{cat:"Final más épica",val:"3–3",desc:"Argentina vs Francia – la mejor final de la historia"},{cat:"Hat-trick en final",val:"3",desc:"Mbappé marcó 3 goles en la final y casi da la vuelta"},{cat:"1ª semifinalista africana",val:"🇲🇦",desc:"Marruecos fue la primera selección africana en semifinales"}],
    facts:["🏆 Messi ganó el único título que le faltaba a los 35 años","⚽ La final Argentina-Francia es considerada la mejor de la historia","🌟 Mbappé marcó 8 goles, el récord más alto de un jugador eliminado"],
  },
];

/* ─────────────────────────────────────
   TICKER: construir y duplicar para loop infinito
───────────────────────────────────── */
function buildTicker() {
  const track = document.getElementById('tickerTrack');
  const LIVE = [
    {home:"España",away:"Alemania",hg:1,ag:1,min:67,group:"E"},
    {home:"Brasil",away:"Suiza",hg:0,ag:0,min:23,group:"G"},
    {home:"México",away:"Polonia",hg:1,ag:0,min:44,group:"C"},
  ];
  const items = [
    ...LIVE.map(m => `<div class="ticker-item"><span class="t-dot"></span><span class="t-min">${m.min}'</span><span class="t-team">${m.home}</span><span class="t-score">${m.hg} — ${m.ag}</span><span class="t-team">${m.away}</span><span class="t-grp">GRP ${m.group}</span></div>`),
    `<div class="ticker-item"><span class="t-info">+12 PARTIDOS HOY &nbsp;·&nbsp; MUNDIAL 2026 &nbsp;·&nbsp; TODO FÚTBOL</span></div>`,
    `<div class="ticker-item"><span class="t-dot"></span><span class="t-min">52'</span><span class="t-team">Croacia</span><span class="t-score">0 — 0</span><span class="t-team">Marruecos</span><span class="t-grp">GRP F</span></div>`,
  ];
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
    const primerGrupo = Object.keys(window.GROUPS)[0];
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
  sel.innerHTML = Object.keys(GROUPS).map(g =>
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
            <span style="font-weight:700;color:var(--text2)">${team}</span>
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
  document.getElementById('fixtureContent').innerHTML = Object.entries(GROUPS).map(([key,g]) => `
    <div class="fix-card">
      <div class="fix-hdr">
        <span class="fix-grp-name">GRUPO ${key}</span>
        <span class="fix-grp-teams">${g.teams.join(' · ')}</span>
      </div>
      ${g.matches.map(m => `
        <div class="fix-match">
          <span class="fix-date">${m.date}</span>
          <div class="fix-teams">
            <span class="fix-home">${m.home}</span>
            <span class="fix-score">${m.hs}–${m.as}</span>
            <span class="fix-away">${m.away}</span>
          </div>
          <span class="fix-ft">FT</span>
        </div>`).join('')}
    </div>`).join('');
}

/* ─────────────────────────────────────
   GOLEADORES
───────────────────────────────────── */
function renderScorers() {
  const max = SCORERS[0].goals;
  const colors = ['var(--gold)','var(--silver)','var(--bronze)','var(--text4)','var(--text4)','var(--text4)','var(--text4)','var(--text4)'];
  document.getElementById('scorersBody').innerHTML = SCORERS.map((s,i) => `
    <div class="sc-row">
      <span class="sc-rank" style="color:${colors[i]}">${i+1}</span>
      <span class="sc-flag">${s.flag}</span>
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
  document.getElementById('cardsBody').innerHTML = CARDS.map((c,i) => `
    <div class="cd-row">
      <span class="cd-rank">${i+1}</span>
      <span class="cd-flag">${c.flag}</span>
      <div><div class="cd-name">${c.name}</div><div class="cd-team">${c.team}</div></div>
      <span class="cd-team" style="font-size:12px">${c.team}</span>
      <div class="cd-cards">${Array(c.yellow).fill('<span class="cy"></span>').join('')}${c.yellow===0?'<span class="c-none">—</span>':''}</div>
      <div class="cd-cards">${Array(c.red).fill('<span class="cr"></span>').join('')}${c.red===0?'<span class="c-none">—</span>':''}</div>
    </div>`).join('');
}

/* ─────────────────────────────────────
   HISTORIAL: render ediciones
───────────────────────────────────── */
function renderHistory() {
  const sel = document.getElementById('editionSelector');
  const cards = document.getElementById('editionCards');

  sel.innerHTML = EDITIONS.map(e =>
    `<button class="ed-btn ${e.year===2022?'active':''}" onclick="showEdition(${e.year})">${e.year}</button>`
  ).join('');

  cards.innerHTML = EDITIONS.map(e => `
    <div class="ed-card ${e.year===2022?'active':''}" id="ed-${e.year}">
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
          <div class="ed-section-title" style="margin-top:20px">Clasificación final</div>
          ${e.finalists.map(f => `
            <div class="finalist-row">
              <span class="fn-flag">${f.flag}</span>
              <span class="fn-team">${f.team}</span>
              <span style="font-size:11px;color:var(--text4)">${f.note}</span>
            </div>`).join('')}
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
          ${e.facts.map(f => `
            <div class="fact-item">
              <span class="fact-emoji">${f.slice(0,2)}</span>
              <div class="fact-text">${f.slice(2)}</div>
            </div>`).join('')}
        </div>

      </div>
    </div>`).join('');
}

function showEdition(year) {
  document.querySelectorAll('.ed-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.ed-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('ed-' + year).classList.add('active');
  event.target.classList.add('active');
}

/* ─────────────────────────────────────
   SIDEBAR: goleadores en vivo
───────────────────────────────────── */
function renderLiveScorers() {
  const colors = ['var(--gold)','var(--silver)','var(--bronze)','var(--text4)','var(--text4)'];
  document.getElementById('liveScorers').innerHTML = SCORERS.slice(0,5).map((s,i) => `
    <div class="srow">
      <span class="srow-rank" style="color:${colors[i]}">${i+1}</span>
      <span class="srow-flag">${s.flag}</span>
      <div style="flex:1"><div class="srow-name">${s.name}</div><div class="srow-sub">${s.team}</div></div>
      <div style="text-align:right"><div class="srow-num">${s.goals}</div><div class="srow-unit">GOLES</div></div>
    </div>`).join('');
}
renderLiveScorers();

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

// 1. Carga los países en ambos selectores basándose en los productos activos
window.cargarFiltrosDinamicos = async function() {
  try {
    const res = await fetch(`${API_URL}/categorias`);
    const paises = await res.json();
    const selectNoticias = document.getElementById('filtro-noticias');
    const selectTienda = document.getElementById('filtro-tienda');
    
    [selectNoticias, selectTienda].forEach(select => {
      if (select && paises.length > 0) {
        paises.forEach(pais => {
          const opt = document.createElement('option');
          opt.value = pais;
          opt.textContent = `📍 ${pais}`;
          select.appendChild(opt);
        });
      }
    });
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

    // Fallback con ejemplos si no hay noticias
    if (noticias.length === 0) {
      noticias = [
        { titulo: "⚽ Preparativos para el Mundial 2026 en marcha", imagen: null, link: "#" },
        { titulo: "🌟 Las selecciones ajustan sus plantillas", imagen: null, link: "#" },
        { titulo: "🏟️ Sedes del Mundial 2026: conoce las ciudades anfitrionas", imagen: null, link: "#" }
      ];
    }

    const html = noticias.map(n => `
      <div class="card-item">
        <img src="${n.imagen || PLACEHOLDER_IMG}" class="card-img" onerror="window.imgFallback(this)" />
        <div class="card-body">
          <div class="card-title">${n.titulo}</div>
          ${n.fuente ? `<div style="color: var(--text4); font-size: 12px; margin-bottom: 8px;">📰 ${n.fuente}</div>` : ''}
          <a href="${n.link}" target="_blank" class="btn-card">${n.link && n.link !== '#' ? 'Leer Noticia' : 'Ver más'}</a>
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

// Mantener compatibilidad con la función anterior
window.actualizarPaneles = function(pais) {
  window.cargarNoticias(pais);
  window.cargarProductos(pais);
};

document.addEventListener('DOMContentLoaded', () => {
  buildTicker();
  // Inicializar paneles base
  renderGroups('A');
  renderFixtures();
  renderScorers();
  renderCards();
  
  // Cargar filtros dinámicos y contenido inicial
  window.cargarFiltrosDinamicos();
  window.cargarNoticias('');
  window.cargarProductos('');
});   