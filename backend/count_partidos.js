require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: countData, error: err1 } = await supabase
    .from('partidos')
    .select('fase, equipo_local, equipo_visitante');

  if (err1) {
    console.error(err1);
    return;
  }

  const groups = {};
  countData.forEach(p => {
    groups[p.fase] = (groups[p.fase] || 0) + 1;
  });

  console.log('Total matches in DB:', countData.length);
  console.log('Fases in DB:', JSON.stringify(groups, null, 2));
}

run();
