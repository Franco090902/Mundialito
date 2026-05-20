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
    .order('fase');

  if (error) {
    console.error(error);
  } else {
    // Print unique teams for Grupo A
    const grupoATeams = new Set();
    data.forEach(p => {
      if (p.fase === 'Grupo A') {
        grupoATeams.add(p.equipo_local);
        grupoATeams.add(p.equipo_visitante);
      }
    });
    console.log('Teams in Grupo A in DB:', Array.from(grupoATeams));
    
    // Print unique fases
    const fases = [...new Set(data.map(p => p.fase))];
    console.log('All Fases in DB:', fases);
    
    // Print a few sample matches
    console.log('Sample matches:', data.slice(0, 10));
  }
}

run();
