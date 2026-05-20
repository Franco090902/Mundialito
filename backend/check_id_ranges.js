require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('partidos')
    .select('equipo_local, equipo_visitante, id_football_data');

  if (error) {
    console.error(error);
    return;
  }

  const nationalTeams = new Set(["Algeria", "Argentina", "Australia", "Austria", "Belgium", "Bosnia-H.", "Brazil", "Canada", "Cape Verde", "Colombia", "Congo DR", "Croatia", "Curaçao", "Czechia", "Ecuador", "Egypt", "England", "France", "Germany", "Ghana", "Haiti", "Iran", "Iraq", "Ivory Coast", "Japan", "Jordan", "Korea Republic", "Mexico", "Morocco", "Netherlands", "New Zealand", "Norway", "Panama", "Paraguay", "Portugal", "Qatar", "Saudi Arabia", "Scotland", "Senegal", "South Africa", "Spain", "Sweden", "Switzerland", "Tunisia", "Turkey", "USA", "Uruguay", "Uzbekistan"]);

  let minWc = Infinity, maxWc = -Infinity;
  let minLib = Infinity, maxLib = -Infinity;

  data.forEach(p => {
    const isWc = nationalTeams.has(p.equipo_local) || nationalTeams.has(p.equipo_visitante);
    const isLib = (p.equipo_local !== 'Por definirse' && !nationalTeams.has(p.equipo_local)) || (p.equipo_visitante !== 'Por definirse' && !nationalTeams.has(p.equipo_visitante));
    
    if (isWc) {
      if (p.id_football_data < minWc) minWc = p.id_football_data;
      if (p.id_football_data > maxWc) maxWc = p.id_football_data;
    }
    if (isLib) {
      if (p.id_football_data < minLib) minLib = p.id_football_data;
      if (p.id_football_data > maxLib) maxLib = p.id_football_data;
    }
  });

  console.log(`World Cup ranges: Min = ${minWc}, Max = ${maxWc}`);
  console.log(`Libertadores ranges: Min = ${minLib}, Max = ${maxLib}`);
}

run();
