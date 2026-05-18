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
const axios            = require('axios');
const cron             = require('node-cron');
const express = require('express');
const cors    = require('cors');
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
const TEST_MODE = process.env.TEST_MODE === 'false';

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
  fixture:    { data: null, ts: 0 },
  standings:  { data: null, ts: 0 },
  scorers:    { data: null, ts: 0 },
  live:       { data: null, ts: 0 },
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
    const partidos  = data.matches;

    if (!partidos?.length) {
      console.log('   Sin partidos en la respuesta.');
      return;
    }

    const rows = partidos.map(p => ({
      id_football_data:  p.id,
      fase:              p.group
                           ? `Grupo ${p.group}`
                           : (p.stage || 'Fase eliminatoria'),
      jornada:           p.matchday,
      fecha_utc:         p.utcDate,
      // Usamos ?. para evitar errores y ponemos "Por definirse" si viene nulo
      equipo_local:      p.homeTeam?.shortName || p.homeTeam?.name || 'Por definirse',
      equipo_visitante:  p.awayTeam?.shortName || p.awayTeam?.name || 'Por definirse',
      escudo_local:      p.homeTeam?.crest || null,
      escudo_visitante:  p.awayTeam?.crest || null,
      estado:            mapearEstado(p.status),
      // También protegemos los goles por si fullTime viene nulo
      goles_local:       p.score?.fullTime?.home ?? null,
      goles_visitante:   p.score?.fullTime?.away ?? null,
      updated_at:        new Date().toISOString(),
    }));

    // UPSERT masivo — el trigger calcular_puntos_prode se dispara
    // automáticamente si estado cambia a 'finalizado'
    const { error } = await supabase
      .from('partidos')
      .upsert(rows, { onConflict: 'id_football_data' });

    if (error) throw error;
    console.log(`   ✅ ${rows.length} partidos actualizados.`);

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
  // Preguntamos a NUESTRA BD antes de gastar cuota en la API externa
  const { data: enCurso, error: errConsulta } = await supabase
    .from('partidos')
    .select('id, id_api_football, equipo_local, equipo_visitante')
    .eq('estado', 'en_curso');

  if (errConsulta) {
    console.error('Error consultando en_curso:', errConsulta.message);
    return;
  }
  if (!enCurso?.length) return; // No hay partidos → no gastar cuota

  console.log(`\n🔥 [LIVE] ${enCurso.length} partido(s) en curso. Consultando API-Football...`);

  try {
    const { data } = await apiFootball.get('/fixtures', { params: { live: 'all' } });
    const fixtures  = data.response || [];

    if (!fixtures.length) {
      console.log('   API-Football no reporta partidos en vivo.');
      return;
    }

    for (const partido of enCurso) {
      // Cruzar por id_api_football si ya está mapeado, sino por nombre de equipo
      const normalize = s => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
  .replace(/[^a-z0-9]/g, '');                       // solo alfanumérico

    const fixture = fixtures.find(f =>
      (partido.id_api_football && f.fixture.id === partido.id_api_football) ||
      normalize(f.teams.home.name).includes(normalize(partido.equipo_local)) ||
      normalize(f.teams.away.name).includes(normalize(partido.equipo_visitante))
);

      if (!fixture) continue;

      const statsHome = fixture.statistics?.[0]?.statistics || [];
      const statsAway = fixture.statistics?.[1]?.statistics || [];

      const getStat = (arr, type) => {
        const s = arr.find(x => x.type === type);
        return s ? (parseInt(s.value) || 0) : 0;
      };

      const estadisticas = {
        posesion_local:      getStat(statsHome, 'Ball Possession'),
        posesion_visitante:  getStat(statsAway, 'Ball Possession'),
        tiros_local:         getStat(statsHome, 'Total Shots'),
        tiros_visitante:     getStat(statsAway, 'Total Shots'),
        tiros_al_arco_local: getStat(statsHome, 'Shots on Goal'),
        tiros_al_arco_visit: getStat(statsAway, 'Shots on Goal'),
        corners_local:       getStat(statsHome, 'Corner Kicks'),
        corners_visitante:   getStat(statsAway, 'Corner Kicks'),
        faltas_local:        getStat(statsHome, 'Fouls'),
        faltas_visitante:    getStat(statsAway, 'Fouls'),
        amarillas_local:     getStat(statsHome, 'Yellow Cards'),
        amarillas_visitante: getStat(statsAway, 'Yellow Cards'),
      };

      const { error } = await supabase
        .from('partidos')
        .update({
          goles_local:     fixture.goals.home,
          goles_visitante: fixture.goals.away,
          minuto:          fixture.fixture.status.elapsed,
          id_api_football: fixture.fixture.id,
          estadisticas,
          updated_at:      new Date().toISOString(),
        })
        .eq('id', partido.id);

      if (error) {
        console.error(`   ❌ Error actualizando ${partido.id}:`, error.message);
      } else {
        console.log(`   ⚽ ${partido.equipo_local} ${fixture.goals.home}-${fixture.goals.away} ${partido.equipo_visitante} (${fixture.fixture.status.elapsed}')`);
      }
    }

  } catch (err) {
    console.error('   ❌ Error en actualizarEnVivo:', err.message);
  }
}

// Cada 3 minutos — 30 req por partido de 90 min, te sobran para el día
// Cada 3 minutos — 30 req por partido de 90 min, te sobran para el día
cron.schedule('*/3 * * * *', actualizarEnVivo);

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

    if (rows.length > 0) {
      const { error } = await supabase.from('goleadores').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      console.log(`   ✅ ${rows.length} goleadores actualizados.`);
    }
  } catch (err) {
    console.error('   ❌ Error en actualizarGoleadores:', err.message);
  }
}

async function actualizarTarjetas() {
  console.log('\n🟨 [TARJETAS] Actualizando tarjetas...');
  try {
    // Para modo TEST (Libertadores), forzamos la temporada 2024 para asegurarnos de tener datos.
    // Para el Mundial 2026, usamos 2026.
    const currentSeason = TEST_MODE ? 2024 : 2026;
    
    const [yellow, red] = await Promise.all([
      apiFootball.get('/players/topyellowcards', { params: { league: LIVE_LEAGUE_ID, season: currentSeason } }).catch(() => ({ data: { response: [] } })),
      apiFootball.get('/players/topredcards', { params: { league: LIVE_LEAGUE_ID, season: currentSeason } }).catch(() => ({ data: { response: [] } }))
    ]);

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

    const rows = Array.from(cardsMap.values());
    
    // Limpiar tabla antes de insertar para no mezclar datos de Libertadores con el Mundial
    await supabase.from('tarjetas').delete().neq('id', 'borrar_todo');
    
    if (rows.length > 0) {
      const { error } = await supabase.from('tarjetas').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      console.log(`   ✅ ${rows.length} jugadores con tarjetas actualizados.`);
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
      id_thesports:   e.idEvent,
      nombre:         e.strEvent,
      fecha:          e.dateEvent,
      equipo_local:   e.strHomeTeam,
      equipo_visitante: e.strAwayTeam,
      goles_local:    parseInt(e.intHomeScore) || null,
      goles_visitante: parseInt(e.intAwayScore) || null,
      temporada:      e.strSeason,
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
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Referer': 'https://www.sofascore.com/'
};

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
    posesion_local:      parsePercent(getGroupStat('Match overview', 'Ball possession')?.home),
    posesion_visitante:  parsePercent(getGroupStat('Match overview', 'Ball possession')?.away),
    tiros_local:         parseNum(getGroupStat('Match overview', 'Total shots')?.home),
    tiros_visitante:     parseNum(getGroupStat('Match overview', 'Total shots')?.away),
    tiros_al_arco_local: parseNum(getGroupStat('Shots', 'Shots on target')?.home),
    tiros_al_arco_visit: parseNum(getGroupStat('Shots', 'Shots on target')?.away),
    corners_local:       parseNum(getGroupStat('Match overview', 'Corner kicks')?.home),
    corners_visitante:   parseNum(getGroupStat('Match overview', 'Corner kicks')?.away),
    faltas_local:        parseNum(getGroupStat('Match overview', 'Fouls')?.home),
    faltas_visitante:    parseNum(getGroupStat('Match overview', 'Fouls')?.away),
    amarillas_local:     parseNum(getGroupStat('Match overview', 'Yellow cards')?.home),
    amarillas_visitante: parseNum(getGroupStat('Match overview', 'Yellow cards')?.away),
  };
}

async function fetchSofascoreGoals(matchId, localName, visName) {
  try {
    const { data: incData } = await axios.get(
      `https://api.sofascore.com/api/v1/event/${matchId}/incidents`,
      { headers: SOFASCORE_HEADERS, timeout: 10000 }
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
setTimeout(poblarEstadisticasSofascore, 15000);
// Repetir cada 2 horas para capturar nuevos partidos finalizados
cron.schedule('10 */2 * * *', poblarEstadisticasSofascore);

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
        goles_local:     ssMatch.homeScore?.current ?? null,
        goles_visitante: ssMatch.awayScore?.current ?? null,
        minuto:          ssMatch.time?.currentPeriodStartTimestamp
                           ? Math.floor((Date.now() / 1000 - ssMatch.time.currentPeriodStartTimestamp) / 60)
                           : ssMatch.statusDescription || null,
        updated_at:      new Date().toISOString(),
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
cron.schedule('*/3 * * * *', actualizarEnVivoSofascore);


// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════

/**
 * Mapea los estados de Football-Data.org a nuestro enum de la BD.
 */
function mapearEstado(status) {
  const mapa = {
    'SCHEDULED':  'programado',
    'TIMED':      'programado',
    'IN_PLAY':    'en_curso',
    'PAUSED':     'en_curso',     // entretiempo sigue siendo en_curso
    'EXTRA_TIME': 'en_curso',
    'PENALTY':    'en_curso',
    'FINISHED':   'finalizado',
    'AWARDED':    'finalizado',
    'SUSPENDED':  'suspendido',
    'CANCELLED':  'suspendido',
    'POSTPONED':  'suspendido',
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

// ══════════════════════════════════════════════════════════════════
// ENDPOINT: FIXTURE COMPLETO (cacheado desde Football-Data.org)
// ══════════════════════════════════════════════════════════════════
app.get('/api/fixture', async (req, res) => {
    try {
        let cached = getCached('fixture');
        if (cached) return res.json(cached);

        const { data } = await footballData.get(`/competitions/${COMPETITION_ID}/matches`);
        const partidos = (data.matches || []).map(p => ({
            id: p.id,
            grupo: p.group || null,
            fase: p.stage || '',
            jornada: p.matchday,
            fecha_utc: p.utcDate,
            equipo_local: p.homeTeam?.name || 'Por definir',
            equipo_local_short: p.homeTeam?.shortName || p.homeTeam?.tla || '',
            equipo_visitante: p.awayTeam?.name || 'Por definir',
            equipo_visitante_short: p.awayTeam?.shortName || p.awayTeam?.tla || '',
            escudo_local: p.homeTeam?.crest || null,
            escudo_visitante: p.awayTeam?.crest || null,
            goles_local: p.score?.fullTime?.home,
            goles_visitante: p.score?.fullTime?.away,
            estado: mapearEstado(p.status),
            estadio: p.venue || null,
        }));

        setCache('fixture', partidos);
        res.json(partidos);
    } catch (err) {
        console.error('Error /api/fixture:', err.message);
        res.status(500).json({ error: 'Error obteniendo fixture' });
    }
});

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
        if (Object.keys(dbMatch.estadisticas || {}).length === 0 && dbMatch.estado === 'finalizado') {
            console.log(`🔍 Buscando estadísticas en Sofascore para ${dbMatch.equipo_local} vs ${dbMatch.equipo_visitante}...`);

            try {
                // Usar la fecha del partido para buscar en Sofascore
                const fechaPartido = new Date(dbMatch.fecha_utc);
                const fechaStr = fechaPartido.toISOString().split('T')[0];

                const { data: ssData } = await axios.get(
                    `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${fechaStr}`,
                    { headers: SOFASCORE_HEADERS, timeout: 10000 }
                );
                const events = ssData.events || [];

                // Buscar el partido por nombres de equipos
                const ssMatch = events.find(e => {
                    const homeOk = sofascoreTeamMatch(e.homeTeam?.name || '', dbMatch.equipo_local);
                    const awayOk = sofascoreTeamMatch(e.awayTeam?.name || '', dbMatch.equipo_visitante);
                    const homeInv = sofascoreTeamMatch(e.homeTeam?.name || '', dbMatch.equipo_visitante);
                    const awayInv = sofascoreTeamMatch(e.awayTeam?.name || '', dbMatch.equipo_local);
                    return (homeOk && awayOk) || (homeInv && awayInv);
                });

                if (ssMatch) {
                    console.log(`   ✅ Encontrado: ${ssMatch.homeTeam?.name} vs ${ssMatch.awayTeam?.name} (ID: ${ssMatch.id})`);

                    // Obtener estadísticas
                    const { data: statsData } = await axios.get(
                        `https://api.sofascore.com/api/v1/event/${ssMatch.id}/statistics`,
                        { headers: SOFASCORE_HEADERS, timeout: 10000 }
                    );
                    let estadisticas = parseSofascoreStats(statsData) || {};
                    const goles = await fetchSofascoreGoals(ssMatch.id, dbMatch.equipo_local, dbMatch.equipo_visitante);
                    if (goles) estadisticas.goles_detalle = goles;
                    else if (estadisticas.goles_detalle === undefined) estadisticas.goles_detalle = [];

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
                        await supabase.from('partidos').update({
                            estadisticas: dbMatch.estadisticas
                        }).eq('id', dbMatch.id);
                        console.log('   💾 Estadísticas guardadas en BD.');
                    }
                } else {
                    console.warn(`   ⚠️ No se encontró en Sofascore: ${dbMatch.equipo_local} vs ${dbMatch.equipo_visitante} (fecha: ${fechaStr})`);
                }
            } catch (err) {
                console.warn('   ⚠️ Fallback a Sofascore falló:', err.message);
            }
        }

        res.json({
            id: dbMatch.id,
            grupo: dbMatch.fase,
            fase: dbMatch.fase,
            fecha_utc: dbMatch.fecha_utc,
            equipo_local: dbMatch.equipo_local,
            equipo_visitante: dbMatch.equipo_visitante,
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
            goles_detalle: (footballDataMatch?.goals?.length > 0) ? footballDataMatch.goals : (dbMatch.estadisticas?.goles_detalle || []),
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
        let cached = getCached('standings');
        if (cached) return res.json(cached);

        const { data } = await footballData.get(`/competitions/${COMPETITION_ID}/standings`);
        const standings = (data.standings || []).map(s => ({
            grupo: s.group || s.stage,
            tipo: s.type,
            tabla: (s.table || []).map(t => ({
                posicion: t.position,
                equipo: t.team?.name || '',
                equipo_short: t.team?.shortName || t.team?.tla || '',
                escudo: t.team?.crest || null,
                pj: t.playedGames,
                g: t.won,
                e: t.draw,
                p: t.lost,
                gf: t.goalsFor,
                gc: t.goalsAgainst,
                dg: t.goalDifference,
                pts: t.points,
            })),
        }));

        setCache('standings', standings);
        res.json(standings);
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
        let cached = getCached('scorers');
        if (cached) return res.json(cached);

        const { data } = await footballData.get(`/competitions/${COMPETITION_ID}/scorers?limit=20`);
        const scorers = (data.scorers || []).map(s => ({
            nombre: s.player?.name || '',
            equipo: s.team?.name || '',
            equipo_short: s.team?.shortName || s.team?.tla || '',
            escudo: s.team?.crest || null,
            goles: s.goals || 0,
            asistencias: s.assists || 0,
            penales: s.penalties || 0,
            partidos: s.playedMatches || 0,
        }));

        setCache('scorers', scorers);
        res.json(scorers);
    } catch (err) {
        console.error('Error /api/scorers:', err.message);
        res.json([]); // Devolver vacío si el torneo no empezó
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
        const sorted = data.sort((a,b) => (b.rojas || 0) - (a.rojas || 0) || (b.amarillas || 0) - (a.amarillas || 0));
        res.json(sorted);
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
        let cached = getCached('live');
        if (cached) return res.json(cached);

        const { data } = await apiFootball.get('/fixtures', {
            params: { league: LIVE_LEAGUE_ID, season: 2026, live: 'all' }
        });

        const partidos = (data.response || []).map(f => ({
            id: f.fixture.id,
            equipo_local: f.teams.home.name,
            equipo_visitante: f.teams.away.name,
            escudo_local: f.teams.home.logo,
            escudo_visitante: f.teams.away.logo,
            goles_local: f.goals.home,
            goles_visitante: f.goals.away,
            minuto: f.fixture.status.elapsed,
            estado_corto: f.fixture.status.short,
            estado_largo: f.fixture.status.long,
            estadio: f.fixture.venue?.name || '',
            ciudad: f.fixture.venue?.city || '',
            eventos: (f.events || []).map(e => ({
                minuto: e.time?.elapsed,
                extra: e.time?.extra,
                equipo: e.team?.name,
                jugador: e.player?.name,
                asistencia: e.assist?.name,
                tipo: e.type,
                detalle: e.detail,
            })),
        }));

        setCache('live', partidos);
        // Cache de live dura solo 30 segundos
        cache.live.ts = Date.now() - CACHE_TTL + 30000;
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
            titulo:  a.title,
            imagen:  a.image || null,
            link:    a.url || '#',
            fuente:  a.source?.name || '',
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
            titulo:  n.titulo,
            imagen:  n.imagen_url,
            link:    '#',
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
                    titulo:     n.titulo,
                    contenido:  n.titulo, // Usamos titulo como contenido mínimo
                    categoria:  categoria || 'General',
                    imagen_url: n.imagen,
                    publicado:  true,
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
    if (equipoCache[cacheKey] && (Date.now() - equipoCache[cacheKey].ts < EQUIPO_CACHE_TTL)) {
        console.log(`   📦 Sirviendo perfil de ${nombre} desde caché`);
        return res.json(equipoCache[cacheKey].data);
    }
    
    try {
        console.log(`\n🔍 [EQUIPO] Buscando información para: ${nombre}`);
        
        // 1. Mapeo a inglés si es necesario para api-football
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
        const searchName = mapNombresEn[nombre.toLowerCase()] || nombre;
        
        // 2. Buscar ID del equipo
        const { data: teamData } = await apiFootball.get('/teams', { params: { search: searchName } });
        
        if (!teamData.response || teamData.response.length === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado en API' });
        }
        
        // Tomamos el primer resultado que sea selección nacional (o el primero)
        const teamInfo = teamData.response.find(t => t.team.national === true) || teamData.response[0];
        const teamId = teamInfo.team.id;
        
        console.log(`   ✅ Equipo encontrado: ${teamInfo.team.name} (ID: ${teamId})`);
        
        // 3. Consultas en paralelo (Próximos, Últimos, Plantel)
        const [nextRes, lastRes, squadRes] = await Promise.all([
            apiFootball.get('/fixtures', { params: { team: teamId, next: 5 } }).catch(() => ({ data: { response: [] } })),
            apiFootball.get('/fixtures', { params: { team: teamId, last: 5 } }).catch(() => ({ data: { response: [] } })),
            apiFootball.get('/players/squads', { params: { team: teamId } }).catch(() => ({ data: { response: [] } }))
        ]);
        
        const responseData = {
            info: teamInfo.team,
            venue: teamInfo.venue,
            next_matches: nextRes.data.response || [],
            last_matches: lastRes.data.response || [],
            squad: squadRes.data.response[0]?.players || []
        };
        
        // Guardar en caché
        equipoCache[cacheKey] = { data: responseData, ts: Date.now() };
        
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
   Si el usuario pregunta por un partido, fecha, o quiere saber cuándo
   juega una selección, DESPUÉS de responder agregá este bloque
   EXACTAMENTE así (con el separador):
   
   ---CALENDARIO---
   {"equipo":"[nombre del equipo]","descripcion":"[descripción del evento]","fecha_aprox":"[fecha aproximada 2026]"}
   
   Ejemplo:
   ---CALENDARIO---
   {"equipo":"Argentina","descripcion":"Partido de Argentina en el Mundial 2026","fecha_aprox":"Junio 2026"}

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

  try {
    const calendario = JSON.parse(jsonParte);
    return { texto, calendario };
  } catch {
    // Si el JSON está malformado, ignoramos el bloque
    return { texto, calendario: null };
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
 
    // ── PASO 3: Llamar a Gemini con el contexto de productos ── 
    const mensajeConContexto = `${contextoProductos}\n\nPREGUNTA DEL USUARIO: 
${mensaje.trim()}`; 
    const respuestaCompleta  = await llamarGemini(historial, mensajeConContexto); 
 
    // ── PASO 4: Parsear calendario y devolver respuesta ── 
    const { texto, calendario } = parsearCalendario(respuestaCompleta); 
 
    res.json({ 
      respuesta:  texto, 
      productos:  productosParaGemini,  // productos reales de la BD 
      calendario, 
    }); 
 
  } catch (err) { 
    console.error('❌[/api/chat] Error:', err.message); 
    res.status(500).json({ 
      error:     'No pude procesar tu pregunta.', 
      respuesta: '¡Ups! Tuve un problema técnico. Intentá de nuevo. ⚽' 
    }); 
  } 
});

// ══════════════════════════════════════════════════════════════════
// ARRANQUE DEL SERVIDOR
// ══════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API de Mundialito escuchando peticiones en puerto ${PORT}`);
    console.log(`   📡 Probar: http://localhost:${PORT}/api/health`);
    console.log(`   📰 Noticias: http://localhost:${PORT}/api/noticias`);
    console.log(`   🛒 Productos: http://localhost:${PORT}/api/productos`);
});
