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
const TEST_MODE = process.env.TEST_MODE === 'true';

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
        const { data } = await footballData.get(`/matches/${req.params.id}`);
        const p = data;
        res.json({
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
            arbitro: p.referees?.map(r => r.name).join(', ') || null,
            competicion: p.competition?.name || '',
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

        // Filtrar por país/selección si se especifica
        if (pais && pais !== '' && pais !== 'Todos') {
            query = query.eq('categoria_relacionada', pais);
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
// MIDDLEWARE DE ERRORES (Express 5 — atrapa errores de rutas async)
// ══════════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
    console.error('💥 Error en ruta:', err.message);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Error interno del servidor' });
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
