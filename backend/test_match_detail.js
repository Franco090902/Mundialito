require('dotenv').config();
const axios = require('axios');

// Test: search for match on Sofascore by team names and date
async function test() {
  const fecha = '2026-04-17'; // Flamengo vs Independiente
  const equipoLocal = 'Flamengo';
  const equipoVis = 'Independiente';
  
  const normalize = s => s ? s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '') : '';
  
  console.log('=== Buscar partido en Sofascore por fecha ===');
  const { data } = await axios.get(`https://api.sofascore.com/api/v1/sport/football/scheduled-events/${fecha}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 10000
  });
  
  const events = data.events || [];
  console.log('Total events on', fecha, ':', events.length);
  
  // Find by team names
  const match = events.find(e => {
    const home = normalize(e.homeTeam?.name || '');
    const away = normalize(e.awayTeam?.name || '');
    return (home.includes(normalize(equipoLocal)) || normalize(equipoLocal).includes(home)) &&
           (away.includes(normalize(equipoVis)) || normalize(equipoVis).includes(away));
  });
  
  if (match) {
    console.log('FOUND:', match.homeTeam?.name, 'vs', match.awayTeam?.name, '| ID:', match.id);
    console.log('Score:', match.homeScore?.current, '-', match.awayScore?.current);
    console.log('Status:', match.status?.type);
    
    // Now get stats
    const { data: statsData } = await axios.get(`https://api.sofascore.com/api/v1/event/${match.id}/statistics`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    
    const allStats = statsData.statistics?.find(s => s.period === 'ALL');
    if (allStats) {
      const overview = allStats.groups?.find(g => g.groupName === 'Match overview');
      const shots = allStats.groups?.find(g => g.groupName === 'Shots');
      console.log('\nEstadísticas extraídas:');
      overview?.statisticsItems?.forEach(s => {
        console.log(' ', s.name, ':', s.home, '-', s.away);
      });
    }
    
    // Get incidents
    const { data: incData } = await axios.get(`https://api.sofascore.com/api/v1/event/${match.id}/incidents`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    const goals = (incData.incidents || []).filter(i => i.incidentType === 'goal');
    console.log('\nGoles:');
    goals.forEach(g => console.log('  Min', g.time, '-', g.player?.name, g.isHome ? '(Local)' : '(Visitante)'));
  } else {
    console.log('NOT FOUND');
    // Show what Libertadores matches exist on that date
    const libertadores = events.filter(e => e.tournament?.name?.includes('Libertadores'));
    console.log('Libertadores matches on', fecha, ':');
    libertadores.forEach(e => console.log(' ', e.homeTeam?.name, 'vs', e.awayTeam?.name, '| ID:', e.id));
  }
  
  // Test: Also try Universitario vs Coquimbo Unido
  console.log('\n=== Buscar Universitario vs Coquimbo Unido ===');
  const fecha2 = '2026-04-16'; // fecha de ese partido en BD
  const { data: data2 } = await axios.get(`https://api.sofascore.com/api/v1/sport/football/scheduled-events/${fecha2}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 10000
  });
  const events2 = data2.events || [];
  const match2 = events2.find(e => {
    const home = normalize(e.homeTeam?.name || '');
    const away = normalize(e.awayTeam?.name || '');
    return home.includes('universitario') || away.includes('universitario');
  });
  if (match2) {
    console.log('FOUND:', match2.homeTeam?.name, 'vs', match2.awayTeam?.name, '| ID:', match2.id);
    console.log('Score:', match2.homeScore?.current, '-', match2.awayScore?.current);
  } else {
    console.log('NOT FOUND on', fecha2);
    // Show what matches exist
    const libertadores2 = events2.filter(e => e.tournament?.name?.includes('Libertadores'));
    console.log('Libertadores matches on', fecha2, ':', libertadores2.length);
    libertadores2.forEach(e => console.log(' ', e.homeTeam?.name, 'vs', e.awayTeam?.name));
  }
}

test().catch(e => console.error(e.message));
