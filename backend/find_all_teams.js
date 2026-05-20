require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('partidos')
    .select('equipo_local, equipo_visitante');

  if (error) {
    console.error(error);
    return;
  }

  const teams = new Set();
  data.forEach(p => {
    if (p.equipo_local && p.equipo_local !== 'Por definirse') teams.add(p.equipo_local);
    if (p.equipo_visitante && p.equipo_visitante !== 'Por definirse') teams.add(p.equipo_visitante);
  });

  console.log('Total unique teams:', teams.size);
  console.log(JSON.stringify(Array.from(teams).sort(), null, 2));
}

run();
