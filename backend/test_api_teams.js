require('dotenv').config();
const axios = require('axios');

const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': process.env.API_FOOTBALL_KEY
  },
  timeout: 10000,
});

async function testTeam(name) {
  try {
    const { data } = await apiFootball.get('/teams', { params: { search: name } });
    console.log(`Search for "${name}":`, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed for ${name}:`, err.message);
  }
}

async function run() {
  await testTeam("Mexico");
}

run();
