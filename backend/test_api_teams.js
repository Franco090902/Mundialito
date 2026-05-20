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
    const { data } = await apiFootball.get('/teams', { params: { league: 13, season: 2024 } });
    console.log(`Entire response:`, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed:`, err.message);
  }
}

run();
