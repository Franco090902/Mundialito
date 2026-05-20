const axios = require('axios');

const HEADERS_1 = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Origin': 'https://www.sofascore.com',
  'Referer': 'https://www.sofascore.com/'
};

async function run() {
  try {
    console.log("Testing with es-AR / Origin / accept:*/* headers:");
    const { data: searchData } = await axios.get(
      'https://api.sofascore.com/api/v1/search/all?q=Flamengo',
      { headers: HEADERS_1 }
    );
    console.log("Search success! Found results:", searchData.results?.length);
    
    const teamId = 5981;
    const { data: squadData } = await axios.get(
      `https://api.sofascore.com/api/v1/team/${teamId}/players`,
      { headers: HEADERS_1 }
    );
    console.log("Squad success! Found players:", squadData.players?.length);
  } catch (err) {
    console.error("Failed with HEADERS_1:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
    }
  }
}

run();
