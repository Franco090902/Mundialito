require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('partidos')
    .select('edicion_mundial, id_football_data')
    .limit(20);

  if (error) {
    console.error(error);
  } else {
    const counts = {};
    const sample = [];
    
    // Get all distinct values
    const { data: allVals, error: err2 } = await supabase
      .from('partidos')
      .select('edicion_mundial');
      
    if (err2) {
      console.error(err2);
    } else {
      allVals.forEach(r => {
        const val = r.edicion_mundial;
        counts[val] = (counts[val] || 0) + 1;
      });
      console.log('Distinct edicion_mundial values and counts:', counts);
    }
  }
}

run();
