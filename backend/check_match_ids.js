require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('partidos')
    .select('fase, equipo_local, equipo_visitante, id_football_data')
    .neq('equipo_local', 'Por definirse');

  if (error) {
    console.error(error);
    return;
  }

  const libSample = data.filter(p => !["Algeria", "Argentina", "Australia", "Austria", "Belgium", "Bosnia-H.", "Brazil", "Canada", "Cape Verde", "Colombia", "Congo DR", "Croatia", "Curaçao", "Czechia", "Ecuador", "Egypt", "England", "France", "Germany", "Ghana", "Haiti", "Iran", "Iraq", "Ivory Coast", "Japan", "Jordan", "Korea Republic", "Mexico", "Morocco", "Netherlands", "New Zealand", "Norway", "Panama", "Paraguay", "Portugal", "Qatar", "Saudi Arabia", "Scotland", "Senegal", "South Africa", "Spain", "Sweden", "Switzerland", "Tunisia", "Turkey", "USA", "Uruguay", "Uzbekistan"].includes(p.equipo_local));
  
  const wcSample = data.filter(p => ["Algeria", "Argentina", "Australia", "Austria", "Belgium", "Bosnia-H.", "Brazil", "Canada", "Cape Verde", "Colombia", "Congo DR", "Croatia", "Curaçao", "Czechia", "Ecuador", "Egypt", "England", "France", "Germany", "Ghana", "Haiti", "Iran", "Iraq", "Ivory Coast", "Japan", "Jordan", "Korea Republic", "Mexico", "Morocco", "Netherlands", "New Zealand", "Norway", "Panama", "Paraguay", "Portugal", "Qatar", "Saudi Arabia", "Scotland", "Senegal", "South Africa", "Spain", "Sweden", "Switzerland", "Tunisia", "Turkey", "USA", "Uruguay", "Uzbekistan"].includes(p.equipo_local));

  console.log('Libertadores sample matches IDs:');
  console.log(libSample.slice(0, 5));

  console.log('World Cup sample matches IDs:');
  console.log(wcSample.slice(0, 5));
}

run();
