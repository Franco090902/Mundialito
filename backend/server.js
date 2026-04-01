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
  baseURL: 'https://api-football-v1.p.rapidapi.com/v3',
  headers: {
    'X-RapidAPI-Key':  process.env.API_FOOTBALL_KEY,
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
  },
  timeout: 10000,
});

// ID del Mundial 2026 en football-data.org
// ⚠️  Confirmar este ID cuando la competición esté disponible en la API
const WC_2026_ID = 2000;

console.log('⚽ Worker Mundialito iniciado —', new Date().toLocaleString('es-AR'));
console.log('📡 Supabase URL:', process.env.SUPABASE_URL);


// ══════════════════════════════════════════════════════════════════
// ESTRATEGIA 1: FIXTURE (Football-Data.org)
// Límite: 10 req/min. Corre cada hora para no gastar cuota.
// Actualiza: todos los partidos (programados, en curso y finalizados).
// ══════════════════════════════════════════════════════════════════
async function actualizarFixture() {
  console.log('\n🗓️  [FIXTURE] Actualizando desde Football-Data...');
  try {
    const { data } = await footballData.get(`/competitions/${WC_2026_ID}/matches`);
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
      equipo_local:      p.homeTeam.shortName || p.homeTeam.name,
      equipo_visitante:  p.awayTeam.shortName || p.awayTeam.name,
      escudo_local:      p.homeTeam.crest,
      escudo_visitante:  p.awayTeam.crest,
      estado:            mapearEstado(p.status),
      goles_local:       p.score.fullTime.home,
      goles_visitante:   p.score.fullTime.away,
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
      const fixture = fixtures.find(f =>
        (partido.id_api_football && f.fixture.id === partido.id_api_football) ||
        f.teams.home.name.toLowerCase().includes(partido.equipo_local.toLowerCase()) ||
        f.teams.away.name.toLowerCase().includes(partido.equipo_visitante.toLowerCase())
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
cron.schedule('*/3 * * * *', actualizarEnVivo);


// ══════════════════════════════════════════════════════════════════
// ESTRATEGIA 3: HISTORIA (TheSportsDB)
// Gratis, sin límite estricto. Solo corre a las 3 AM.
// Pobla data histórica (mundiales pasados, estadios, equipos).
// ══════════════════════════════════════════════════════════════════
async function actualizarHistoria() {
  console.log('\n📚 [HISTORIA] Consultando TheSportsDB...');
  // TheSportsDB no requiere auth. La data casi nunca cambia.
  // Descomenta cuando tengas la tabla de historia:
  //
  // const { data } = await axios.get(
  //   'https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4487&s=2022-2023'
  // );
  // await supabase.from('historia_ediciones').upsert(
  //   data.events.map(e => ({ ... }))
  // );
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
  process.exit(1); // PM2 / Render lo reinicia automáticamente
});
