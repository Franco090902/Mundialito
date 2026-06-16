const axios = require('axios');
const https = require('https');

async function test() {
  const url = 'https://api.sofascore.com/api/v1/unique-tournament/16/seasons';
  const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: false });
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'Referer': 'https://www.sofascore.com/',
    'Origin': 'https://www.sofascore.com'
  };

  try {
    const res = await axios.get(url, { headers, httpsAgent: agent, timeout: 5000 });
    console.log('Success!', res.status);
    console.log(JSON.stringify(res.data).substring(0, 200));
  } catch (err) {
    console.log('Axios failed:', err.message);
    if (err.response) {
      console.log('Status:', err.response.status);
      console.log('Data:', JSON.stringify(err.response.data));
    }
  }
}

test();
