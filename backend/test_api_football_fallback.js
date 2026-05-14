require('dotenv').config();
const axios = require('axios');

const TEST_MODE = process.env.TEST_MODE === 'true';
const LIVE_LEAGUE_ID = TEST_MODE ? 13 : 1;
const currentSeason = TEST_MODE ? 2024 : 2026;

const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': process.env.API_FOOTBALL_KEY
  },
  timeout: 10000,
});

async function run() {
    console.log(`Buscando con league: ${LIVE_LEAGUE_ID}, season: ${currentSeason}`);
    const { data } = await apiFootball.get('/fixtures', { params: { league: LIVE_LEAGUE_ID, season: currentSeason } });
    const fixtures = data.response || [];
    console.log(`Encontrados ${fixtures.length} partidos.`);
    
    const normalize = s => s ? s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '') : '';
    
    const equipoLocal = "Flamengo";
    const equipoVisitante = "Independiente"; // Independiente del Valle?

    const fixture = fixtures.find(f => 
        (normalize(f.teams.home.name).includes(normalize(equipoLocal)) ||
         normalize(f.teams.away.name).includes(normalize(equipoVisitante)))
    );
    
    if (fixture) {
        console.log("Encontrado:", fixture.fixture.id, fixture.teams.home.name, "vs", fixture.teams.away.name);
        console.log("Estadísticas Home:", fixture.statistics?.[0]?.statistics?.length);
        console.log("Estadísticas Away:", fixture.statistics?.[1]?.statistics?.length);
    } else {
        console.log("No encontrado");
    }
}

run();
