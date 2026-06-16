const FotmobLib = require('@max-xoo/fotmob');
const Fotmob = FotmobLib.default || FotmobLib;
const fotmob = new Fotmob();

async function run() {
  try {
    console.log("Calling getLeague for World Cup (77)...");
    const data = await fotmob.getLeague("77", "overview", "league");
    console.log("Success! Keys in response:", Object.keys(data));
    
    // Check if player stats or leaderboards are present
    console.log("Full data keys:", Object.keys(data));
    
    // Look at some keys like 'stats', 'playerStats', 'overview', etc.
    if (data.overview) {
      console.log("overview keys:", Object.keys(data.overview));
      if (data.overview.leagueOverviewPlayerStats) {
        console.log("Found leagueOverviewPlayerStats!");
        console.log("Player stats keys:", Object.keys(data.overview.leagueOverviewPlayerStats));
      }
    }
    
    // Let's print the entire data object keys and structure
    console.log(JSON.stringify(data, null, 2).substring(0, 1000));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
