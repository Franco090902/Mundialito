require('dotenv').config();
const axios = require('axios');

const footballData = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 
    'X-Auth-Token': process.env.FOOTBALL_DATA_KEY,
    'X-Unfold-Bookings': 'true'
  },
  timeout: 10000,
});

async function run() {
  try {
    console.log('Fetching match 537363 details...');
    const { data } = await footballData.get('/matches/537363');
    console.log('Keys in match data:', Object.keys(data));
    console.log('Bookings:', data.bookings);
    console.log('Goals:', data.goals);
    console.log('Referees:', data.referees);
  } catch (err) {
    console.error('Error fetching match from football-data:', err.message);
    if (err.response) {
      console.log('Status:', err.response.status);
      console.log('Body:', err.response.data);
    }
  }
}

run();
