// ══════════════════════════════════════════════════════════════════
// server.js — Worker de Node.js — Mundialito 2026
// Consulta APIs externas y actualiza Supabase via cron.
// NO usa Express. No sirve HTTP. Solo tareas programadas.
//
// Requiere en .env:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   FOOTBALL_DATA_KEY       (football-data.org)
//   API_FOOTBALL_KEY        (api-football via RapidAPI)
// ══════════════════════════════════════════════════════════════════

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
// ──────────────────────────────────────────────────────────────────
// SUPABASE — Service Role Key (bypasea RLS, solo usar en backend)
// ──────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ──────────────────────────────────────────────────────────────────
// CLIENTES HTTP PARA APIS EXTERNAS
// ──────────────────────────────────────────────────────────────────
const footballData = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_KEY },
  timeout: 10000,
});

const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': process.env.API_FOOTBALL_KEY
  },
  timeout: 10000,
});

// ──────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE COMPETICIÓN
// TEST_MODE=true  → usa Copa Libertadores (para probar en vivo)
// TEST_MODE=false → usa FIFA World Cup 2026
// ──────────────────────────────────────────────────────────────────
const TEST_MODE = String(process.env.TEST_MODE).trim().toLowerCase() === 'false';

// Football-Data.org IDs
const WC_2026_ID = 2000;           // FIFA World Cup 2026
const LIBERTADORES_FD_ID = 2152;   // Copa Libertadores en football-data.org
const COMPETITION_ID = TEST_MODE ? LIBERTADORES_FD_ID : WC_2026_ID;

// API-Football (api-sports.io) IDs
const LIBERTADORES_AF_ID = 13;     // Copa Libertadores en API-Football
const WC_AF_ID = 1;                // FIFA World Cup en API-Football
const LIVE_LEAGUE_ID = TEST_MODE ? LIBERTADORES_AF_ID : WC_AF_ID;

// ──────────────────────────────────────────────────────────────────
// CACHE EN MEMORIA — evitar exceder 10 req/min de Football-Data
// ──────────────────────────────────────────────────────────────────
const cache = {
  fixture: { data: null, ts: 0 },
  standings: { data: null, ts: 0 },
  scorers: { data: null, ts: 0 },
  live: { data: null, ts: 0 },
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCached(key) {
  if (cache[key].data && (Date.now() - cache[key].ts < CACHE_TTL)) return cache[key].data;
  return null;
}
function setCache(key, data) {
  cache[key] = { data, ts: Date.now() };
}

console.log('⚽ Worker Mundialito iniciado —', new Date().toLocaleString('es-AR'));
console.log(`📡 Modo: ${TEST_MODE ? '🧪 TEST (Copa Libertadores)' : '🏆 PRODUCCIÓN (Mundial 2026)'}`);
console.log('📡 Supabase URL:', process.env.SUPABASE_URL);
console.log('📡 ENV PROXIES:', {
  HTTP_PROXY: process.env.HTTP_PROXY,
  HTTPS_PROXY: process.env.HTTPS_PROXY,
  http_proxy: process.env.http_proxy,
  https_proxy: process.env.https_proxy,
  ALL_PROXY: process.env.ALL_PROXY,
  all_proxy: process.env.all_proxy
});

// ──────────────────────────────────────────────────────────────────
// TRADUCCIONES DE EQUIPOS AL CASTELLANO (Promiedos Style)
// ──────────────────────────────────────────────────────────────────
const TRADUCCION_EQUIPOS = {
  // Europa (UEFA)
  'Germany': 'Alemania', 'France': 'Francia', 'Spain': 'España', 'England': 'Inglaterra',
  'Italy': 'Italia', 'Netherlands': 'Países Bajos', 'Croatia': 'Croacia', 'Belgium': 'Bélgica',
  'Portugal': 'Portugal', 'Switzerland': 'Suiza', 'Denmark': 'Dinamarca', 'Poland': 'Polonia',
  'Serbia': 'Serbia', 'Ukraine': 'Ucrania', 'Turkey': 'Turquía', 'Scotland': 'Escocia',
  'Wales': 'Gales', 'Sweden': 'Suecia', 'Austria': 'Austria', 'Czechia': 'Chequia', 
  'Czech Republic': 'República Checa', 'Norway': 'Noruega', 'Greece': 'Grecia', 
  'Finland': 'Finlandia', 'Slovakia': 'Eslovaquia', 'Slovenia': 'Eslovenia', 
  'Hungary': 'Hungría', 'Romania': 'Rumania', 'Bulgaria': 'Bulgaria', 
  'Iceland': 'Islandia', 'Albania': 'Albania', 'Georgia': 'Georgia', 
  'Republic of Ireland': 'Irlanda', 'Ireland': 'Irlanda', 'Northern Ireland': 'Irlanda del Norte',
  
  // Sudamérica (CONMEBOL)
  'Argentina': 'Argentina', 'Brazil': 'Brasil', 'Uruguay': 'Uruguay', 'Colombia': 'Colombia',
  'Ecuador': 'Ecuador', 'Paraguay': 'Paraguay', 'Chile': 'Chile', 'Peru': 'Perú', 'Venezuela': 'Venezuela',
  'Bolivia': 'Bolivia',
  
  // Norte, Centroamérica y Caribe (CONCACAF)
  'United States': 'Estados Unidos', 'USA': 'Estados Unidos', 'Mexico': 'México', 'Canada': 'Canadá',
  'Costa Rica': 'Costa Rica', 'Panama': 'Panamá', 'Jamaica': 'Jamaica', 'Honduras': 'Honduras',
  'El Salvador': 'El Salvador', 'Curaçao': 'Curazao', 'Curacao': 'Curazao', 'Haiti': 'Haití',
  'Trinidad and Tobago': 'Trinidad y Tobago', 'Guatemala': 'Guatemala', 'Nicaragua': 'Nicaragua', 'Cuba': 'Cuba',
  
  // África (CAF)
  'Morocco': 'Marruecos', 'Senegal': 'Senegal', 'Cameroon': 'Camerún', 'Ivory Coast': 'Costa de Marfil',
  'Nigeria': 'Nigeria', 'Egypt': 'Egipto', 'Tunisia': 'Túnez', 'Algeria': 'Argelia', 'Ghana': 'Ghana',
  'South Africa': 'Sudáfrica', 'Mali': 'Malí', 'DR Congo': 'República Democrática del Congo',
  'Democratic Republic of the Congo': 'República Democrática del Congo', 'Congo': 'Congo',
  'Angola': 'Angola', 'Zambia': 'Zambia', 'Uganda': 'Uganda', 'Togo': 'Togo', 'Benin': 'Benín',
  'Guinea': 'Guinea', 'Gabon': 'Gabón', 'Libya': 'Libia', 'Sudan': 'Sudán', 'Cape Verde': 'Cabo Verde',
  'Mauritania': 'Mauritania', 'Madagascar': 'Madagascar', 'Kenya': 'Kenia', 'Zimbabwe': 'Zimbabue',
  
  // Asia (AFC)
  'Japan': 'Japón', 'South Korea': 'Corea del Sur', 'Korea Republic': 'Corea del Sur', 'Iran': 'Irán', 
  'Saudi Arabia': 'Arabia Saudita', 'Australia': 'Australia', 'Qatar': 'Catar', 'Iraq': 'Irak', 
  'United Arab Emirates': 'Emiratos Árabes Unidos', 'Jordan': 'Jordania', 'Uzbekistan': 'Uzbekistán',
  'China': 'China', 'China PR': 'China', 'North Korea': 'Corea del Norte', 'Syria': 'Siria', 
  'Bahrain': 'Bahréin', 'Oman': 'Omán', 'Vietnam': 'Vietnam', 'Thailand': 'Tailandia', 
  'Indonesia': 'Indonesia', 'Lebanon': 'Líbano', 'Palestine': 'Palestina', 'Kuwait': 'Kuwait',
  'Kyrgyzstan': 'Kirguistán', 'Tajikistan': 'Tayikistán',
  
  // Oceanía (OFC)
  'New Zealand': 'Nueva Zelanda', 'Fiji': 'Fiyi', 'Solomon Islands': 'Islas Salomón', 
  'Vanuatu': 'Vanuatu', 'New Caledonia': 'Nueva Caledonia', 'Tahiti': 'Tahití', 
  'Papua New Guinea': 'Papúa Nueva Guinea', 'Samoa': 'Samoa'
};


function translateTeam(name) {
  if (!name) return name;
  const trimmed = name.trim();
  return TRADUCCION_EQUIPOS[trimmed] || trimmed;
}

// ──────────────────────────────────────────────────────────────────
// HELPER: mapear estado de Football-Data a nuestro formato
// ──────────────────────────────────────────────────────────────────
function mapearEstado(status) {
  const map = {
    'SCHEDULED': 'programado', 'TIMED': 'programado',
    'IN_PLAY': 'en_curso', 'PAUSED': 'en_curso',
    'FINISHED': 'finalizado',
    'POSTPONED': 'suspendido', 'SUSPENDED': 'suspendido',
    'CANCELLED': 'cancelado', 'AWARDED': 'finalizado',
  };
  return map[status] || 'programado';
}


// ══════════════════════════════════════════════════════════════════
// ESTRATEGIA 1: FIXTURE (Football-Data.org)
// Límite: 10 req/min. Corre cada hora para no gastar cuota.
// Actualiza: todos los partidos (programados, en curso y finalizados).
// ══════════════════════════════════════════════════════════════════
async function actualizarFixture() {
  console.log('\n🗓️  [FIXTURE] Actualizando desde Football-Data...');
  try {
    const { data } = await footballData.get(`/competitions/${COMPETITION_ID}/matches`);
    const partidos = data.matches;

    if (!partidos?.length) {
      console.log('   Sin partidos en la respuesta.');
      return;
    }

    const activeEdicion = TEST_MODE ? 'libertadores_2026' : 'mundial_2026';

    // 1. Consultar partidos de Supabase para cruzar y preservar estado/goles/estadísticas
    let dbMatchesMap = new Map();
    try {
      const { data: dbMatches } = await supabase
        .from('partidos')
        .select('id_football_data, estado, goles_local, goles_visitante, estadisticas')
        .eq('edicion_mundial', activeEdicion);
      if (dbMatches) {
        dbMatches.forEach(m => {
          if (m.id_football_data) dbMatchesMap.set(m.id_football_data, m);
        });
      }
    } catch (err) {
      console.warn('   ⚠️ Error al consultar partidos pre-upsert:', err.message);
    }

    const rows = partidos.map(p => {
      const dbMatch = dbMatchesMap.get(p.id);
      let estado = mapearEstado(p.status);
      let goles_local = p.score?.fullTime?.home ?? null;
      let goles_visitante = p.score?.fullTime?.away ?? null;

      // Si el partido ya figura como en_curso o finalizado en nuestra BD, lo preservamos
      if (dbMatch && (dbMatch.estado === 'en_curso' || dbMatch.estado === 'finalizado')) {
        estado = dbMatch.estado;
        const apiGolesL = p.score?.fullTime?.home;
        const apiGolesV = p.score?.fullTime?.away;
        
        // Si el estado en Football-Data es FINISHED, adoptamos la finalización y los goles oficiales
        if (p.status === 'FINISHED' && apiGolesL !== null && apiGolesV !== null) {
          estado = 'finalizado';
          goles_local = apiGolesL;
          goles_visitante = apiGolesV;
        } else if ((dbMatch.goles_local === 0 || dbMatch.goles_local === null) && (dbMatch.goles_visitante === 0 || dbMatch.goles_visitante === null) && (apiGolesL > 0 || apiGolesV > 0) && apiGolesL !== null && apiGolesV !== null) {
          // Si estaba en 0-0 en la BD (ej: por zombie/auto-start) pero Football-Data tiene goles reales, los adoptamos
          goles_local = apiGolesL;
          goles_visitante = apiGolesV;
        } else {
          goles_local = dbMatch.goles_local;
          goles_visitante = dbMatch.goles_visitante;
        }
      }

      const row = {
        id_football_data: p.id,
        fase: p.group
          ? `Grupo ${p.group.replace('GROUP_', '')}`
          : ({
              'ROUND_1': 'Ronda 1', 'ROUND_2': 'Ronda 2', 'ROUND_3': 'Ronda 3',
              'LAST_32': 'Dieciseisavos', 'LAST_16': 'Octavos de Final',
              'QUARTER_FINALS': 'Cuartos de Final', 'SEMI_FINALS': 'Semifinales',
              'THIRD_PLACE': 'Tercer Puesto', 'FINAL': 'Final',
              'GROUP_STAGE': 'Fase de Grupos'
            }[p.stage] || p.stage || 'Fase eliminatoria'),
        jornada: p.matchday,
        fecha_utc: p.utcDate,
        // Usamos ?. para evitar errores y ponemos "Por definirse" si viene nulo
        equipo_local: p.homeTeam?.shortName || p.homeTeam?.name || 'Por definirse',
        equipo_visitante: p.awayTeam?.shortName || p.awayTeam?.name || 'Por definirse',
        escudo_local: p.homeTeam?.crest || null,
        escudo_visitante: p.awayTeam?.crest || null,
        estado,
        // También protegemos los goles por si fullTime viene nulo
        goles_local,
        goles_visitante,
        edicion_mundial: activeEdicion,
        updated_at: new Date().toISOString(),
      };

      // Preservar estadísticas de la BD para que no se pisen a null
      if (dbMatch?.estadisticas) {
        row.estadisticas = dbMatch.estadisticas;
      }

      return row;
    });

    // UPSERT masivo — el trigger calcular_puntos_prode se dispara
    // automáticamente si estado cambia a 'finalizado'
    const { error } = await supabase
      .from('partidos')
      .upsert(rows, { onConflict: 'id_football_data' });

    if (error) throw error;
    console.log(`   ✅ ${rows.length} partidos actualizados con edicion_mundial: ${activeEdicion}`);

  } catch (err) {
    console.error('   ❌ Error en actualizarFixture:', err.message);
  }
}

// Ejecutar al arrancar y luego cada hora
actualizarFixture();
cron.schedule('0 * * * *', actualizarFixture);


// ══════════════════════════════════════════════════════════════════
// ESTRATEGIA 2: MINUTO A MINUTO (API-Football / RapidAPI)
// Límite: 100 req/día. Solo corre si hay partidos en curso.
// Actualiza: goles, minuto y estadísticas JSONB.
// ══════════════════════════════════════════════════════════════════
async function actualizarEnVivo() {
  console.log(`\n🔥 [LIVE] Consultando API-Football para partidos en vivo...`);

  try {
    // 1. Obtener partidos en vivo de la liga correspondiente
    const { data } = await apiFootball.get('/fixtures', { 
      params: { live: 'all', league: LIVE_LEAGUE_ID } 
    });
    const fixtures = data.response || [];

    if (!fixtures.length) {
      console.log('   No hay partidos en vivo de la liga en este momento. Buscando partidos del día...');
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: todayData } = await apiFootball.get('/fixtures', {
          params: { date: todayStr, league: LIVE_LEAGUE_ID }
        });
        const todayFixtures = todayData.response || [];

        const { data: enCurso } = await supabase.from('partidos')
          .select('id, equipo_local, equipo_visitante, id_api_football')
          .eq('estado', 'en_curso');

        if (enCurso?.length) {
          const normalizeName = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
          for (const p of enCurso) {
            // Buscar partido en todayFixtures
            let match = todayFixtures.find(f => f.fixture.id === p.id_api_football);
            if (!match) {
              match = todayFixtures.find(f => {
                const homeMatch = normalizeName(f.teams.home.name).includes(normalizeName(p.equipo_local)) ||
                                  normalizeName(p.equipo_local).includes(normalizeName(f.teams.home.name));
                const awayMatch = normalizeName(f.teams.away.name).includes(normalizeName(p.equipo_visitante)) ||
                                  normalizeName(p.equipo_visitante).includes(normalizeName(f.teams.away.name));
                return homeMatch && awayMatch;
              });
            }

            if (match && ['FT', 'AET', 'PEN'].includes(match.fixture.status.short)) {
              // Obtener estadísticas finales
              let statsFinales = {};
              try {
                const { data: statsData } = await apiFootball.get('/fixtures/statistics', { params: { fixture: match.fixture.id } });
                const statsArr = statsData.response || [];
                if (statsArr.length >= 2) {
                  const statsHome = statsArr[0]?.statistics || [];
                  const statsAway = statsArr[1]?.statistics || [];
                  const getStat = (arr, type) => { const s = arr.find(x => x.type === type); return s ? (parseInt(s.value) || 0) : 0; };
                  statsFinales = {
                    posesion_local: getStat(statsHome, 'Ball Possession'),
                    posesion_visitante: getStat(statsAway, 'Ball Possession'),
                    tiros_local: getStat(statsHome, 'Total Shots'),
                    tiros_visitante: getStat(statsAway, 'Total Shots'),
                    tiros_al_arco_local: getStat(statsHome, 'Shots on Goal'),
                    tiros_al_arco_visit: getStat(statsAway, 'Shots on Goal'),
                    corners_local: getStat(statsHome, 'Corner Kicks'),
                    corners_visitante: getStat(statsAway, 'Corner Kicks'),
                    faltas_local: getStat(statsHome, 'Fouls'),
                    faltas_visitante: getStat(statsAway, 'Fouls'),
                    amarillas_local: getStat(statsHome, 'Yellow Cards'),
                    amarillas_visitante: getStat(statsAway, 'Yellow Cards'),
                  };
                }
              } catch(e) { /* silenciar */ }

              const updateFinal = {
                estado: 'finalizado',
                goles_local: match.goals.home,
                goles_visitante: match.goals.away,
                minuto: 90,
                id_api_football: match.fixture.id,
                updated_at: new Date().toISOString()
              };
              if (Object.keys(statsFinales).length > 0) updateFinal.estadisticas = statsFinales;

              await supabase.from('partidos').update(updateFinal).eq('id', p.id);
              console.log(`   🏁 Finalizado en API-Football (día): ${p.equipo_local} ${match.goals.home}-${match.goals.away} ${p.equipo_visitante}`);
            }
          }
        }
      } catch (e) {
        console.error('   ❌ Error al buscar fixtures del día en fallback:', e.message);
      }
      return;
    }

    console.log(`   📡 ${fixtures.length} partido(s) en vivo de ${TEST_MODE ? 'Copa Libertadores' : 'FIFA World Cup'}`);

    // 2. Obtener TODOS los partidos de la BD para cruzar por nombre
    const { data: todosPartidos } = await supabase.from('partidos')
      .select('id, equipo_local, equipo_visitante, id_api_football, estado');

    const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

    for (const f of fixtures) {
      // 3. Buscar el partido en la BD: primero por id_api_football, luego por nombre
      let partido = (todosPartidos || []).find(p => p.id_api_football === f.fixture.id);
      
      if (!partido) {
        partido = (todosPartidos || []).find(p => {
          const homeMatch = normalize(f.teams.home.name).includes(normalize(p.equipo_local)) ||
                            normalize(p.equipo_local).includes(normalize(f.teams.home.name));
          const awayMatch = normalize(f.teams.away.name).includes(normalize(p.equipo_visitante)) ||
                            normalize(p.equipo_visitante).includes(normalize(f.teams.away.name));
          return homeMatch && awayMatch;
        });
      }

      // 4. Obtener estadísticas completas del fixture
      let estadisticas = {};
      try {
        const { data: statsData } = await apiFootball.get('/fixtures/statistics', { 
          params: { fixture: f.fixture.id } 
        });
        const statsArr = statsData.response || [];
        if (statsArr.length >= 2) {
          const statsHome = statsArr[0]?.statistics || [];
          const statsAway = statsArr[1]?.statistics || [];
          const getStat = (arr, type) => { const s = arr.find(x => x.type === type); return s ? (parseInt(s.value) || 0) : 0; };
          estadisticas = {
            posesion_local: getStat(statsHome, 'Ball Possession'),
            posesion_visitante: getStat(statsAway, 'Ball Possession'),
            tiros_local: getStat(statsHome, 'Total Shots'),
            tiros_visitante: getStat(statsAway, 'Total Shots'),
            tiros_al_arco_local: getStat(statsHome, 'Shots on Goal'),
            tiros_al_arco_visit: getStat(statsAway, 'Shots on Goal'),
            corners_local: getStat(statsHome, 'Corner Kicks'),
            corners_visitante: getStat(statsAway, 'Corner Kicks'),
            faltas_local: getStat(statsHome, 'Fouls'),
            faltas_visitante: getStat(statsAway, 'Fouls'),
            amarillas_local: getStat(statsHome, 'Yellow Cards'),
            amarillas_visitante: getStat(statsAway, 'Yellow Cards'),
          };
        }
      } catch(e) { /* stats puede no estar disponible al inicio */ }

      // Determinar estado basado en API-Football
      const afStatus = f.fixture.status.short;
      let estado = 'en_curso';
      if (['FT', 'AET', 'PEN'].includes(afStatus)) estado = 'finalizado';
      else if (['HT'].includes(afStatus)) estado = 'en_curso';

      const updateData = {
        estado,
        goles_local: f.goals.home ?? 0,
        goles_visitante: f.goals.away ?? 0,
        minuto: f.fixture.status.elapsed,
        id_api_football: f.fixture.id,
        escudo_local: f.teams.home.logo,
        escudo_visitante: f.teams.away.logo,
        updated_at: new Date().toISOString()
      };
      if (Object.keys(estadisticas).length > 0) updateData.estadisticas = estadisticas;

      if (partido) {
        // Actualizar partido existente
        await supabase.from('partidos').update(updateData).eq('id', partido.id);
        console.log(`   ⚽ ${f.teams.home.name} ${f.goals.home}-${f.goals.away} ${f.teams.away.name} (${f.fixture.status.elapsed}' ${afStatus})`);
      } else {
        // No existe en DB — insertar solo si estamos en TEST_MODE
        if (TEST_MODE) {
          updateData.equipo_local = f.teams.home.name;
          updateData.equipo_visitante = f.teams.away.name;
          updateData.fase = f.league?.name || 'Copa Libertadores';
          updateData.fecha_utc = new Date(f.fixture.date).toISOString();
          updateData.jornada = 1;
          await supabase.from('partidos').insert(updateData);
          console.log(`   ⚽ [NUEVO] ${f.teams.home.name} vs ${f.teams.away.name} insertado`);
        }
      }
    }

    // 5. Detectar partidos finalizados: los que están en_curso en DB pero NO en la lista live
    const liveIds = fixtures.map(f => f.fixture.id);
    const { data: enCursoAll } = await supabase.from('partidos')
      .select('id, equipo_local, equipo_visitante, id_api_football')
      .eq('estado', 'en_curso');

    if (enCursoAll?.length) {
      for (const p of enCursoAll) {
        // Si este partido NO está en la lista de live, puede haber terminado
        if (p.id_api_football && !liveIds.includes(p.id_api_football)) {
          try {
            const { data: checkData } = await apiFootball.get('/fixtures', { params: { id: p.id_api_football } });
            const match = checkData.response?.[0];
            if (match) {
              const st = match.fixture.status.short;
              if (['FT', 'AET', 'PEN'].includes(st)) {
                // Obtener estadísticas finales
                let statsFinales = {};
                try {
                  const { data: statsData } = await apiFootball.get('/fixtures/statistics', { params: { fixture: p.id_api_football } });
                  const statsArr = statsData.response || [];
                  if (statsArr.length >= 2) {
                    const statsHome = statsArr[0]?.statistics || [];
                    const statsAway = statsArr[1]?.statistics || [];
                    const getStat = (arr, type) => { const s = arr.find(x => x.type === type); return s ? (parseInt(s.value) || 0) : 0; };
                    statsFinales = {
                      posesion_local: getStat(statsHome, 'Ball Possession'),
                      posesion_visitante: getStat(statsAway, 'Ball Possession'),
                      tiros_local: getStat(statsHome, 'Total Shots'),
                      tiros_visitante: getStat(statsAway, 'Total Shots'),
                      tiros_al_arco_local: getStat(statsHome, 'Shots on Goal'),
                      tiros_al_arco_visit: getStat(statsAway, 'Shots on Goal'),
                      corners_local: getStat(statsHome, 'Corner Kicks'),
                      corners_visitante: getStat(statsAway, 'Corner Kicks'),
                      faltas_local: getStat(statsHome, 'Fouls'),
                      faltas_visitante: getStat(statsAway, 'Fouls'),
                      amarillas_local: getStat(statsHome, 'Yellow Cards'),
                      amarillas_visitante: getStat(statsAway, 'Yellow Cards'),
                    };
                  }
                } catch(e) { /* silenciar */ }
                
                const updateFinal = {
                  estado: 'finalizado',
                  goles_local: match.goals.home,
                  goles_visitante: match.goals.away,
                  minuto: 90,
                  updated_at: new Date().toISOString()
                };
                if (Object.keys(statsFinales).length > 0) updateFinal.estadisticas = statsFinales;
                
                await supabase.from('partidos').update(updateFinal).eq('id', p.id);
                console.log(`   🏁 Finalizado: ${p.equipo_local} ${match.goals.home}-${match.goals.away} ${p.equipo_visitante}`);
              }
            }
          } catch(e) { /* silenciar errores de check individual */ }
        }
      }
    }

  } catch (err) {
    console.error('   ❌ Error en actualizarEnVivo:', err.message);
  }
}

let ultimoLiveRun = 0;
async function actualizarEnVivoMaster() {
  const nowTime = Date.now();
  if (nowTime - ultimoLiveRun < 60000) {
    console.log('   😴 [LIVE WORKER] Omitiendo ciclo por ejecución reciente (salvaguarda de rate limit).');
    return;
  }
  ultimoLiveRun = nowTime;

  console.log(`\n⏳ [LIVE MASTER] Iniciando ciclo de actualización en vivo — ${new Date().toLocaleString('es-AR')}`);
  try {
    const activeEdicion = TEST_MODE ? 'libertadores_2026' : 'mundial_2026';
    const now = new Date();
    // Buffer de 15 minutos para partidos programados a empezar
    const bufferTime = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    
    // 1. Pre-chequeo rápido en BD (solo traemos partidos del torneo activo para proteger cuotas de API)
    const { data: activeMatches, error: dbErr } = await supabase
      .from('partidos')
      .select('id, equipo_local, equipo_visitante, estado, fecha_utc, goles_local, goles_visitante, estadisticas, id_api_football')
      .eq('edicion_mundial', activeEdicion)
      .or(`estado.eq.en_curso,and(estado.eq.programado,fecha_utc.lte.${bufferTime})`);

    if (dbErr) {
      console.error('   ❌ Error al consultar partidos en BD para pre-chequeo:', dbErr.message);
      return;
    }

    if (!activeMatches || activeMatches.length === 0) {
      console.log('   😴 [LIVE WORKER] Sin partidos en curso o próximos en este momento. Omitiendo llamados externos.');
      return;
    }

    console.log(`   📋 Partidos activos/próximos en BD para ${activeEdicion.toUpperCase()}: ${activeMatches.length}`);

    // 2. Auto-inicio de partidos programados cuya fecha ya pasó
    const toStart = activeMatches.filter(m => m.estado === 'programado' && new Date(m.fecha_utc) <= now);
    for (const p of toStart) {
      const { error: startErr } = await supabase
        .from('partidos')
        .update({
          estado: 'en_curso',
          goles_local: 0,
          goles_visitante: 0,
          minuto: 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', p.id);

      if (startErr) {
        console.error(`   ❌ Error iniciando partido ${p.equipo_local} vs ${p.equipo_visitante}:`, startErr.message);
      } else {
        console.log(`   🚀 [AUTO-START] Partido iniciado automáticamente en BD: ${p.equipo_local} vs ${p.equipo_visitante}`);
        p.estado = 'en_curso'; // Actualizar en memoria
        p.goles_local = 0;
        p.goles_visitante = 0;
        p.minuto = 1;
      }
    }

    // 3. Filtro de Seguridad: Zombie Match Safety Net
    const enCurso = activeMatches.filter(m => m.estado === 'en_curso');
    for (const p of enCurso) {
      const hoursSinceStart = (Date.now() - new Date(p.fecha_utc).getTime()) / (1000 * 60 * 60);
      if (hoursSinceStart > 3.5) {
        console.log(`   🧟 [ZOMBIE MATCH] ${p.equipo_local} vs ${p.equipo_visitante} lleva en curso > 3.5 horas. Auto-finalizando...`);
        const { error: zErr } = await supabase
          .from('partidos')
          .update({
            estado: 'finalizado',
            minuto: 90,
            updated_at: new Date().toISOString()
          })
          .eq('id', p.id);
        
        if (zErr) console.error('   ❌ Error al auto-finalizar zombie match:', zErr.message);
        p.estado = 'finalizado'; // Actualizar en memoria para omitir crawling
      }
    }

    // Volver a filtrar los que quedaron realmente en_curso para actualizar
    const partidosAActualizar = activeMatches.filter(m => m.estado === 'en_curso');
    if (partidosAActualizar.length === 0) {
      console.log('   Sin partidos activos para actualizar por API en este momento.');
      return;
    }

    // 4. Intentar actualización con Sofascore (Principal, Ilimitado, Gratis)
    console.log(`   📡 Intentando actualizar ${partidosAActualizar.length} partido(s) mediante Sofascore...`);
    let sofascoreSuccess = false;
    try {
      const scheduledEventsCache = {};
      let matchesUpdated = 0;

      for (const partido of partidosAActualizar) {
        let ssMatch = null;
        const cachedSofaId = partido.estadisticas?.sofascore_id;

        if (cachedSofaId) {
          try {
            console.log(`      🎯 Usando sofascore_id cacheado ${cachedSofaId} para ${partido.equipo_local} vs ${partido.equipo_visitante}`);
            const { data: eventDetail } = await safeSofascoreGet(
              `https://api.sofascore.com/api/v1/event/${cachedSofaId}`,
              8000
            );
            ssMatch = eventDetail.event;
          } catch (err) {
            console.warn(`      ⚠️ Error al consultar evento directo por ID ${cachedSofaId}:`, err.message);
          }
        }

        if (!ssMatch) {
          const fecha = new Date(partido.fecha_utc).toISOString().split('T')[0];
          if (!scheduledEventsCache[fecha]) {
            try {
              console.log(`      🔍 Consultando eventos de Sofascore para la fecha: ${fecha}`);
              const { data: ssData } = await safeSofascoreGet(
                `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${fecha}`,
                8000
              );
              scheduledEventsCache[fecha] = ssData.events || [];
            } catch (err) {
              console.warn(`      ⚠️ Error al consultar scheduled-events para la fecha ${fecha}:`, err.message);
              scheduledEventsCache[fecha] = [];
            }
          }

          const events = scheduledEventsCache[fecha];
          ssMatch = events.find(e => {
            const homeOk = sofascoreTeamMatch(e.homeTeam?.name || '', partido.equipo_local);
            const awayOk = sofascoreTeamMatch(e.awayTeam?.name || '', partido.equipo_visitante);
            const homeInv = sofascoreTeamMatch(e.homeTeam?.name || '', partido.equipo_visitante);
            const awayInv = sofascoreTeamMatch(e.awayTeam?.name || '', partido.equipo_local);
            return (homeOk && awayOk) || (homeInv && awayInv);
          });
        }

        if (ssMatch) {
          console.log(`      ✅ Partido encontrado en Sofascore: ${ssMatch.homeTeam?.name} vs ${ssMatch.awayTeam?.name} (ID: ${ssMatch.id})`);
          
          const isHomeMatchedDirectly = sofascoreTeamMatch(ssMatch.homeTeam?.name || '', partido.equipo_local);
          const golesL = isHomeMatchedDirectly ? (ssMatch.homeScore?.current ?? 0) : (ssMatch.awayScore?.current ?? 0);
          const golesV = isHomeMatchedDirectly ? (ssMatch.awayScore?.current ?? 0) : (ssMatch.homeScore?.current ?? 0);

          const updateData = {
            goles_local: golesL,
            goles_visitante: golesV,
            minuto: ssMatch.time?.currentPeriodStartTimestamp
              ? Math.max(1, Math.min(90, Math.floor((Date.now() / 1000 - ssMatch.time.currentPeriodStartTimestamp) / 60)))
              : (parseInt(ssMatch.statusDescription) || ssMatch.status?.description || 1),
            updated_at: new Date().toISOString(),
            estadisticas: { ...(partido.estadisticas || {}), sofascore_id: ssMatch.id }
          };

          // Si el partido terminó en Sofascore
          if (ssMatch.status?.type === 'finished' || ssMatch.statusDescription === 'FT') {
            updateData.estado = 'finalizado';
            updateData.minuto = 90;
          }

          // Intentar obtener estadísticas y goles en vivo
          try {
            const { data: statsData } = await safeSofascoreGet(
              `https://api.sofascore.com/api/v1/event/${ssMatch.id}/statistics`,
              5000
            );
            let estadisticas = parseSofascoreStats(statsData) || {};
            const goles = await fetchSofascoreGoals(ssMatch.id, partido.equipo_local, partido.equipo_visitante);
            if (goles) estadisticas.goles_detalle = goles;

            if (Object.keys(estadisticas).length > 0) {
              updateData.estadisticas = { ...updateData.estadisticas, ...estadisticas };
            }
          } catch (statsErr) {
            // Silenciar, stats pueden no estar listos aún
          }

          const { error: updErr } = await supabase
            .from('partidos')
            .update(updateData)
            .eq('id', partido.id);

          if (updErr) {
            console.error(`      ❌ Error actualizando partido ${partido.id}:`, updErr.message);
          } else {
            console.log(`      ⚽ [SOFASCORE] ${partido.equipo_local} ${updateData.goles_local}-${updateData.goles_visitante} ${partido.equipo_visitante} (${updateData.minuto}' - ${updateData.estado || 'en_curso'})`);
            matchesUpdated++;
          }
        } else {
          console.log(`      ⚠️ Partido no encontrado en Sofascore esta fecha: ${partido.equipo_local} vs ${partido.equipo_visitante}`);
        }
      }

      sofascoreSuccess = true;
      console.log(`   ✅ Sofascore finalizado. Partidos actualizados: ${matchesUpdated}`);
      
    } catch (sofaErr) {
      console.warn(`   ⚠️ Error/Bloqueo de Sofascore (código ${sofaErr.response?.status || sofaErr.code || 'desconocido'}):`, sofaErr.message);
      sofascoreSuccess = false;
    }

    // 5. Fallback a API-Football (si Sofascore falló o no se pudo completar)
    if (!sofascoreSuccess) {
      console.log(`   🚨 [FALLBACK] Iniciando actualización con API-Football...`);
      await actualizarEnVivo();
    }

  } catch (masterErr) {
    console.error('   ❌ Error crítico en actualizarEnVivoMaster:', masterErr.message);
  }
}

// Iniciar el Master Live Worker cada 2 minutos (reemplaza anteriores schedules de live)
actualizarEnVivoMaster();
cron.schedule('*/2 * * * *', actualizarEnVivoMaster);

// ══════════════════════════════════════════════════════════════════
// ACTUALIZACIÓN DE TABLAS DE APOYO (Posiciones, Goleadores, Tarjetas)
// ══════════════════════════════════════════════════════════════════

async function actualizarPosiciones() {
  console.log('\n📊 [POSICIONES] Actualizando posiciones...');
  try {
    const { data } = await footballData.get(`/competitions/${COMPETITION_ID}/standings`);
    const standings = data.standings || [];
    const rows = [];

    standings.forEach(s => {
      const grupo = s.group || s.stage;
      (s.table || []).forEach(t => {
        rows.push({
          id: `${grupo}-${t.team?.shortName || t.team?.tla || t.team?.name}`,
          grupo: grupo,
          posicion: t.position,
          equipo: t.team?.name || '',
          equipo_short: t.team?.shortName || t.team?.tla || '',
          escudo: t.team?.crest || null,
          pj: t.playedGames || 0,
          g: t.won || 0,
          e: t.draw || 0,
          p: t.lost || 0,
          gf: t.goalsFor || 0,
          gc: t.goalsAgainst || 0,
          dg: t.goalDifference || 0,
          pts: t.points || 0,
          updated_at: new Date().toISOString()
        });
      });
    });

    if (rows.length > 0) {
      const { error } = await supabase.from('posiciones').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      console.log(`   ✅ ${rows.length} posiciones actualizadas.`);
    }
  } catch (err) {
    console.error('   ❌ Error en actualizarPosiciones:', err.message);
  }
}

async function actualizarGoleadores() {
  console.log('\n👟 [GOLEADORES] Actualizando goleadores...');
  try {
    const { data } = await footballData.get(`/competitions/${COMPETITION_ID}/scorers?limit=20`);
    const scorers = data.scorers || [];
    const rows = scorers.map(s => ({
      id: `${s.player?.name}-${s.team?.name}`,
      nombre: s.player?.name || '',
      equipo: s.team?.name || '',
      equipo_short: s.team?.shortName || s.team?.tla || '',
      escudo: s.team?.crest || null,
      goles: s.goals || 0,
      asistencias: s.assists || 0,
      penales: s.penalties || 0,
      partidos: s.playedMatches || 0,
      updated_at: new Date().toISOString()
    }));

    // LIMPIEZA Y ACTUALIZACIÓN EN BD
    // Limpiar tabla antes de insertar para no mezclar datos antiguos o de pruebas
    await supabase.from('goleadores').delete().neq('id', 'borrar_todo');

    if (rows.length > 0) {
      const { error } = await supabase.from('goleadores').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      console.log(`   ✅ ${rows.length} goleadores actualizados.`);
    } else {
      console.log('   Sin goleadores reportados aún.');
    }
  } catch (err) {
    console.error('   ❌ Error en actualizarGoleadores:', err.message);
  }
}

async function actualizarTarjetas() {
  console.log('\n🟨 [TARJETAS] Actualizando tarjetas...');
  try {
    // Primero limpiamos la tabla en Supabase para evitar datos residuales de otros torneos/temporadas
    await supabase.from('tarjetas').delete().neq('id', 'borrar_todo');

    const currentSeason = 2026;
    const tournamentId = TEST_MODE ? 384 : 16; // 384: Libertadores, 16: Mundial
    let rows = [];
    let sofascoreSuccess = false;

    console.log(`   📡 Intentando actualizar tarjetas mediante Sofascore (Torneo: ${tournamentId}, Año: ${currentSeason})...`);
    try {
      const urlSeasons = `https://api.sofascore.com/api/v1/unique-tournament/${tournamentId}/seasons`;
      const resSeasons = await safeSofascoreGet(urlSeasons);
      const seasons = resSeasons.data?.seasons || [];
      const activeSeason = seasons.find(s => s.year === String(currentSeason)) || seasons[0];

      if (activeSeason) {
        console.log(`      🏆 Temporada de Sofascore seleccionada: ${activeSeason.name} (ID: ${activeSeason.id})`);
        const urlStats = `https://api.sofascore.com/api/v1/unique-tournament/${tournamentId}/season/${activeSeason.id}/statistics`;
        
        // Consultar líderes de amarillas y rojas en paralelo para no perder a los jugadores expulsados
        const [resStatsYellow, resStatsRed] = await Promise.all([
          safeSofascoreGet(urlStats + "?limit=20&offset=0&order=-yellowCards&group=card&type=overall"),
          safeSofascoreGet(urlStats + "?limit=20&offset=0&order=-redCards&group=card&type=overall").catch(() => ({ data: { results: [] } }))
        ]);

        const playersYellow = resStatsYellow.data?.results || [];
        const playersRed = resStatsRed.data?.results || [];

        // Si llegamos hasta aquí, consideramos que la consulta de Sofascore es exitosa (incluso si da 0 resultados porque no empezó el torneo)
        sofascoreSuccess = true;

        // Combinar ambas listas de forma única por ID de jugador
        const playersMap = new Map();
        playersYellow.forEach(item => { if (item.player?.id) playersMap.set(item.player.id, item); });
        playersRed.forEach(item => { if (item.player?.id) playersMap.set(item.player.id, item); });

        const players = Array.from(playersMap.values());

        if (players.length > 0) {
          console.log(`      Encontrados ${players.length} líderes únicos de tarjetas en Sofascore. Obteniendo estadísticas individuales...`);
          const cardsMap = new Map();

          // Consultar las estadísticas individuales en paralelo con safeSofascoreGet (que tiene throttling)
          await Promise.all(players.map(async (item) => {
            const p = item.player;
            const t = item.team;
            if (!p || !t) return;
            try {
              const urlPlayerStats = `https://api.sofascore.com/api/v1/player/${p.id}/unique-tournament/${tournamentId}/season/${activeSeason.id}/statistics/overall`;
              const resPlayerStats = await safeSofascoreGet(urlPlayerStats);
              const stats = resPlayerStats.data?.statistics || {};
              const id = `${p.name}-${t.name}`;
              cardsMap.set(id, {
                id,
                nombre: p.name,
                equipo: t.name,
                equipo_short: t.name,
                escudo: `https://api.sofascore.com/api/v1/team/${t.id}/image`,
                amarillas: stats.yellowCards || 0,
                rojas: stats.redCards || 0,
                updated_at: new Date().toISOString()
              });
            } catch (err) {
              console.warn(`      ⚠️ Error al obtener estadísticas del jugador ${p.name}:`, err.message);
            }
          }));

          rows = Array.from(cardsMap.values());
          if (rows.length > 0) {
            sofascoreSuccess = true;
            console.log(`      ✅ Sofascore compiló ${rows.length} líderes de tarjetas con éxito.`);
          }
        }
      }
    } catch (sofaErr) {
      console.warn(`   ⚠️ Falló la obtención de tarjetas mediante Sofascore:`, sofaErr.message);
    }

    // FALLBACK A API-FOOTBALL (si Sofascore no se completó)
    if (!sofascoreSuccess) {
      console.log('   📡 Cambiando a fallback de API-Football...');
      const [yellow, red] = await Promise.all([
        apiFootball.get('/players/topyellowcards', { params: { league: LIVE_LEAGUE_ID, season: currentSeason } }).catch(() => ({ data: { response: [] } })),
        apiFootball.get('/players/topredcards', { params: { league: LIVE_LEAGUE_ID, season: currentSeason } }).catch(() => ({ data: { response: [] } }))
      ]);

      const yellowErrors = yellow.data?.errors;
      const redErrors = red.data?.errors;
      const hasYellowErrors = yellowErrors && Object.keys(yellowErrors).length > 0;
      const hasRedErrors = redErrors && Object.keys(redErrors).length > 0;

      if (hasYellowErrors || hasRedErrors) {
        console.warn('   ⚠️ Fallback de API-Football también falló por límite de cuota. Se conservan las tarjetas actuales.');
        if (hasYellowErrors) console.warn('      Detalle amarillas:', yellowErrors);
        if (hasRedErrors) console.warn('      Detalle rojas:', redErrors);
        return;
      }

      const cardsMap = new Map();
      const processCards = (response, type) => {
        (response || []).forEach(item => {
          const p = item.player;
          const stat = item.statistics?.[0] || {};
          const team = stat.team || {};
          const id = `${p.name}-${team.name}`;

          if (!cardsMap.has(id)) {
            cardsMap.set(id, {
              id,
              nombre: p.name,
              equipo: team.name,
              equipo_short: team.name,
              escudo: team.logo,
              amarillas: 0,
              rojas: 0,
              updated_at: new Date().toISOString()
            });
          }

          const current = cardsMap.get(id);
          if (type === 'yellow') current.amarillas = stat.cards?.yellow || 0;
          if (type === 'red') current.rojas = stat.cards?.red || 0;
        });
      };

      processCards(yellow.data?.response, 'yellow');
      processCards(red.data?.response, 'red');
      rows = Array.from(cardsMap.values());
    }

    if (rows.length > 0) {
      const { error } = await supabase.from('tarjetas').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      console.log(`   ✅ ${rows.length} registros de tarjetas actualizados con éxito en la base de datos.`);
    } else {
      console.log('   Sin tarjetas reportadas aún.');
    }
  } catch (err) {
    console.error('   ❌ Error en actualizarTarjetas:', err.message);
  }
}

// Programar crons de apoyo cada 1 hora
cron.schedule('15 * * * *', actualizarPosiciones);
cron.schedule('30 * * * *', actualizarGoleadores);
cron.schedule('45 * * * *', actualizarTarjetas);

// Ejecutar una vez al inicio
setTimeout(() => {
  actualizarPosiciones();
  actualizarGoleadores();
  actualizarTarjetas();
}, 5000);

// ══════════════════════════════════════════════════════════════════
// ESTRATEGIA 3: HISTORIA (TheSportsDB)
// Gratis, sin límite estricto. Solo corre a las 3 AM.
// Pobla data histórica (mundiales pasados, estadios, equipos).
// ══════════════════════════════════════════════════════════════════
async function actualizarHistoria() {
  console.log('\n📚 [HISTORIA] Consultando TheSportsDB...');

  try {
    // Mundiales pasados: ID 4487 es FIFA World Cup en TheSportsDB
    const { data } = await axios.get(
      'https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4487&s=2022-2023'
    );

    if (!data.events?.length) return;

    const rows = data.events.map(e => ({
      id_thesports: e.idEvent,
      nombre: e.strEvent,
      fecha: e.dateEvent,
      equipo_local: e.strHomeTeam,
      equipo_visitante: e.strAwayTeam,
      goles_local: parseInt(e.intHomeScore) || null,
      goles_visitante: parseInt(e.intAwayScore) || null,
      temporada: e.strSeason,
    }));

    await supabase
      .from('historia_ediciones')
      .upsert(rows, { onConflict: 'id_thesports' });

    console.log(`   ✅ ${rows.length} partidos históricos actualizados.`);
  } catch (err) {
    console.error('   ❌ Error en actualizarHistoria:', err.message);
  }
}

cron.schedule('0 3 * * *', actualizarHistoria);

// ══════════════════════════════════════════════════════════════════
// SOFASCORE — Headers y helpers compartidos
// ══════════════════════════════════════════════════════════════════
const SOFASCORE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Origin': 'https://www.sofascore.com',
  'Referer': 'https://www.sofascore.com/'
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
];

let ultimoSofascoreReqTime = 0;
const SOFASCORE_THROTTLE_MS = 1000;

async function safeSofascoreGet(url, customTimeout = 8000) {
  const now = Date.now();
  const timeSinceLast = now - ultimoSofascoreReqTime;
  if (timeSinceLast < SOFASCORE_THROTTLE_MS) {
    const waitTime = SOFASCORE_THROTTLE_MS - timeSinceLast;
    await delay(waitTime);
  }
  
  let attempts = 3;
  let lastError = null;
  const https = require('https');
  const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: false });

  for (let i = 0; i < attempts; i++) {
    ultimoSofascoreReqTime = Date.now();
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const headers = {
      'User-Agent': ua,
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Origin': 'https://www.sofascore.com',
      'Referer': 'https://www.sofascore.com/',
      'Connection': 'close'
    };

    try {
      if (i > 0) {
        console.log(`      🔄 [REINTENTO SOFASCORE] Intento ${i + 1}/${attempts} para: ${url}`);
      }
      return await axios.get(url, { headers, timeout: customTimeout, proxy: false, httpsAgent: agent });
    } catch (err) {
      lastError = err;
      const status = err.response?.status;
      console.warn(`      ⚠️ [SOFASCORE ERROR] Status ${status || 'desconocido'} en intento ${i + 1} para: ${url}. Detalle: ${err.message}`);
      
      // Fallback a curl si hay error de conexión/TLS o bloqueo (403, 400, etc.)
      console.log(`      📡 [CURL FALLBACK] Intentando obtener datos con curl...`);
      try {
        const data = await new Promise((resolve, reject) => {
          const { exec } = require('child_process');
          let headerArgs = '';
          Object.entries(headers).forEach(([k, v]) => {
            headerArgs += ` -H "${k}: ${v}"`;
          });
          
          // Adaptar el comando según la plataforma (Windows usa curl.exe --ssl-no-revoke, Linux/Render usa curl estándar)
          const curlBin = process.platform === 'win32' ? 'curl.exe --ssl-no-revoke' : 'curl';
          const cmd = `${curlBin} -s ${headerArgs} "${url}"`;
          
          exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            if (error) return reject(error);
            try {
              const json = JSON.parse(stdout);
              resolve(json);
            } catch (e) {
              reject(new Error(`Failed to parse curl response: ${stdout.substring(0, 100)}`));
            }
          });
        });
        console.log(`      ✅ [CURL FALLBACK SUCCESS] Datos obtenidos con éxito mediante curl para: ${url}`);
        return { data, status: 200 };
      } catch (curlErr) {
        console.warn(`      ⚠️ [CURL FALLBACK ERROR] Falló curl: ${curlErr.message}`);
      }

      if (status === 403 || status === 429) {
        const backoff = (i + 1) * 2000;
        await delay(backoff);
      } else {
        if (status === 404) throw err;
        await delay(1000);
      }
    }
  }

  throw lastError;
}

const sofascoreNormalize = s => s ? s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '') : '';

function sofascoreTeamMatch(sofascoreName, dbName) {
  const sfNorm = sofascoreNormalize(sofascoreName);
  const dbNorm = sofascoreNormalize(dbName);
  if (sfNorm.includes(dbNorm) || dbNorm.includes(sfNorm)) return true;
  const dbWords = dbNorm.match(/.{4,}/g) || [dbNorm];
  return dbWords.some(w => sfNorm.includes(w));
}

function parseSofascoreStats(statsData) {
  const allPeriod = statsData.statistics?.find(s => s.period === 'ALL');
  if (!allPeriod) return null;

  const getGroupStat = (groupName, statName) => {
    const group = allPeriod.groups?.find(g => g.groupName === groupName);
    return group?.statisticsItems?.find(s => s.name === statName) || null;
  };
  const parsePercent = (val) => parseInt(String(val).replace('%', '')) || 0;
  const parseNum = (val) => parseInt(val) || 0;

  return {
    posesion_local: parsePercent(getGroupStat('Match overview', 'Ball possession')?.home),
    posesion_visitante: parsePercent(getGroupStat('Match overview', 'Ball possession')?.away),
    tiros_local: parseNum(getGroupStat('Match overview', 'Total shots')?.home),
    tiros_visitante: parseNum(getGroupStat('Match overview', 'Total shots')?.away),
    tiros_al_arco_local: parseNum(getGroupStat('Shots', 'Shots on target')?.home),
    tiros_al_arco_visit: parseNum(getGroupStat('Shots', 'Shots on target')?.away),
    corners_local: parseNum(getGroupStat('Match overview', 'Corner kicks')?.home),
    corners_visitante: parseNum(getGroupStat('Match overview', 'Corner kicks')?.away),
    faltas_local: parseNum(getGroupStat('Match overview', 'Fouls')?.home),
    faltas_visitante: parseNum(getGroupStat('Match overview', 'Fouls')?.away),
    amarillas_local: parseNum(getGroupStat('Match overview', 'Yellow cards')?.home),
    amarillas_visitante: parseNum(getGroupStat('Match overview', 'Yellow cards')?.away),
  };
}

async function fetchSofascoreGoals(matchId, localName, visName) {
  try {
    const { data: incData } = await safeSofascoreGet(
      `https://api.sofascore.com/api/v1/event/${matchId}/incidents`,
      10000
    );
    const goals = (incData.incidents || []).filter(i => i.incidentType === 'goal');
    if (goals.length > 0) {
      return goals.map(g => ({
        minute: g.time,
        scorer: { name: g.player?.name || 'Desconocido' },
        team: { name: g.isHome ? localName : visName }
      }));
    }
  } catch (err) {
    console.warn(`   ⚠️ Error obteniendo incidentes para ID ${matchId}:`, err.message);
  }
  return null;
}

const delay = ms => new Promise(r => setTimeout(r, ms));

// ══════════════════════════════════════════════════════════════════
// BATCH: Poblar estadísticas de partidos finalizados desde Sofascore
// Corre al inicio y cada 2 horas. Procesa con delays para no recibir 403.
// ══════════════════════════════════════════════════════════════════
async function poblarEstadisticasSofascore() {
  console.log('\n📊 [SOFASCORE BATCH] Buscando partidos finalizados sin estadísticas...');
  try {
    // Obtener partidos finalizados sin estadísticas (o con stats vacías)
    const { data: partidos, error } = await supabase
      .from('partidos')
      .select('id, equipo_local, equipo_visitante, fecha_utc, estadisticas')
      .eq('estado', 'finalizado')
      .order('fecha_utc', { ascending: false });

    if (error) { console.error('   ❌ Error consultando partidos:', error.message); return; }

    // Filtrar solo los que no tienen estadísticas o no tienen detalles de goles
    const sinStats = partidos.filter(p => !p.estadisticas || Object.keys(p.estadisticas).length === 0 || p.estadisticas.goles_detalle === undefined);

    if (sinStats.length === 0) {
      console.log('   ✅ Todos los partidos finalizados ya tienen estadísticas.');
      return;
    }

    console.log(`   📋 ${sinStats.length} partidos sin estadísticas. Procesando...`);

    // Agrupar por fecha para reducir llamadas a scheduled-events
    const porFecha = {};
    sinStats.forEach(p => {
      const fecha = new Date(p.fecha_utc).toISOString().split('T')[0];
      if (!porFecha[fecha]) porFecha[fecha] = [];
      porFecha[fecha].push(p);
    });

    let encontrados = 0;
    let noEncontrados = 0;

    for (const [fecha, partidosFecha] of Object.entries(porFecha)) {
      try {
        // Traer todos los eventos de esa fecha
        const { data: ssData } = await axios.get(
          `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${fecha}`,
          { headers: SOFASCORE_HEADERS, timeout: 10000 }
        );
        const events = ssData.events || [];

        for (const partido of partidosFecha) {
          // Buscar el partido en los eventos de Sofascore
          const ssMatch = events.find(e => {
            const homeOk = sofascoreTeamMatch(e.homeTeam?.name || '', partido.equipo_local);
            const awayOk = sofascoreTeamMatch(e.awayTeam?.name || '', partido.equipo_visitante);
            const homeInv = sofascoreTeamMatch(e.homeTeam?.name || '', partido.equipo_visitante);
            const awayInv = sofascoreTeamMatch(e.awayTeam?.name || '', partido.equipo_local);
            return (homeOk && awayOk) || (homeInv && awayInv);
          });

          if (!ssMatch) {
            noEncontrados++;
            continue;
          }

          // Delay de 2 segundos entre cada request de stats para no recibir 403
          await delay(2000);

          try {
            const { data: statsData } = await axios.get(
              `https://api.sofascore.com/api/v1/event/${ssMatch.id}/statistics`,
              { headers: SOFASCORE_HEADERS, timeout: 10000 }
            );

            let estadisticas = parseSofascoreStats(statsData) || {};
            const goles = await fetchSofascoreGoals(ssMatch.id, partido.equipo_local, partido.equipo_visitante);
            if (goles) estadisticas.goles_detalle = goles;
            else if (estadisticas.goles_detalle === undefined) estadisticas.goles_detalle = [];

            if (Object.keys(estadisticas).length > 0) {
              const finalStats = { ...(partido.estadisticas || {}), ...estadisticas };
              await supabase.from('partidos').update({ estadisticas: finalStats }).eq('id', partido.id);
              encontrados++;
              console.log(`   ✅ ${partido.equipo_local} vs ${partido.equipo_visitante} → Stats/Goles actualizados`);
            }
          } catch (statsErr) {
            if (statsErr.response?.status === 403) {
              console.warn('   ⏳ Rate limit alcanzado, esperando 10 segundos...');
              await delay(10000);
              // Reintentar una vez
              try {
                const { data: retry } = await axios.get(
                  `https://api.sofascore.com/api/v1/event/${ssMatch.id}/statistics`,
                  { headers: SOFASCORE_HEADERS, timeout: 10000 }
                );
                let estadisticas = parseSofascoreStats(retry) || {};
                const goles = await fetchSofascoreGoals(ssMatch.id, partido.equipo_local, partido.equipo_visitante);
                if (goles) estadisticas.goles_detalle = goles;
                else if (estadisticas.goles_detalle === undefined) estadisticas.goles_detalle = [];

                if (Object.keys(estadisticas).length > 0) {
                  const finalStats = { ...(partido.estadisticas || {}), ...estadisticas };
                  await supabase.from('partidos').update({ estadisticas: finalStats }).eq('id', partido.id);
                  encontrados++;
                  console.log(`   ✅ (reintento) ${partido.equipo_local} vs ${partido.equipo_visitante} → Stats/Goles actualizados`);
                }
              } catch (retryErr) {
                console.warn(`   ⚠️ Falló reintento para ${partido.equipo_local} vs ${partido.equipo_visitante}`);
              }
            } else {
              console.warn(`   ⚠️ Error stats ${partido.equipo_local} vs ${partido.equipo_visitante}: ${statsErr.message}`);
            }
          }
        }

        // Delay entre fechas
        await delay(1500);

      } catch (dateErr) {
        if (dateErr.response?.status === 403) {
          console.warn(`   ⏳ Rate limit en fecha ${fecha}, esperando 15 segundos...`);
          await delay(15000);
        } else {
          console.warn(`   ⚠️ Error buscando fecha ${fecha}: ${dateErr.message}`);
        }
      }
    }

    console.log(`   🏁 Batch completado: ${encontrados} encontrados, ${noEncontrados} no encontrados.`);

  } catch (err) {
    console.error('   ❌ Error en poblarEstadisticasSofascore:', err.message);
  }
}

// Ejecutar batch 15 segundos después del inicio (dar tiempo al fixture)
// setTimeout(poblarEstadisticasSofascore, 15000);
// Repetir cada 2 horas para capturar nuevos partidos finalizados
// cron.schedule('10 */2 * * *', poblarEstadisticasSofascore);

// ══════════════════════════════════════════════════════════════════
// LIVE: Actualizar partidos en curso desde Sofascore (reemplaza API-Football)
// Busca partidos en_curso en nuestra BD, los encuentra en Sofascore y
// actualiza goles, minuto y estadísticas en tiempo real.
// ══════════════════════════════════════════════════════════════════
async function actualizarEnVivoSofascore() {
  const { data: enCurso, error: errConsulta } = await supabase
    .from('partidos')
    .select('id, equipo_local, equipo_visitante, fecha_utc')
    .eq('estado', 'en_curso');

  if (errConsulta) {
    console.error('Error consultando en_curso:', errConsulta.message);
    return;
  }
  if (!enCurso?.length) return;

  console.log(`\n🔥 [LIVE SOFASCORE] ${enCurso.length} partido(s) en curso. Buscando en Sofascore...`);

  try {
    const hoy = new Date().toISOString().split('T')[0];
    const { data: ssData } = await axios.get(
      `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${hoy}`,
      { headers: SOFASCORE_HEADERS, timeout: 10000 }
    );
    const events = ssData.events || [];

    for (const partido of enCurso) {
      const ssMatch = events.find(e => {
        const homeOk = sofascoreTeamMatch(e.homeTeam?.name || '', partido.equipo_local);
        const awayOk = sofascoreTeamMatch(e.awayTeam?.name || '', partido.equipo_visitante);
        const homeInv = sofascoreTeamMatch(e.homeTeam?.name || '', partido.equipo_visitante);
        const awayInv = sofascoreTeamMatch(e.awayTeam?.name || '', partido.equipo_local);
        return (homeOk && awayOk) || (homeInv && awayInv);
      });

      if (!ssMatch) continue;

      const updateData = {
        goles_local: ssMatch.homeScore?.current ?? null,
        goles_visitante: ssMatch.awayScore?.current ?? null,
        minuto: ssMatch.time?.currentPeriodStartTimestamp
          ? Math.floor((Date.now() / 1000 - ssMatch.time.currentPeriodStartTimestamp) / 60)
          : ssMatch.statusDescription || null,
        updated_at: new Date().toISOString(),
      };

      // Si el partido terminó en Sofascore, actualizamos el estado
      if (ssMatch.status?.type === 'finished') {
        updateData.estado = 'finalizado';
      }

      // Intentar obtener estadísticas en vivo
      try {
        await delay(1000);
        const { data: statsData } = await axios.get(
          `https://api.sofascore.com/api/v1/event/${ssMatch.id}/statistics`,
          { headers: SOFASCORE_HEADERS, timeout: 10000 }
        );
        let estadisticas = parseSofascoreStats(statsData) || {};
        const goles = await fetchSofascoreGoals(ssMatch.id, partido.equipo_local, partido.equipo_visitante);
        if (goles) estadisticas.goles_detalle = goles;

        if (Object.keys(estadisticas).length > 0) {
          updateData.estadisticas = { ...(partido.estadisticas || {}), ...estadisticas };
        }
      } catch (statsErr) {
        // Stats pueden no estar disponibles al inicio del partido
      }

      const { error } = await supabase
        .from('partidos')
        .update(updateData)
        .eq('id', partido.id);

      if (error) {
        console.error(`   ❌ Error actualizando ${partido.id}:`, error.message);
      } else {
        console.log(`   ⚽ ${partido.equipo_local} ${updateData.goles_local}-${updateData.goles_visitante} ${partido.equipo_visitante}${updateData.estadisticas ? ' (con stats)' : ''}`);
      }
    }
  } catch (err) {
    console.error('   ❌ Error en actualizarEnVivoSofascore:', err.message);
  }
}

// Live cada 3 minutos (reemplaza el actualizarEnVivo de API-Football)
// cron.schedule('*/3 * * * *', actualizarEnVivoSofascore);


// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════

/**
 * Mapea los estados de Football-Data.org a nuestro enum de la BD.
 */
function mapearEstado(status) {
  const mapa = {
    'SCHEDULED': 'programado',
    'TIMED': 'programado',
    'IN_PLAY': 'en_curso',
    'PAUSED': 'en_curso',     // entretiempo sigue siendo en_curso
    'EXTRA_TIME': 'en_curso',
    'PENALTY': 'en_curso',
    'FINISHED': 'finalizado',
    'AWARDED': 'finalizado',
    'SUSPENDED': 'suspendido',
    'CANCELLED': 'suspendido',
    'POSTPONED': 'suspendido',
  };
  return mapa[status] || 'programado';
}


// ══════════════════════════════════════════════════════════════════
// MANEJO DE ERRORES — El Worker no muere silenciosamente
// ══════════════════════════════════════════════════════════════════
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  // NO hacer process.exit(1) en desarrollo — mata el servidor
  // En producción con PM2/Render, descomentar: process.exit(1);
});



// --- AL FINAL DE TU SERVER.JS ACTUAL ---

const app = express();
app.use(cors({ origin: '*' })); // Permite TODOS los orígenes (Live Server, localhost, etc)
app.use(express.json());

// Health check — para verificar que el servidor está vivo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: TEST_MODE ? 'test_libertadores' : 'mundial_2026', time: new Date().toISOString() });
});

// Proxy para escudos de Sofascore para evadir protección de hotlinking (403 Forbidden)
app.get('/api/escudo/:id', async (req, res) => {
  const teamId = req.params.id;
  const url = `https://api.sofascore.com/api/v1/team/${teamId}/image`;
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Referer': 'https://www.sofascore.com/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
  };

  try {
    const https = require('https');
    const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: false });
    const response = await axios.get(url, {
      headers,
      responseType: 'arraybuffer',
      timeout: 6000,
      httpsAgent: agent
    });
    
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cachear por 1 día
    res.send(response.data);
  } catch (err) {
    console.warn(`⚠️ [IMAGE PROXY] Axios falló para ID ${teamId}: ${err.message}. Intentando fallback de curl...`);
    
    try {
      const { exec } = require('child_process');
      let headerArgs = '';
      Object.entries(headers).forEach(([k, v]) => {
        headerArgs += ` -H "${k}: ${v}"`;
      });
      
      const curlBin = process.platform === 'win32' ? 'curl.exe --ssl-no-revoke' : 'curl';
      const cmd = `${curlBin} -s ${headerArgs} "${url}"`;
      
      exec(cmd, { encoding: 'buffer', maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error || !stdout || stdout.length === 0) {
          console.error(`❌ [IMAGE PROXY CURL ERROR] Falló curl para ID ${teamId}:`, error?.message || 'Empty buffer');
          return res.status(404).send('Not Found');
        }
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(stdout);
      });
    } catch (curlErr) {
      console.error(`❌ [IMAGE PROXY CRITICAL ERROR] Falló fallback para ID ${teamId}:`, curlErr.message);
      res.status(404).send('Not Found');
    }
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: FIXTURE COMPLETO (cacheado desde Football-Data.org)
// ══════════════════════════════════════════════════════════════════
app.get('/api/fixture', async (req, res) => {
  try {
    const activeEdicion = TEST_MODE ? 'libertadores_2026' : 'mundial_2026';
    const { data, error } = await supabase
      .from('partidos')
      .select('*')
      .eq('edicion_mundial', activeEdicion)
      .order('fecha_utc', { ascending: true });

    if (error) throw error;

    const partidos = (data || []).map(p => ({
      id: p.id,
      grupo: p.fase || null,
      fase: p.fase || '',
      jornada: p.jornada || 1,
      fecha_utc: p.fecha_utc,
      equipo_local: translateTeam(p.equipo_local),
      equipo_visitante: translateTeam(p.equipo_visitante),
      escudo_local: p.escudo_local,
      escudo_visitante: p.escudo_visitante,
      goles_local: p.goles_local,
      goles_visitante: p.goles_visitante,
      estado: p.estado,
      estadio: null,
      minuto: p.minuto
    }));

    res.json(partidos);
  } catch (err) {
    console.error('Error /api/fixture:', err.message);
    res.status(500).json({ error: 'Error obteniendo fixture' });
  }
});

// ══════════════════════════════════════════════════════════════════
// FALLBACK A API-FOOTBALL SI SOFASCORE FALLA O NO TIENE EL PARTIDO
// ══════════════════════════════════════════════════════════════════
async function intentarApiFootballFallback(dbMatch) {
  console.log(`🔍 [API-FOOTBALL FALLBACK] Intentando buscar stats para ${dbMatch.equipo_local} vs ${dbMatch.equipo_visitante}...`);
  try {
    const fechaPartido = new Date(dbMatch.fecha_utc);
    const fechaStr = fechaPartido.toISOString().split('T')[0];

    const { data: afData } = await apiFootball.get('/fixtures', {
      params: {
        date: fechaStr,
        league: LIVE_LEAGUE_ID
      }
    });
    const afFixtures = afData.response || [];

    const normalizeName = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const foundMatch = afFixtures.find(f => {
      const homeMatch = normalizeName(f.teams.home.name).includes(normalizeName(dbMatch.equipo_local)) ||
                        normalizeName(dbMatch.equipo_local).includes(normalizeName(f.teams.home.name));
      const awayMatch = normalizeName(f.teams.away.name).includes(normalizeName(dbMatch.equipo_visitante)) ||
                        normalizeName(dbMatch.equipo_visitante).includes(normalizeName(f.teams.away.name));
      return homeMatch && awayMatch;
    });

    if (foundMatch) {
      const afFixtureId = foundMatch.fixture.id;
      console.log(`   ✅ Encontrado en API-Football (ID: ${afFixtureId})`);

      // Obtener estadísticas
      const { data: statsData } = await apiFootball.get('/fixtures/statistics', { params: { fixture: afFixtureId } });
      const statsArr = statsData.response || [];
      let estadisticas = {};

      if (statsArr.length >= 2) {
        const statsHome = statsArr[0]?.statistics || [];
        const statsAway = statsArr[1]?.statistics || [];
        const getStat = (arr, type) => { const s = arr.find(x => x.type === type); return s ? (parseInt(s.value) || 0) : 0; };
        
        estadisticas = {
          posesion_local: getStat(statsHome, 'Ball Possession'),
          posesion_visitante: getStat(statsAway, 'Ball Possession'),
          tiros_local: getStat(statsHome, 'Total Shots'),
          tiros_visitante: getStat(statsAway, 'Total Shots'),
          tiros_al_arco_local: getStat(statsHome, 'Shots on Goal'),
          tiros_al_arco_visit: getStat(statsAway, 'Shots on Goal'),
          corners_local: getStat(statsHome, 'Corner Kicks'),
          corners_visitante: getStat(statsAway, 'Corner Kicks'),
          faltas_local: getStat(statsHome, 'Fouls'),
          faltas_visitante: getStat(statsAway, 'Fouls'),
          amarillas_local: getStat(statsHome, 'Yellow Cards'),
          amarillas_visitante: getStat(statsAway, 'Yellow Cards'),
          goles_detalle: []
        };
      }

      // Actualizar en Supabase
      const updatePayload = {
        id_api_football: afFixtureId
      };
      if (Object.keys(estadisticas).length > 0) {
        updatePayload.estadisticas = estadisticas;
        dbMatch.estadisticas = estadisticas; // actualiza en memoria para la respuesta actual
      }
      dbMatch.id_api_football = afFixtureId;

      if (foundMatch.goals && foundMatch.goals.home !== null && foundMatch.goals.away !== null) {
        updatePayload.goles_local = foundMatch.goals.home;
        updatePayload.goles_visitante = foundMatch.goals.away;
        dbMatch.goles_local = foundMatch.goals.home;
        dbMatch.goles_visitante = foundMatch.goals.away;
      }

      await supabase.from('partidos').update(updatePayload).eq('id', dbMatch.id);
      console.log('   💾 Estadísticas, goles y id_api_football guardados en BD desde API-Football.');
      return true;
    } else {
      console.warn(`   ⚠️ No se encontró partido coincidente en API-Football para fecha: ${fechaStr}`);
    }
  } catch (err) {
    console.error('   ❌ Error en API-Football fallback stats:', err.message);
  }
  return false;
}

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: DETALLE DE UN PARTIDO
// ══════════════════════════════════════════════════════════════════
app.get('/api/fixture/:id', async (req, res) => {
  try {
    const partidoId = req.params.id;

    // Determinar si es UUID o un ID entero (id_football_data)
    const esUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(partidoId);

    // 1. Obtener de Supabase
    const { data: dbMatch, error } = await supabase
      .from('partidos')
      .select('*')
      .eq(esUUID ? 'id' : 'id_football_data', partidoId)
      .maybeSingle();

    if (error || !dbMatch) {
      return res.status(404).json({ error: 'Partido no encontrado en BD' });
    }

    let footballDataMatch = null;
    // 2. Si tenemos el id_football_data, traemos detalles extra (goles, arbitro)
    if (dbMatch.id_football_data) {
      try {
        const { data } = await footballData.get(`/matches/${dbMatch.id_football_data}`);
        footballDataMatch = data;
      } catch (err) {
        console.warn('No se pudo traer detalles de football-data para partido', dbMatch.id_football_data);
      }
    }

    // 3. FALLBACK: Si no hay estadísticas, buscamos en Sofascore on-demand
    //    Sofascore es gratuito, sin API key, y cubre Libertadores 2026 con stats completas
    const hasStats = dbMatch.estadisticas && Object.keys(dbMatch.estadisticas).filter(k => k !== 'sofascore_id').length > 0;
    if (!hasStats && dbMatch.estado === 'finalizado') {
      console.log(`🔍 Buscando estadísticas en Sofascore para ${dbMatch.equipo_local} vs ${dbMatch.equipo_visitante}...`);

      let sofascoreSuccess = false;
      try {
        let ssMatch = null;
        const cachedSofaId = dbMatch.estadisticas?.sofascore_id;

        if (cachedSofaId) {
          try {
            console.log(`   🎯 Usando sofascore_id cacheado ${cachedSofaId} para ${dbMatch.equipo_local} vs ${dbMatch.equipo_visitante}`);
            const { data: eventDetail } = await safeSofascoreGet(
              `https://api.sofascore.com/api/v1/event/${cachedSofaId}`,
              10000
            );
            ssMatch = eventDetail.event;
          } catch (err) {
            console.warn(`   ⚠️ Error al consultar evento directo por ID ${cachedSofaId}:`, err.message);
          }
        }

        if (!ssMatch) {
          // Usar la fecha del partido para buscar en Sofascore
          const fechaPartido = new Date(dbMatch.fecha_utc);
          const fechaStr = fechaPartido.toISOString().split('T')[0];

          const { data: ssData } = await safeSofascoreGet(
            `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${fechaStr}`,
            10000
          );
          const events = ssData.events || [];

          // Buscar el partido por nombres de equipos
          ssMatch = events.find(e => {
            const homeOk = sofascoreTeamMatch(e.homeTeam?.name || '', dbMatch.equipo_local);
            const awayOk = sofascoreTeamMatch(e.awayTeam?.name || '', dbMatch.equipo_visitante);
            const homeInv = sofascoreTeamMatch(e.homeTeam?.name || '', dbMatch.equipo_visitante);
            const awayInv = sofascoreTeamMatch(e.awayTeam?.name || '', dbMatch.equipo_local);
            return (homeOk && awayOk) || (homeInv && awayInv);
          });
        }

        if (ssMatch) {
          console.log(`   ✅ Encontrado: ${ssMatch.homeTeam?.name} vs ${ssMatch.awayTeam?.name} (ID: ${ssMatch.id})`);

          const isHomeMatchedDirectly = sofascoreTeamMatch(ssMatch.homeTeam?.name || '', dbMatch.equipo_local);
          const golesL = isHomeMatchedDirectly ? (ssMatch.homeScore?.current ?? null) : (ssMatch.awayScore?.current ?? null);
          const golesV = isHomeMatchedDirectly ? (ssMatch.awayScore?.current ?? null) : (ssMatch.homeScore?.current ?? null);

          // Obtener estadísticas
          const { data: statsData } = await safeSofascoreGet(
            `https://api.sofascore.com/api/v1/event/${ssMatch.id}/statistics`,
            10000
          );
          let estadisticas = parseSofascoreStats(statsData) || {};
          const goles = await fetchSofascoreGoals(ssMatch.id, dbMatch.equipo_local, dbMatch.equipo_visitante);
          if (goles) estadisticas.goles_detalle = goles;
          else if (estadisticas.goles_detalle === undefined) estadisticas.goles_detalle = [];

          // Asegurar que guardamos sofascore_id
          estadisticas.sofascore_id = ssMatch.id;

          if (Object.keys(estadisticas).length > 0) {
            dbMatch.estadisticas = { ...(dbMatch.estadisticas || {}), ...estadisticas };
            console.log(`   📊 Stats/Goles guardados en memoria`);
          }

          if (goles && (!footballDataMatch?.goals || footballDataMatch.goals.length === 0)) {
            footballDataMatch = footballDataMatch || {};
            footballDataMatch.goals = goles;
          }

          // Guardar en la DB para futuras consultas
          if (Object.keys(dbMatch.estadisticas || {}).length > 0) {
            const updatePayload = {
              estadisticas: dbMatch.estadisticas
            };
            if (golesL !== null && golesV !== null) {
              updatePayload.goles_local = golesL;
              updatePayload.goles_visitante = golesV;
              dbMatch.goles_local = golesL;
              dbMatch.goles_visitante = golesV;
            }
            await supabase.from('partidos').update(updatePayload).eq('id', dbMatch.id);
            console.log('   💾 Estadísticas y goles guardados en BD.');
          }
          sofascoreSuccess = true;
        } else {
          console.warn(`   ⚠️ No se encontró en Sofascore: ${dbMatch.equipo_local} vs ${dbMatch.equipo_visitante}`);
        }
      } catch (err) {
        console.warn('   ⚠️ Fallback a Sofascore falló:', err.message);
      }

      // Si Sofascore falló o no se encontró el partido, usamos fallback de API-Football
      if (!sofascoreSuccess) {
        await intentarApiFootballFallback(dbMatch);
      }
    }

    res.json({
      id: dbMatch.id,
      grupo: dbMatch.fase,
      fase: dbMatch.fase,
      fecha_utc: dbMatch.fecha_utc,
      equipo_local: translateTeam(dbMatch.equipo_local),
      equipo_visitante: translateTeam(dbMatch.equipo_visitante),
      escudo_local: dbMatch.escudo_local,
      escudo_visitante: dbMatch.escudo_visitante,
      goles_local: dbMatch.goles_local,
      goles_visitante: dbMatch.goles_visitante,
      estado: dbMatch.estado,
      minuto: dbMatch.minuto,
      estadisticas: dbMatch.estadisticas || {},
      estadio: footballDataMatch?.venue || null,
      arbitro: footballDataMatch?.referees?.map(r => r.name).join(', ') || null,
      competicion: footballDataMatch?.competition?.name || 'Mundial 2026',
      goles_detalle: ((footballDataMatch?.goals?.length > 0) ? footballDataMatch.goals : (dbMatch.estadisticas?.goles_detalle || [])).map(g => ({
        ...g,
        team: g.team ? { ...g.team, name: translateTeam(g.team.name) } : null
      })),
    });
  } catch (err) {
    console.error('Error /api/fixture/:id:', err.message);
    res.status(500).json({ error: 'Error obteniendo partido' });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: STANDINGS / POSICIONES POR GRUPO
// ══════════════════════════════════════════════════════════════════
app.get('/api/standings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posiciones')
      .select('*')
      .order('grupo', { ascending: true })
      .order('posicion', { ascending: true });

    if (error) throw error;

    // Agrupar por grupo para mantener el formato esperado por el frontend
    const gruposMap = {};
    (data || []).forEach(row => {
      const g = row.grupo;
      if (!gruposMap[g]) {
        gruposMap[g] = {
          grupo: g,
          tipo: 'TOTAL',
          tabla: []
        };
      }
      gruposMap[g].tabla.push({
        posicion: row.posicion,
        equipo: translateTeam(row.equipo),
        equipo_short: translateTeam(row.equipo_short),
        escudo: row.escudo,
        pj: row.pj || 0,
        g: row.g || 0,
        e: row.e || 0,
        p: row.p || 0,
        gf: row.gf || 0,
        gc: row.gc || 0,
        dg: row.dg || 0,
        pts: row.pts || 0,
      });
    });

    res.json(Object.values(gruposMap));
  } catch (err) {
    console.error('Error /api/standings:', err.message);
    res.status(500).json({ error: 'Error obteniendo standings' });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: GOLEADORES DEL TORNEO
// ══════════════════════════════════════════════════════════════════
app.get('/api/scorers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('goleadores')
      .select('*')
      .order('goles', { ascending: false })
      .limit(20);

    if (error) throw error;

    const scorers = (data || []).map(s => ({
      nombre: s.nombre,
      equipo: translateTeam(s.equipo),
      equipo_short: translateTeam(s.equipo_short),
      escudo: s.escudo,
      goles: s.goles || 0,
      asistencias: s.asistencias || 0,
      penales: s.penales || 0,
      partidos: s.partidos || 0,
    }));

    res.json(scorers);
  } catch (err) {
    console.error('Error /api/scorers:', err.message);
    res.json([]); // Devolver vacío si hay error
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: TARJETAS (API-Football vía Supabase)
// ══════════════════════════════════════════════════════════════════
app.get('/api/tarjetas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tarjetas')
      .select('*');

    if (error) throw error;
    const sorted = data.sort((a, b) => (b.rojas || 0) - (a.rojas || 0) || (b.amarillas || 0) - (a.amarillas || 0));
    
    // Mapear los escudos de Sofascore a través de nuestro proxy local para evadir 403 Forbidden hotlinks
    const mapped = sorted.map(c => {
      let escudo = c.escudo;
      if (escudo && escudo.includes('sofascore.com') && escudo.includes('/team/')) {
        const parts = escudo.split('/team/');
        const teamId = parts[1]?.split('/')[0];
        if (teamId) {
          escudo = `http://localhost:3000/api/escudo/${teamId}`;
        }
      }
      return { 
        ...c, 
        equipo: translateTeam(c.equipo),
        equipo_short: translateTeam(c.equipo_short),
        escudo 
      };
    });
    
    res.json(mapped);
  } catch (err) {
    console.error('Error /api/tarjetas:', err.message);
    res.json([]);
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: PARTIDOS EN VIVO (API-Football — solo cuando hay acción)
// ══════════════════════════════════════════════════════════════════
app.get('/api/live', async (req, res) => {
  try {
    const activeEdicion = TEST_MODE ? 'libertadores_2026' : 'mundial_2026';
    const { data, error } = await supabase
      .from('partidos')
      .select('*')
      .eq('estado', 'en_curso')
      .eq('edicion_mundial', activeEdicion);

    if (error) throw error;

    const partidos = (data || []).map(p => ({
      id: p.id,
      equipo_local: translateTeam(p.equipo_local),
      equipo_visitante: translateTeam(p.equipo_visitante),
      escudo_local: p.escudo_local,
      escudo_visitante: p.escudo_visitante,
      goles_local: p.goles_local,
      goles_visitante: p.goles_visitante,
      minuto: p.minuto || 'Live',
      estado_corto: 'LIVE',
      estado_largo: 'En Curso',
      estadio: '',
      ciudad: '',
      eventos: [],
    }));

    res.json(partidos);
  } catch (err) {
    console.error('Error /api/live:', err.message);
    res.json([]);
  }
});

// ══════════════════════════════════════════════════════════════════
// 1. ENDPOINT DE CATEGORÍAS (Para el filtro HTML)
// ══════════════════════════════════════════════════════════════════
app.get('/api/categorias', async (req, res) => {
  try {
    // Armamos el filtro basándonos en los países que SÍ tienen productos en tu tienda.
    const { data, error } = await supabase
      .from('productos_ml')
      .select('categoria_relacionada')
      .eq('activo', true);

    if (error) throw error;

    // Filtramos para obtener una lista de países únicos
    const categoriasUnicas = [...new Set(data.map(item => item.categoria_relacionada))].filter(Boolean);
    res.json(categoriasUnicas);
  } catch (error) {
    console.error("Error al obtener categorías:", error.message);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// ══════════════════════════════════════════════════════════════════
// 2. ENDPOINT DE NOTICIAS
//    Estrategia: Consulta GNews y devuelve directo al frontend.
//    En paralelo, guarda en 'articulos' como caché (sin bloquear la respuesta).
//    Si GNews falla, sirve desde la tabla 'articulos'.
// ══════════════════════════════════════════════════════════════════
app.get('/api/noticias', async (req, res) => {
  const { pais } = req.query;
  const categoria = (pais && pais !== '' && pais !== 'Todos') ? pais : null;

  console.log(`📰 [NOTICIAS] Pedido recibido — país: ${categoria || 'Todos'}`);

  // ── 1. Intentar GNews directamente ──
  try {
    let queryBusqueda = 'Mundial FIFA 2026';
    if (categoria) queryBusqueda += ` ${categoria}`;

    console.log(`   🔍 Buscando en GNews: "${queryBusqueda}"`);

    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: queryBusqueda,
        lang: 'es',
        max: 6,
        token: process.env.GNEWS_API_KEY
      },
      timeout: 8000
    });

    console.log(`   ✅ GNews respondió: ${response.data.totalArticles} artículos encontrados`);

    const noticias = (response.data.articles || []).map(a => ({
      titulo: a.title,
      imagen: a.image || null,
      link: a.url || '#',
      fuente: a.source?.name || '',
    }));

    // Enviar respuesta al frontend INMEDIATAMENTE
    res.json(noticias);

    // Guardar en BD en segundo plano (sin bloquear respuesta)
    guardarArticulosEnBD(noticias, categoria).catch(err =>
      console.warn('   ⚠️ Error guardando en caché:', err.message)
    );

    return; // Ya respondimos, no seguir

  } catch (error) {
    const status = error.response?.status;
    if (status === 429) {
      console.warn('   ⚠️ GNews rate limit (429)');
    } else if (status === 403) {
      console.warn('   ⚠️ GNews API key inválida (403)');
    } else {
      console.warn('   ⚠️ GNews error:', error.message);
    }
  }

  // ── 2. Fallback: servir desde tabla 'articulos' ──
  console.log('   📦 Sirviendo noticias desde caché en BD...');
  try {
    let query = supabase
      .from('articulos')
      .select('titulo, contenido, categoria, imagen_url')
      .eq('publicado', true)
      .order('created_at', { ascending: false })
      .limit(12);

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    const { data, error } = await query;
    if (error) throw error;

    const noticias = (data || []).map(n => ({
      titulo: n.titulo,
      imagen: n.imagen_url,
      link: '#',
    }));

    console.log(`   📦 ${noticias.length} noticias desde BD`);
    return res.json(noticias);
  } catch (error) {
    console.error('   ❌ Error BD:', error.message);
    return res.json([]);
  }
});

// Función auxiliar: guarda artículos en la tabla 'articulos' (en background)
async function guardarArticulosEnBD(noticias, categoria) {
  for (const n of noticias) {
    try {
      const { data: existing } = await supabase
        .from('articulos')
        .select('id')
        .eq('titulo', n.titulo)
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabase.from('articulos').insert({
          titulo: n.titulo,
          contenido: n.titulo, // Usamos titulo como contenido mínimo
          categoria: categoria || 'General',
          imagen_url: n.imagen,
          publicado: true,
        });
      }
    } catch (e) {
      // Silenciar errores individuales de insert
    }
  }
  console.log('   💾 Caché de artículos actualizado');
}

// ══════════════════════════════════════════════════════════════════
// 3. ENDPOINT DE PRODUCTOS (Tabla: productos_ml)
// ══════════════════════════════════════════════════════════════════
app.get('/api/productos', async (req, res) => {
  const { pais } = req.query;

  try {
    let query = supabase
      .from('productos_ml')
      .select('*')
      .eq('activo', true);

    // Diccionario de traducción para los equipos que vienen en inglés desde la API de fixtures
    let searchTerm = pais;
    if (pais) {
      const mapNombres = {
        'brazil': 'brasil', 'germany': 'alemania', 'france': 'francia',
        'spain': 'españa', 'england': 'inglaterra', 'netherlands': 'países bajos',
        'italy': 'italia', 'japan': 'japón', 'morocco': 'marruecos',
        'croatia': 'croacia', 'belgium': 'bélgica', 'switzerland': 'suiza',
        'united states': 'estados unidos', 'usa': 'estados unidos',
        'scotland': 'escocia', 'wales': 'gales', 'ireland': 'irlanda',
        'sweden': 'suecia', 'denmark': 'dinamarca', 'norway': 'noruega',
        'finland': 'finlandia', 'poland': 'polonia', 'portugal': 'portugal',
        'russia': 'rusia', 'ukraine': 'ucrania', 'turkey': 'turquía',
        'greece': 'grecia', 'serbia': 'serbia', 'romania': 'rumania',
        'hungary': 'hungría', 'austria': 'austria', 'czech republic': 'república checa',
        'argentina': 'argentina', 'colombia': 'colombia', 'uruguay': 'uruguay',
        'chile': 'chile', 'peru': 'perú', 'ecuador': 'ecuador',
        'paraguay': 'paraguay', 'venezuela': 'venezuela', 'bolivia': 'bolivia',
        'mexico': 'méxico', 'canada': 'canadá', 'costa rica': 'costa rica',
        'senegal': 'senegal', 'cameroon': 'camerún', 'ghana': 'ghana',
        'nigeria': 'nigeria', 'egypt': 'egipto', 'algeria': 'argelia',
        'ivory coast': 'costa de marfil', 'tunisia': 'túnez', 'south korea': 'corea del sur',
        'australia': 'australia', 'iran': 'irán', 'saudi arabia': 'arabia saudita'
      };
      const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const normalizedPais = normalize(pais);

      // Buscar si hay traducción, sino usar el original
      const translated = Object.keys(mapNombres).find(k => normalize(k) === normalizedPais);
      if (translated) {
        searchTerm = mapNombres[translated];
      }
    }

    // Filtrar por país/selección si se especifica
    if (searchTerm && searchTerm !== '' && searchTerm !== 'Todos') {
      query = query.ilike('categoria_relacionada', `%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error en productos:', error.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// ─── ENDPOINT: Historia de Mundiales ───
app.get('/api/historia', async (req, res) => {
  try {
    const { data, error } = await supabase.from('mundiales_historicos').select('*').order('año', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error("❌ Error en endpoint historia:", err.message);
    res.status(500).json({ error: "Error obteniendo la historia" });
  }
});

// ══════════════════════════════════════════════════════════════════
// 4. ENDPOINT PERFIL DE EQUIPO (Promiedos Style)
// ══════════════════════════════════════════════════════════════════
const equipoCache = {};
const EQUIPO_CACHE_TTL = 60 * 60 * 1000; // 1 hora

app.get('/api/equipo/:nombre', async (req, res) => {
  let { nombre } = req.params;
  nombre = nombre.trim();

  // Verificar caché
  const cacheKey = nombre.toLowerCase();
  const cached = equipoCache[cacheKey];
  if (cached) {
    const ttl = cached.ttl ?? EQUIPO_CACHE_TTL;
    if (Date.now() - cached.ts < ttl) {
      console.log(`   📦 Sirviendo perfil de ${nombre} desde caché (${ttl === EQUIPO_CACHE_TTL ? 'completo' : 'corto/fallback'})`);
      return res.json(cached.data);
    }
  }

  // Mapeo a inglés si es necesario para api-football y consultas de Supabase
  const mapNombresEn = {
    'alemania': 'Germany', 'francia': 'France', 'españa': 'Spain',
    'inglaterra': 'England', 'países bajos': 'Netherlands', 'paises bajos': 'Netherlands',
    'italia': 'Italy', 'japón': 'Japan', 'japon': 'Japan', 'marruecos': 'Morocco',
    'croacia': 'Croatia', 'bélgica': 'Belgium', 'belgica': 'Belgium', 'suiza': 'Switzerland',
    'estados unidos': 'USA', 'eeuu': 'USA', 'corea del sur': 'South Korea',
    'arabia saudita': 'Saudi Arabia', 'camerún': 'Cameroon', 'camerun': 'Cameroon',
    'canadá': 'Canada', 'canada': 'Canada', 'costa de marfil': 'Ivory Coast',
    'dinamarca': 'Denmark', 'egipto': 'Egypt', 'emiratos árabes unidos': 'United Arab Emirates',
    'gales': 'Wales', 'irán': 'Iran', 'iran': 'Iran', 'méxico': 'Mexico', 'mexico': 'Mexico',
    'nueva zelanda': 'New Zealand', 'panamá': 'Panama', 'panama': 'Panama', 'perú': 'Peru', 'peru': 'Peru',
    'polonia': 'Poland', 'senegal': 'Senegal', 'serbia': 'Serbia', 'suecia': 'Sweden',
    'turquía': 'Turkey', 'turquia': 'Turkey', 'túnez': 'Tunisia', 'tunez': 'Tunisia',
    'ucrania': 'Ukraine', 'brasil': 'Brazil', 'escocia': 'Scotland', 'irlanda': 'Ireland'
  };
  const nombreEn = mapNombresEn[nombre.toLowerCase()] || nombre;

  try {
    console.log(`\n🔍 [EQUIPO] Buscando información para: ${nombre} (${nombreEn})`);

    // Query our Supabase partidos table first for the team, to ensure we have its local matches and logo as fallback
    const activeEdicion = TEST_MODE ? 'libertadores_2026' : 'mundial_2026';
    let dbMatches = [];
    try {
      const { data } = await supabase
        .from('partidos')
        .select('*')
        .eq('edicion_mundial', activeEdicion)
        .or(`equipo_local.ilike."${nombreEn}",equipo_visitante.ilike."${nombreEn}"`)
        .order('fecha_utc', { ascending: true });
      dbMatches = data || [];
    } catch (dbErr) {
      console.warn('   ⚠️ Error querying local Supabase matches for team:', dbErr.message);
    }

    // Determine team logo and correct casing from dbMatches
    let foundLogo = null;
    let correctName = nombre;
    dbMatches.forEach(m => {
      if (m.equipo_local.toLowerCase() === nombreEn.toLowerCase() || m.equipo_local.toLowerCase() === nombre.toLowerCase()) {
        if (m.escudo_local) foundLogo = m.escudo_local;
        correctName = m.equipo_local;
      } else if (m.equipo_visitante.toLowerCase() === nombreEn.toLowerCase() || m.equipo_visitante.toLowerCase() === nombre.toLowerCase()) {
        if (m.escudo_visitante) foundLogo = m.escudo_visitante;
        correctName = m.equipo_visitante;
      }
    });

    let responseData = null;

    // We will attempt to fetch from API-Football. If it fails (due to rate-limit/error/not found), we catch and gracefully fall back.
    try {
      const searchName = nombreEn;

      // 2. Buscar ID del equipo
      const { data: teamData } = await apiFootball.get('/teams', { params: { search: searchName } });

      if (teamData.response && teamData.response.length > 0) {
        // Tomamos el primer resultado que sea selección nacional (filtrando las selecciones femeninas como USA W, Canada W)
        const teamInfo = teamData.response.find(t => 
          t.team.national === true && 
          !t.team.name.endsWith(' W') && 
          !t.team.name.includes('Women') && 
          !t.team.name.includes('Femenino')
        ) || teamData.response.find(t => t.team.national === true) || teamData.response[0];
        const teamId = teamInfo.team.id;

        console.log(`   ✅ Equipo encontrado en API: ${teamInfo.team.name} (ID: ${teamId})`);

        // 3. Consultas en paralelo (Próximos, Últimos, Plantel)
        const [nextRes, lastRes, squadRes] = await Promise.all([
          apiFootball.get('/fixtures', { params: { team: teamId, next: 5 } }).catch(() => ({ data: { response: [] } })),
          apiFootball.get('/fixtures', { params: { team: teamId, last: 5 } }).catch(() => ({ data: { response: [] } })),
          apiFootball.get('/players/squads', { params: { team: teamId } }).catch(() => ({ data: { response: [] } }))
        ]);

        let squad = squadRes.data.response[0]?.players || [];

        // Si es el Mundial y se ha publicado la lista definitiva en Sofascore (exactamente 26 jugadores)
        if (!TEST_MODE) {
          try {
            console.log(`      🔍 [SQUAD DEFINITIVO] Buscando lista oficial de 26 para ${teamInfo.team.name} en Sofascore...`);
            const searchRes = await safeSofascoreGet(`https://api.sofascore.com/api/v1/search/all?q=${encodeURIComponent(teamInfo.team.name)}`);
            const teams = searchRes.data?.results?.filter(r => r.type === 'team') || [];
            const nationalTeam = teams.find(t => t.entity?.national) || teams[0];
            if (nationalTeam) {
              const sofascoreTeamId = nationalTeam.entity.id;
              const playersRes = await safeSofascoreGet(`https://api.sofascore.com/api/v1/team/${sofascoreTeamId}/players`);
              const sofascoreSquad = playersRes.data?.players || [];
              
              if (sofascoreSquad.length === 26) {
                console.log(`      ✅ [SQUAD DEFINITIVO DETECTADO] Sofascore tiene la lista oficial de 26 para ${teamInfo.team.name}. Mapeando convocados...`);
                
                const mapPosition = (pos) => {
                  const posMap = { 'G': 'Goalkeeper', 'D': 'Defender', 'M': 'Midfielder', 'F': 'Attacker' };
                  return posMap[pos] || 'Midfielder';
                };
                
                squad = sofascoreSquad.map(item => {
                  const p = item.player;
                  let age = null;
                  if (p.dateOfBirthTimestamp) {
                    const dob = new Date(p.dateOfBirthTimestamp * 1000);
                    const ageDiff = Date.now() - dob.getTime();
                    age = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
                  } else if (p.dateOfBirth) {
                    const dob = new Date(p.dateOfBirth);
                    const ageDiff = Date.now() - dob.getTime();
                    age = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
                  }
                  return {
                    id: p.id,
                    name: p.name,
                    age: age,
                    number: p.shirtNumber || parseInt(p.jerseyNumber) || null,
                    position: mapPosition(p.position),
                    photo: `https://api.sofascore.com/api/v1/player/${p.id}/image`
                  };
                });
              } else {
                console.log(`      ⚠️ [SQUAD NO DEFINITIVO] Sofascore tiene ${sofascoreSquad.length} jugadores para ${teamInfo.team.name}. Manteniendo prelista actual.`);
              }
            }
          } catch (sofaSquadErr) {
            console.warn(`      ⚠️ Error al obtener squad de Sofascore para ${teamInfo.team.name}:`, sofaSquadErr.message);
          }
        }

        // Asegurar que el nombre de la selección se muestre en español
        if (teamInfo.team) {
          teamInfo.team.name = correctName;
        }

        responseData = {
          info: teamInfo.team,
          venue: teamInfo.venue,
          next_matches: nextRes.data.response || [],
          last_matches: lastRes.data.response || [],
          squad: squad
        };
      }
    } catch (apiErr) {
      console.warn('   ⚠️ Error or rate-limit from API-Football for team profile, using DB fallback:', apiErr.message);
    }

    // Fallback: Si no pudimos obtener la data de API-Football, armamos una respuesta coherente con los datos de Supabase
    if (!responseData) {
      console.log('   📦 [FALLBACK] Serving mapped local database team profile');
      const fallbackTeamId = 99999;
      
      // Separar partidos jugados vs programados para mapearlos
      const lastDb = dbMatches.filter(m => m.estado === 'finalizado');
      const nextDb = dbMatches.filter(m => m.estado !== 'finalizado');

      const mapMatch = (m) => {
        const isHome = m.equipo_local.toLowerCase() === nombre.toLowerCase();
        const homeWinner = m.goles_local > m.goles_visitante;
        const awayWinner = m.goles_visitante > m.goles_local;
        
        return {
          fixture: {
            id: m.id_football_data || m.id,
            date: m.fecha_utc,
            status: {
              short: m.estado === 'finalizado' ? 'FT' : 'NS'
            }
          },
          teams: {
            home: {
              id: isHome ? fallbackTeamId : 88888,
              name: m.equipo_local,
              logo: m.escudo_local,
              winner: m.estado === 'finalizado' ? homeWinner : null
            },
            away: {
              id: !isHome ? fallbackTeamId : 88888,
              name: m.equipo_visitante,
              logo: m.escudo_visitante,
              winner: m.estado === 'finalizado' ? awayWinner : null
            }
          },
          goals: {
            home: m.goles_local,
            away: m.goles_visitante
          }
        };
      };

      let sofascoreSquad = [];
      try {
        console.log(`   📡 [FALLBACK] Intentando obtener plantel desde Sofascore para ${nombre} (usando ${nombreEn})...`);
        const searchUrl = `https://api.sofascore.com/api/v1/search/all?q=${encodeURIComponent(nombreEn)}`;
        const { data: searchData } = await safeSofascoreGet(searchUrl, 8000);
        const results = searchData.results || [];
        const teams = results.filter(r => r.type === 'team' && r.entity?.sport?.slug === 'football');
        
        let targetTeam = null;
        if (teams.length > 0) {
          targetTeam = teams.find(t => 
            sofascoreTeamMatch(t.entity.name, nombreEn) && 
            !t.entity.name.includes('Women') && 
            !t.entity.name.endsWith(' W')
          ) || teams.find(t => sofascoreTeamMatch(t.entity.name, nombreEn)) || teams[0];
        }

        if (targetTeam) {
          const teamId = targetTeam.entity.id;
          console.log(`   ✅ Equipo encontrado en Sofascore: ${targetTeam.entity.name} (ID: ${teamId})`);
          const playersUrl = `https://api.sofascore.com/api/v1/team/${teamId}/players`;
          const { data: squadData } = await safeSofascoreGet(playersUrl, 8000);
          const players = squadData.players || [];
          
          if (players.length === 26) {
            sofascoreSquad = players.map(p => {
              let posStr = 'Midfielder';
              if (p.player.position === 'G') posStr = 'Goalkeeper';
              else if (p.player.position === 'D') posStr = 'Defender';
              else if (p.player.position === 'M') posStr = 'Midfielder';
              else if (p.player.position === 'F') posStr = 'Attacker';

              let age = null;
              if (p.player.dateOfBirthTimestamp) {
                age = Math.floor((Date.now() / 1000 - p.player.dateOfBirthTimestamp) / (365.25 * 24 * 60 * 60));
              }

              return {
                name: p.player.name,
                position: posStr,
                photo: `https://api.sofascore.com/api/v1/player/${p.player.id}/image`,
                age: age
              };
            });
            console.log(`   ✅ Plantel de ${sofascoreSquad.length} jugadores cargado exitosamente desde Sofascore`);
          } else {
            console.log(`   ⚠️ [SQUAD NO DEFINITIVO] Sofascore tiene ${players.length} jugadores para ${nombreEn}. Se requiere lista oficial de 26.`);
            sofascoreSquad = [];
          }
        } else {
          console.warn(`   ⚠️ No se encontró el equipo en Sofascore.`);
        }
      } catch (sofaSquadErr) {
        console.warn(`   ⚠️ Error al obtener plantel de Sofascore:`, sofaSquadErr.message);
        if (sofaSquadErr.response) {
          console.warn(`      Status:`, sofaSquadErr.response.status);
          console.warn(`      Headers:`, JSON.stringify(sofaSquadErr.response.headers));
          console.warn(`      Body:`, JSON.stringify(sofaSquadErr.response.data));
        }
      }

      responseData = {
        info: {
          id: fallbackTeamId,
          name: correctName,
          logo: foundLogo || 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#0a2a4a"/><text x="50" y="55" font-size="30" text-anchor="middle" fill="white">⚽</text></svg>'),
          national: true,
          country: correctName
        },
        venue: null,
        next_matches: nextDb.map(mapMatch),
        last_matches: lastDb.map(mapMatch),
        squad: sofascoreSquad
      };
    }

    // Aplicar traducción de selecciones en la respuesta del perfil del equipo
    if (responseData) {
      if (responseData.info) {
        responseData.info.name = translateTeam(responseData.info.name);
        responseData.info.country = translateTeam(responseData.info.country);
      }
      const translateMatchTeams = (m) => {
        if (m.teams?.home) m.teams.home.name = translateTeam(m.teams.home.name);
        if (m.teams?.away) m.teams.away.name = translateTeam(m.teams.away.name);
        return m;
      };
      responseData.next_matches = (responseData.next_matches || []).map(translateMatchTeams);
      responseData.last_matches = (responseData.last_matches || []).map(translateMatchTeams);
    }

    // Guardar en caché con TTL dinámico (10 segundos si es fallback/lista vacía, de lo contrario 1 hora)
    const isFallback = !responseData.squad || responseData.squad.length === 0;
    const ttl = isFallback ? 10000 : EQUIPO_CACHE_TTL;
    equipoCache[cacheKey] = { data: responseData, ts: Date.now(), ttl };

    res.json(responseData);

  } catch (error) {
    console.error('❌ Error obteniendo perfil de equipo:', error.message);
    res.status(500).json({ error: 'Error interno obteniendo datos del equipo' });
  }
});


// ══════════════════════════════════════════════════════════════════
// MIDDLEWARE DE ERRORES (Express 5 — atrapa errores de rutas async)
// ══════════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('💥 Error en ruta:', err.message);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// ──────────────────────────────────────────────────────────────────
// CONTEXTO DEL CHATBOT (System Prompt)
//
// CONCEPTO CLAVE — "System Prompt":
//   Es el primer mensaje que le damos a la IA antes de que el usuario
//   escriba algo. Define la "personalidad" y las reglas del chatbot.
//   El modelo LLM (Gemini) intentará siempre respetar estas reglas.
//
// ESTRUCTURA:
//   1. ROL: quién es el chatbot
//   2. CONOCIMIENTO: qué sabe (Mundial 2026)
//   3. COMPORTAMIENTO COMERCIAL: cuándo y cómo mencionar productos
//   4. COMPORTAMIENTO DE CALENDARIO: cuándo y cómo ofrecer agendar
//   5. LÍMITES: sobre qué NO hablar
// ──────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
Sos "Mundialito Bot", el asistente oficial de la web Mundialito 2026.
Tu especialidad es el fútbol, especialmente el Mundial FIFA 2026.

INFORMACIÓN CLAVE DEL MUNDIAL 2026:
- Sede: Estados Unidos, México y Canadá (primer Mundial en 3 países)
- Fechas: 11 de junio al 19 de julio de 2026
- Equipos: 48 selecciones (primer Mundial con ese formato)
- Estadios: 16 estadios en total distribuidos en las 3 sedes
- Grupos: 12 grupos de 4 equipos, los 2 primeros más los 8 mejores terceros avanzan
- Favoritos históricos: Argentina (campeón vigente), Francia, Brasil, España, Alemania, Inglaterra

SEDE POR CIUDAD (principales):
- Nueva York/New Jersey: MetLife Stadium (final)
- Los Angeles: SoFi Stadium
- Dallas: AT&T Stadium
- San Francisco: Levi's Stadium
- Miami: Hard Rock Stadium
- Houston: NRG Stadium
- Ciudad de México: Estadio Azteca
- Guadalajara: Estadio Akron
- Monterrey: Estadio BBVA
- Toronto: BMO Field
- Vancouver: BC Place

REGLAS DE COMPORTAMIENTO:

1. SIEMPRE respondé en español rioplatense (usás "vos", "che", etc.)
2. Respondé preguntas de fútbol con precisión y entusiasmo
3. Sé conciso: máximo 3-4 párrafos por respuesta
4. CUANDO RECOMIENDES PRODUCTOS: - Usá SIEMPRE los productos reales que te pasamos en el contexto. - Mencioná el nombre exacto y el precio real. - Ejemplo correcto: "Y si sos hincha, en nuestra tienda tenemos  
la 'Camiseta Argentina 2026' por $45.000." - NUNCA inventes productos, precios o links que no estén en el contexto. - Si no hay productos disponibles, decilo honestamente. - Hacelo de forma natural, no forzada, en aprox el 60% de las respuestas

5. DETECCIÓN DE FECHAS Y PARTIDOS:
   Si el usuario pregunta por un partido específico entre dos selecciones,
   o por cuándo juega un equipo, DESPUÉS de responder agregá este bloque
   EXACTAMENTE así (con el separador ---CALENDARIO---).
   
   CASO A — Partido específico entre dos equipos (prioritario):
   Cuando el usuario pregunta por un enfrentamiento concreto (ej: "cuándo
   juega Argentina vs Austria"), usá SIEMPRE este formato:
   
   ---CALENDARIO---
   {"equipo1":"[equipo local]","equipo2":"[equipo visitante]","fecha":"YYYY-MM-DD","hora_arg":"HH:MM","descripcion":"[fase del torneo]"}
   
   - "fecha" debe estar en formato YYYY-MM-DD (ej: "2026-06-15")
   - "hora_arg" debe estar en formato HH:MM en hora de Argentina UTC-3 (ej: "21:00").
     Si no sabés la hora exacta, usá "18:00" como valor por defecto.
   - Si no sabés la fecha exacta, estimá la más probable dentro de junio-julio 2026.
   
   Ejemplo para Argentina vs Austria:
   ---CALENDARIO---
   {"equipo1":"Argentina","equipo2":"Austria","fecha":"2026-06-15","hora_arg":"21:00","descripcion":"Fase de grupos — Mundial FIFA 2026"}
   
   CASO B — Solo un equipo (sin rival específico):
   Cuando el usuario pregunta por los partidos de un equipo en general,
   sin mencionar rival, usá este formato reducido:
   
   ---CALENDARIO---
   {"equipo":"[nombre del equipo]","descripcion":"[descripción]","fecha_aprox":"[mes/fecha aproximada]"}
   
   Ejemplo:
   ---CALENDARIO---
   {"equipo":"Argentina","descripcion":"Partidos de Argentina en el Mundial 2026","fecha_aprox":"Junio 2026"}
   
   IMPORTANTE: Nunca mezcles los dos formatos. Elegí el que corresponde.

6. LÍMITES: Solo respondés sobre fútbol. Si te preguntan sobre otro
   tema, decís amablemente que sos un especialista en fútbol y
   redirigís la conversación.

7. TONO: Apasionado, amigable, como un hincha experto. Podés usar
   emojis con moderación (⚽🏆🔥).
`;


// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: llamar a la API de Gemini
//
// CONCEPTO — Por qué llamamos a Gemini desde el backend y no
// directamente desde el frontend:
//   Mismo motivo que GNews: proteger la API Key. Si el frontend
//   llamara a Gemini directo, tu key quedaría expuesta en el navegador.
//
// PARÁMETROS:
//   historial: Array de mensajes anteriores (para que Gemini recuerde
//              el contexto de la conversación)
//   mensajeNuevo: El último mensaje del usuario
// ──────────────────────────────────────────────────────────────────
async function llamarGemini(historial, mensajeNuevo) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  // Gemini espera el historial en este formato:
  // [{ role: "user", parts: [{ text: "..." }] },
  //  { role: "model", parts: [{ text: "..." }] }, ...]
  //
  // El "system prompt" va como primer mensaje del usuario
  // y la respuesta del modelo es un ACK simple.
  const contents = [
    // Contexto inicial (system prompt disfrazado de conversación)
    {
      role: "user",
      parts: [{ text: `INSTRUCCIONES DE SISTEMA:\n${SYSTEM_PROMPT}` }]
    },
    {
      role: "model",
      parts: [{ text: "Entendido. Soy Mundialito Bot, listo para responder preguntas sobre el Mundial 2026. ¡Dale, preguntame lo que quieras!" }]
    },
    // Historial previo de la conversación (máximo últimos 10 mensajes
    // para no superar el límite de tokens)
    ...historial.slice(-10),
    // El nuevo mensaje del usuario
    {
      role: "user",
      parts: [{ text: mensajeNuevo }]
    }
  ];

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.8,      // Creatividad (0=robótico, 1=creativo)
        maxOutputTokens: 4000, // Aumentado para evitar que se corte la respuesta
        topP: 0.9,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${errorData.error?.message || response.status}`);
  }

  const data = await response.json();
  // La respuesta del modelo está anidada en esta estructura
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: llamar a la API de Groq (FALLBACK)
// ──────────────────────────────────────────────────────────────────
async function llamarGroq(historial, mensajeNuevo) {
  const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

  // Formateamos el historial de Gemini al formato de OpenAI (que usa Groq)
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "assistant", content: "Entendido. Soy Mundialito Bot, listo para responder preguntas sobre el Mundial 2026. ¡Dale, preguntame lo que quieras!" }
  ];

  for (const msg of historial.slice(-10)) {
    messages.push({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0].text
    });
  }

  messages.push({ role: "user", content: mensajeNuevo });

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.8,
      max_tokens: 600
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Groq API error: ${errorData.error?.message || response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content || '';
}


// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: buscar productos relevantes en Supabase
//
// Cuando Gemini menciona una selección, buscamos productos
// relacionados en la BD para incluirlos en la respuesta.
// Así el chatbot puede decir "tenemos esta camiseta" con datos reales.
// ──────────────────────────────────────────────────────────────────
async function buscarProductosRelevantes(texto) {
  // Extraemos posibles nombres de selecciones del texto de Gemini
  // Lista de selecciones a detectar (expandir según tu tienda)
  const selecciones = [
    'Argentina', 'Brasil', 'Francia', 'España', 'Alemania',
    'Inglaterra', 'Uruguay', 'México', 'Colombia', 'Portugal',
    'Italia', 'Holanda', 'Países Bajos', 'Croacia', 'Marruecos'
  ];

  const encontrada = selecciones.find(s =>
    texto.toLowerCase().includes(s.toLowerCase())
  );

  if (!encontrada) return [];

  try {
    // Buscamos en la tabla productos_ml (la que ya tenés en Supabase)
    const { data } = await supabase
      .from('products_url')
      .select('nombre, precio, link_afiliado, imagen_url, categoria_relacionada')
      .eq('categoria_relacionada', encontrada)
      .eq('activo', true)
      .limit(2);  // Máximo 2 productos para no sobrecargar

    return data || [];
  } catch {
    return [];
  }
}


// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: parsear bloque de calendario
//
// Gemini puede incluir un bloque especial en su respuesta
// si detecta que el usuario pregunta por fechas/partidos.
// Esta función extrae ese bloque y lo devuelve separado.
// ──────────────────────────────────────────────────────────────────
function parsearCalendario(textoRespuesta) {
  const separador = '---CALENDARIO---';
  const idx = textoRespuesta.indexOf(separador);

  if (idx === -1) {
    return { texto: textoRespuesta, calendario: null };
  }

  const texto     = textoRespuesta.substring(0, idx).trim();
  const jsonParte = textoRespuesta.substring(idx + separador.length).trim();

  // Gemini a veces agrega texto o saltos de línea después del JSON.
  // Extraemos solo el primer objeto JSON válido con una regex.
  const matchJSON = jsonParte.match(/\{[\s\S]*?\}/);
  if (!matchJSON) {
    return { texto, calendario: null };
  }

  try {
    const calendario = JSON.parse(matchJSON[0]);

    // Normalizar Caso A: asegurar que fecha y hora_arg tengan formato válido.
    if (calendario.equipo1 && calendario.equipo2) {
      if (!calendario.hora_arg || !/^\d{2}:\d{2}$/.test(calendario.hora_arg)) {
        calendario.hora_arg = '18:00';
      }
      if (!calendario.fecha || !/^\d{4}-\d{2}-\d{2}$/.test(calendario.fecha)) {
        calendario.fecha = '2026-06-15';
      }
    }

    return { texto, calendario };
  } catch {
    return { texto, calendario: null };
  }
}


// ──────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: buscar información en internet usando Tavily
// ──────────────────────────────────────────────────────────────────
async function buscarEnInternet(query) {
  // Recargar .env por si el archivo se guardó mientras el servidor estaba corriendo
  require('dotenv').config({ override: true });
  
  if (!process.env.TAVILY_API_KEY) {
    console.warn("⚠️ Falta TAVILY_API_KEY en el .env, omitiendo búsqueda en internet.");
    return "";
  }
  
  console.log("🌐 Buscando en internet con Tavily la consulta:", query);
  
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: "basic",
        max_results: 3
      })
    });
    
    if (!response.ok) {
      console.warn("⚠️ Error en respuesta de Tavily:", response.status);
      return "";
    }
    
    const data = await response.json();
    if (data && data.results && data.results.length > 0) {
      console.log(`   ✅ Tavily encontró ${data.results.length} resultados.`);
      return data.results.map(r => r.content).join('\n\n');
    }
    console.log("   ℹ️ Tavily no encontró resultados.");
    return "";
  } catch (err) {
    console.error("❌ Error conectando con Tavily:", err.message);
    return "";
  }
}


// ══════════════════════════════════════════════════════════════════
// ENDPOINT: POST /api/chat
//
// REQUEST BODY (JSON):
//   {
//     "mensaje": "¿Cuándo juega Argentina?",
//     "historial": [
//       { "role": "user",  "parts": [{ "text": "Hola" }] },
//       { "role": "model", "parts": [{ "text": "¡Hola! Soy Mundialito Bot..." }] }
//     ]
//   }
//
// RESPONSE (JSON):
//   {
//     "respuesta": "Argentina juega en el Grupo...",
//     "productos": [...],   // puede ser array vacío
//     "calendario": {       // puede ser null
//       "equipo": "Argentina",
//       "descripcion": "Partido de Argentina...",
//       "fecha_aprox": "Junio 2026"
//     }
//   }
// ══════════════════════════════════════════════════════════════════
app.post('/api/chat', async (req, res) => {
  const { mensaje, historial = [] } = req.body;

  if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
    return res.status(400).json({ error: 'El campo "mensaje" es requerido.' });
  }

  try {
    // ── PASO 1: Buscar productos relevantes ANTES de llamar a Gemini ── 
    // Detectamos qué selección menciona el usuario en su mensaje 
    const selecciones = [
      'Argentina', 'Brasil', 'Francia', 'España', 'Alemania',
      'Inglaterra', 'Uruguay', 'México', 'Colombia', 'Portugal',
      'Croacia', 'Marruecos', 'Países Bajos', 'Holanda', 'Portugal'
    ];

    const seleccionDetectada = selecciones.find(s =>
      mensaje.toLowerCase().includes(s.toLowerCase())
    );

    // Traemos productos de Supabase según la selección detectada 
    // Si no hay selección específica, traemos productos generales (los primeros 3) 
    let productosParaGemini = [];
    let queryProductos = supabase
      .from('productos_ml')
      .select('nombre, precio, link_afiliado, imagen_url, categoria_relacionada')
      .eq('activo', true)
      .limit(3);

    if (seleccionDetectada) {
      queryProductos = queryProductos.eq('categoria_relacionada', seleccionDetectada);
    }

    const { data: productosDB } = await queryProductos;
    productosParaGemini = productosDB || [];

    // ── PASO 2: Construir el contexto de productos para Gemini ── 
    // Le "mostramos" los productos reales a Gemini antes de que responda 
    let contextoProductos = '';
    if (productosParaGemini.length > 0) {
      contextoProductos = ` 
PRODUCTOS DISPONIBLES EN NUESTRA TIENDA (usá estos datos reales al 
recomendar): 
${productosParaGemini.map((p, i) =>
        `${i + 1}. "${p.nombre}" — $${p.precio} — Link: ${p.link_afiliado}`
      ).join('\n')} 
 
Cuando recomiendes productos, mencioná el nombre exacto y el precio real de la lista 
anterior. 
`;
    } else {
      contextoProductos = ` 
No hay productos disponibles en la tienda para esta selección por el momento. 
Si querés recomendar algo, hacelo de forma genérica sin inventar precios ni links. 
`;
    }

    // ── PASO 3: Buscar en internet con Tavily (RAG) ── 
    const contextoWeb = await buscarEnInternet(mensaje.trim());
    let textoContextoWeb = '';
    if (contextoWeb) {
      textoContextoWeb = `\nINFORMACIÓN RECIENTE DE INTERNET:\n${contextoWeb}\nUtiliza esta información para responder la pregunta del usuario si es necesario.\n`;
    }

    // ── PASO 4: Llamar a Gemini con el contexto de productos y web ── 
    const mensajeConContexto = `${contextoProductos}${textoContextoWeb}\n\nPREGUNTA DEL USUARIO: 
${mensaje.trim()}`;
    
    let respuestaCompleta;
    try {
      respuestaCompleta = await llamarGemini(historial, mensajeConContexto);
    } catch (geminiErr) {
      console.error('⚠️ Error con Gemini, intentando fallback con Groq:', geminiErr.message);
      respuestaCompleta = await llamarGroq(historial, mensajeConContexto);
    }

    // ── PASO 5: Parsear calendario y devolver respuesta ── 
    const { texto, calendario } = parsearCalendario(respuestaCompleta);

    res.json({
      respuesta: texto,
      productos: productosParaGemini,  // productos reales de la BD 
      calendario,
    });

  } catch (err) {
    console.error('❌[/api/chat] Error:', err.message);
    res.status(500).json({
      error: 'No pude procesar tu pregunta.',
      respuesta: '¡Ups! Tuve un problema técnico. Intentá de nuevo. ⚽'
    });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: PUT /api/prode_groups/:id
// Actualiza nombre o visibilidad de un grupo (solo admin)
// ══════════════════════════════════════════════════════════════════
app.put('/api/prode_groups/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, es_publico, admin_id } = req.body;

  if (!admin_id) return res.status(400).json({ error: 'Falta admin_id' });

  try {
    const updateData = { updated_at: new Date().toISOString() };
    if (nombre !== undefined) updateData.nombre = nombre;
    if (es_publico !== undefined) updateData.es_publico = es_publico;

    const { data, error } = await supabase
      .from('prode_groups')
      .update(updateData)
      .eq('id', id)
      .eq('admin_id', admin_id)
      .select();
      
    if (error) throw error;
    if (!data || data.length === 0) {
       return res.status(403).json({ error: 'No autorizado o grupo no existe' });
    }
    
    res.json({ success: true, group: data[0] });
  } catch (err) {
    console.error('Error actualizando grupo:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: POST /api/prode_groups/join
// Unirse a un grupo mediante código de invitación
// ══════════════════════════════════════════════════════════════════
app.post('/api/prode_groups/join', async (req, res) => {
  const { invite_code, user_id } = req.body;
  if (!invite_code || !user_id) return res.status(400).json({ error: 'Faltan datos' });

  try {
    // 1. Buscar grupo
    const { data: group, error: findErr } = await supabase
      .from('prode_groups')
      .select('id, nombre')
      .eq('invite_code', invite_code.toUpperCase())
      .single();

    if (findErr || !group) {
      return res.status(404).json({ error: 'Código inválido o grupo no encontrado.' });
    }

    // 2. Verificar si ya es miembro
    const { data: member } = await supabase
      .from('prode_group_members')
      .select('group_id')
      .eq('group_id', group.id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (member) {
      return res.status(400).json({ error: `Ya sos miembro de "${group.nombre}".` });
    }

    // 2.5 Verificar límite de miembros (máx 25)
    const { count, error: errCount } = await supabase
      .from('prode_group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group.id);
    
    if (errCount) {
      return res.status(500).json({ error: 'Error verificando la capacidad del grupo.' });
    }
    
    if (count >= 25) {
      return res.status(400).json({ error: 'El grupo ya alcanzó el límite máximo de 25 participantes.' });
    }

    // 3. Unirse al grupo
    const { error: joinErr } = await supabase
      .from('prode_group_members')
      .insert({ group_id: group.id, user_id: user_id });

    if (joinErr) throw joinErr;

    res.json({ success: true, group_name: group.nombre });
  } catch (err) {
    console.error('Error uniendose al grupo:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: DELETE /api/prode_groups/:id
// Elimina un grupo y todos sus miembros (solo admin)
// ══════════════════════════════════════════════════════════════════
app.delete('/api/prode_groups/:id', async (req, res) => {
  const { id } = req.params;
  const { admin_id } = req.body;

  if (!admin_id) return res.status(400).json({ error: 'Falta admin_id' });

  try {
    // 1. Verificar permisos
    const { data: group, error: findErr } = await supabase
      .from('prode_groups')
      .select('admin_id')
      .eq('id', id)
      .single();

    if (findErr || !group) {
      return res.status(404).json({ error: 'Grupo no encontrado.' });
    }
    if (group.admin_id !== admin_id) {
      return res.status(403).json({ error: 'No autorizado para borrar este grupo.' });
    }

    // 2. Borrar miembros
    await supabase.from('prode_group_members').delete().eq('group_id', id);

    // 3. Borrar grupo
    const { error: delErr } = await supabase.from('prode_groups').delete().eq('id', id);
    if (delErr) throw delErr;

    res.json({ success: true });
  } catch (err) {
    console.error('Error borrando grupo:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: POST /api/stats/update
// Actualiza stats de un juego para un usuario.
// ══════════════════════════════════════════════════════════════════
app.post('/api/stats/update', async (req, res) => {
  const { user_id, game_name, score, current_streak } = req.body;
  
  if (!user_id || !game_name) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos: user_id y game_name' });
  }

  try {
    // Buscar estadística actual
    const { data: stats, error: findErr } = await supabase
      .from('game_stats')
      .select('max_score, max_streak')
      .eq('user_id', user_id)
      .eq('game_name', game_name)
      .single();

    if (findErr && findErr.code !== 'PGRST116') {
      throw findErr;
    }

    const currentMaxScore = stats ? stats.max_score : 0;
    const currentMaxStreak = stats ? stats.max_streak : 0;

    const newScore = score !== undefined ? score : 0;
    const newStreak = current_streak !== undefined ? current_streak : 0;

    const newMaxScore = Math.max(currentMaxScore, newScore);
    const newMaxStreak = Math.max(currentMaxStreak, newStreak);

    const upsertData = {
      user_id,
      game_name,
      max_score: newMaxScore,
      current_streak: newStreak,
      max_streak: newMaxStreak,
      last_played_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: upsertErr } = await supabase
      .from('game_stats')
      .upsert(upsertData, { onConflict: 'user_id, game_name' });

    if (upsertErr) throw upsertErr;

    res.json({ success: true, message: 'Stats actualizadas', data: upsertData });
  } catch (err) {
    console.error('Error en /api/stats/update:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: GET /api/stats/ranking/:game_name
// Ranking global de un juego, paginado.
// ══════════════════════════════════════════════════════════════════
app.get('/api/stats/ranking/:game_name', async (req, res) => {
  const { game_name } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const { data, error, count } = await supabase
      .from('game_stats')
      .select('max_score, max_streak, current_streak, profiles!inner(username, avatar_url)', { count: 'exact' })
      .eq('game_name', game_name)
      .order('max_score', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const ranking = data.map(row => ({
      username: row.profiles.username,
      avatar_url: row.profiles.avatar_url,
      max_score: row.max_score,
      max_streak: row.max_streak,
      current_streak: row.current_streak
    }));

    res.json({
      success: true,
      game_name,
      total: count,
      limit,
      offset,
      ranking
    });
  } catch (err) {
    console.error('Error en /api/stats/ranking:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: GET /api/users/:user_id/profile
// Perfil público de un usuario y sus stats.
// ══════════════════════════════════════════════════════════════════
app.get('/api/users/:user_id/profile', async (req, res) => {
  const { user_id } = req.params;

  try {
    // Perfil básico
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, puntos_prode, created_at')
      .eq('id', user_id)
      .single();

    if (profErr || !profile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Stats de los juegos
    const { data: stats, error: statsErr } = await supabase
      .from('game_stats')
      .select('game_name, max_score, current_streak, max_streak, last_played_at')
      .eq('user_id', user_id);

    if (statsErr) throw statsErr;

    res.json({
      success: true,
      profile,
      game_stats: stats || []
    });
  } catch (err) {
    console.error('Error en /api/users/:user_id/profile:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ══════════════════════════════════════════════════════════════════
// ARRANQUE DEL SERVIDOR
// ══════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 API de Mundialito escuchando peticiones en puerto ${PORT}`);
  console.log(`   📡 Probar: http://localhost:${PORT}/api/health`);
  console.log(`   📰 Noticias: http://localhost:${PORT}/api/noticias`);
  console.log(`   🛒 Productos: http://localhost:${PORT}/api/productos`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`⚠️ Puerto ${PORT} ya está en uso. Probando puerto ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`🚀 API de Mundialito escuchando en puerto alternativo ${PORT + 1}`);
    });
  } else {
    console.error('💥 Error iniciando servidor:', err.message);
  }
});
