require('dotenv').config();
const axios = require('axios');

const key = process.env.ZAFRONIX_API_KEY;
const baseUrl = 'https://api.zafronix.com/fifa/worldcup/v1';

async function fetchZafronix(path) {
  try {
    const res = await axios.get(`${baseUrl}${path}`, { headers: { 'X-API-Key': key } });
    return res.data;
  } catch (err) {
    console.error(`Error fetching ${path}:`, err.message);
    if (err.response) {
      console.error(`Status: ${err.response.status}, Data:`, err.response.data);
    }
    return null;
  }
}

async function run() {
  console.log("1. Fetching Tournament 2026 detail...");
  const t2026 = await fetchZafronix('/tournaments/2026');
  if (t2026) {
    console.log("Tournament 2026 keys:", Object.keys(t2026));
    console.log("Tournament 2026 details sample:", JSON.stringify(t2026, null, 2).substring(0, 1000));
  }

  console.log("\n2. Fetching Players...");
  const players = await fetchZafronix('/players?limit=3');
  if (players) {
    console.log("Players response sample:", JSON.stringify(players, null, 2).substring(0, 1000));
  }

  console.log("\n3. Fetching Matches...");
  const matches = await fetchZafronix('/matches?limit=3');
  if (matches) {
    console.log("Matches response sample:", JSON.stringify(matches, null, 2).substring(0, 1000));
  }
}

run();
