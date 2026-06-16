require('dotenv').config();
const axios = require('axios');

const footballData = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_KEY },
  timeout: 10000,
});

async function run() {
  try {
    const competitionId = 2000; // World Cup
    console.log(`Querying football-data.org for competition ${competitionId} matches...`);
    const { data } = await footballData.get(`/competitions/${competitionId}/matches`);
    console.log("Status:", data ? "Success" : "Failed");
    console.log("Total matches:", data.matches?.length || 0);
    
    if (data.matches?.length > 0) {
      // Find a match that is finished or has details
      const sampleMatch = data.matches.find(m => m.status === 'FINISHED') || data.matches[0];
      console.log("Sample match keys:", Object.keys(sampleMatch));
      console.log("Sample match details:", JSON.stringify(sampleMatch, null, 2));
    }
  } catch (err) {
    printError(err);
  }
}

function printError(err) {
  console.error("Error:", err.message);
  if (err.response) {
    console.error("Status:", err.response.status);
    console.error("Data:", err.response.data);
  }
}

run();
