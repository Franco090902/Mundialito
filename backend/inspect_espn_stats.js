const axios = require('axios');

async function run() {
  try {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/statistics';
    console.log("Fetching ESPN stats from:", url);
    const { data } = await axios.get(url);
    
    if (data.stats && Array.isArray(data.stats)) {
      data.stats.forEach((stat, idx) => {
        console.log(`Stat index ${idx}: name="${stat.name}", displayName="${stat.displayName}"`);
        const leaders = stat.leaders || [];
        console.log(`  Leaders count: ${leaders.length}`);
        if (leaders.length > 0) {
          console.log(`  Top leader: ${leaders[0].athlete?.displayName} (${leaders[0].athlete?.id}) - displayValue: ${leaders[0].displayValue}`);
        }
      });
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
