require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const { data, error } = await supabase.from('tarjetas').select('*').order('amarillas', { ascending: false }).limit(30);
    if (error) throw error;
    console.log(`Total tarjetas en BD: ${data.length}`);
    data.forEach(t => {
      console.log(`  ${t.nombre} (${t.equipo}) - Amarillas: ${t.amarillas}, Rojas: ${t.rojas} - Updated: ${t.updated_at}`);
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
