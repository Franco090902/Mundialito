require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const nationalTeams = new Set([
  "Algeria", "Argentina", "Australia", "Austria", "Belgium", "Bosnia-H.", "Brazil",
  "Canada", "Cape Verde", "Colombia", "Congo DR", "Croatia", "Curaçao", "Czechia",
  "Ecuador", "Egypt", "England", "France", "Germany", "Ghana", "Haiti", "Iran",
  "Iraq", "Ivory Coast", "Japan", "Jordan", "Korea Republic", "Mexico", "Morocco",
  "Netherlands", "New Zealand", "Norway", "Panama", "Paraguay", "Portugal", "Qatar",
  "Saudi Arabia", "Scotland", "Senegal", "South Africa", "Spain", "Sweden",
  "Switzerland", "Tunisia", "Turkey", "USA", "Uruguay", "Uzbekistan"
]);

async function run() {
  console.log('🔄 Fetching all matches from Supabase...');
  const { data: matches, error } = await supabase
    .from('partidos')
    .select('id, id_football_data, equipo_local, equipo_visitante, edicion_mundial');

  if (error) {
    console.error('❌ Error fetching matches:', error);
    return;
  }

  console.log(`📋 Found ${matches.length} matches in database.`);

  let wcCount = 0;
  let libCount = 0;
  const updates = [];

  for (const m of matches) {
    let edicion = null;
    
    if (m.id_football_data !== null && m.id_football_data !== undefined) {
      if (m.id_football_data < 550000) {
        edicion = 'mundial_2026';
      } else {
        edicion = 'libertadores_2026';
      }
    } else {
      const isWc = nationalTeams.has(m.equipo_local) || nationalTeams.has(m.equipo_visitante);
      edicion = isWc ? 'mundial_2026' : 'libertadores_2026';
    }

    if (edicion === 'mundial_2026') wcCount++;
    else libCount++;

    updates.push({
      id: m.id,
      edicion: edicion
    });
  }

  console.log(`📊 Classification Results:`);
  console.log(`   - World Cup 2026 matches: ${wcCount}`);
  console.log(`   - Copa Libertadores 2026 matches: ${libCount}`);
  console.log(`   - Total matches processed: ${updates.length}`);

  console.log('🚀 Updating matches in Supabase individually...');
  let successCount = 0;
  for (let i = 0; i < updates.length; i++) {
    const { id, edicion } = updates[i];
    const { error: updateError } = await supabase
      .from('partidos')
      .update({ edicion_mundial: edicion })
      .eq('id', id);

    if (updateError) {
      console.error(`❌ Error updating match ${id}:`, updateError.message);
    } else {
      successCount++;
    }

    if ((i + 1) % 25 === 0 || i === updates.length - 1) {
      console.log(`   ✅ Progress: ${i + 1}/${updates.length} matches processed.`);
    }
  }

  console.log(`🎉 Migration completed successfully! Updated ${successCount}/${updates.length} matches.`);
}

run();
