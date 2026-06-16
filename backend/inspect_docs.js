const axios = require('axios');

async function run() {
  try {
    const url = 'https://api.zafronix.com/docs';
    const { data } = await axios.get(url);
    console.log("Data type:", typeof data);
    if (typeof data === 'string') {
      console.log("Data length:", data.length);
      console.log("First 1000 chars:", data.substring(0, 1000));
    } else {
      console.log("Data keys:", Object.keys(data));
      console.log("Data sample:", JSON.stringify(data, null, 2).substring(0, 1000));
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
