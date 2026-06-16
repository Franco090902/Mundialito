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
    console.log('Querying top yellow cards for World Cup 2022 (league 1)...');
    const { data: yellow } = await apiFootball.get('/players/topyellowcards', { params: { league: 1, season: 2022 } });
    console.log('Yellow response errors:', yellow.errors);
    console.log('Yellow response count:', yellow.response?.length);
    if (yellow.response && yellow.response.length > 0) {
      console.log('Sample yellow card entry:', JSON.stringify(yellow.response[0], null, 2));
    }
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

run();
