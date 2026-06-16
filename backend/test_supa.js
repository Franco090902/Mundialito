require('dotenv').config();
const axios = require('axios');

const footballData = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_KEY },
  timeout: 10000,
});

async function run() {
  try {
    const { data } = await footballData.get('/teams/774');
    console.log("Player properties:", Object.keys(data.squad[0]));
    console.log("Full player JSON:", JSON.stringify(data.squad[0], null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
