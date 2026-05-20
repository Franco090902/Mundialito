require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('partidos')
    .select('id, equipo_local, equipo_visitante, estado, goles_local, goles_visitante, minuto, fecha_utc, edicion_mundial')
    .eq('estado', 'en_curso');

  if (error) {
    console.error(error);
  } else {
    console.log('--- EN CURSO ---');
    console.log(JSON.stringify(data, null, 2));
  }

  // Also query Rosario Central match today
  const { data: rosario, error: err2 } = await supabase
    .from('partidos')
    .select('id, equipo_local, equipo_visitante, estado, goles_local, goles_visitante, minuto, fecha_utc, edicion_mundial')
    .ilike('equipo_local', '%Rosario%');
  
  if (err2) {
    console.error(err2);
  } else {
    console.log('--- ROSARIO CENTRAL ---');
    console.log(JSON.stringify(rosario, null, 2));
  }
}

run();
