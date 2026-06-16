require('dotenv').config();
const axios = require('axios');

const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': process.env.API_FOOTBALL_KEY
  },
  timeout: 10000,
});

async function run() {
  try {
    // Test for World Cup 2026 (league 1, season 2026)
    console.log("Checking API-Football top yellow cards for World Cup 2026...");
    const resYellow = await apiFootball.get('/players/topyellowcards', { params: { league: 1, season: 2026 } });
    console.log("Yellow cards response status:", resYellow.status);
    console.log("Yellow cards players count:", resYellow.data?.response?.length || 0);
    if (resYellow.data?.errors && Object.keys(resYellow.data.errors).length > 0) {
      console.log("Errors:", resYellow.data.errors);
    } else if (resYellow.data?.response?.length > 0) {
      console.log("First player:", JSON.stringify(resYellow.data.response[0].player));
      console.log("First player card stats:", JSON.stringify(resYellow.data.response[0].statistics[0].cards));
    }

    console.log("\nChecking API-Football top red cards for World Cup 2026...");
    const resRed = await apiFootball.get('/players/topredcards', { params: { league: 1, season: 2026 } });
    console.log("Red cards response status:", resRed.status);
    console.log("Red cards players count:", resRed.data?.response?.length || 0);
  } catch (err) {
    console.error("API-Football request failed:", err.message);
  }
}

run();
