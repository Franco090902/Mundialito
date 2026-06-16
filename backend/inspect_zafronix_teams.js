require('dotenv').config();
const axios = require('axios');

const key = process.env.ZAFRONIX_API_KEY;
const baseUrl = 'https://api.zafronix.com/fifa/worldcup/v1';

async function run() {
  try {
    console.log("Fetching tournament 2026 info from Zafronix...");
    const res = await axios.get(`${baseUrl}/tournaments/2026`, {
      headers: { 'X-API-Key': key }
    });
    
    const teams = res.data.teams || [];
    console.log(`Tournament has ${teams.length} teams.`);
    if (teams.length > 0) {
      console.log("Sample team object:", JSON.stringify(teams[0], null, 2));
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
