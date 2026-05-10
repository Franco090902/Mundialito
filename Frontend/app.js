
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

async function cargarPartidosEnVivo() {
  try {
    const res = await fetch(`${API_URL}/live`);
    const partidos = await res.json();
    renderLivePanel(partidos);
  } catch (e) { console.warn('⚠️ Live no disponible:', e.message); }
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
  } catch (e) {
    content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red)">Error al cargar el partido</div>';
  }
};

window.cerrarDetallePartido = function() {
  document.getElementById('match-detail-modal')?.classList.remove('active');
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
  await cargarPartidosEnVivo();

  // Refrescar partidos en vivo cada 60 segundos
  setInterval(cargarPartidosEnVivo, 60000);
});   