require('dotenv').config();
const axios = require('axios');

const key = process.env.ZAFRONIX_API_KEY;

async function checkUrl(url) {
  try {
    const res = await axios.get(url, { headers: { 'X-API-Key': key } });
    console.log(`URL ${url} succeeded! keys:`, Object.keys(res.data));
    return res.data;
  } catch (e) {
    console.log(`URL ${url} failed:`, e.message);
    return null;
  }
}

async function run() {
  const baseUrl = 'https://api.zafronix.com/fifa/worldcup/v1';
  
  await checkUrl(`${baseUrl}/openapi.json`);
  await checkUrl(`${baseUrl}/swagger.json`);
  await checkUrl(`https://api.zafronix.com/openapi.json`);
  await checkUrl(`https://api.zafronix.com/docs/openapi.json`);
  await checkUrl(`https://api.zafronix.com/docs`);
  
  // Let's also check if standard endpoints like '/tournaments', '/teams', '/matches', '/stats' exist
  console.log("\nTesting common resource endpoints...");
  await checkUrl(`${baseUrl}/tournaments`);
  await checkUrl(`${baseUrl}/teams`);
  await checkUrl(`${baseUrl}/matches`);
  await checkUrl(`${baseUrl}/statistics`);
  await checkUrl(`${baseUrl}/stats`);
  await checkUrl(`${baseUrl}/cards`);
}

run();
