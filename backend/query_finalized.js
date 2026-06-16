require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await s
    .from('partidos')
    .select('equipo_local, equipo_visitante, goles_local, goles_visitante, estado, estadisticas')
    .eq('estado', 'finalizado')
    .limit(10);
    
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
