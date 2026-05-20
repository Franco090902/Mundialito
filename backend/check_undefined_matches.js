require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('partidos')
    .select('id, fase, equipo_local, equipo_visitante, id_football_data, id_api_football, edicion_mundial');

  if (error) {
    console.error(error);
    return;
  }

  const undefinedMatches = data.filter(p => p.equipo_local === 'Por definirse' && p.equipo_visitante === 'Por definirse');
  console.log('Matches with both teams undefined:', undefinedMatches.length);
  console.log(undefinedMatches.slice(0, 10));
}

run();
