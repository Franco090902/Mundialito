const axios = require('axios');

async function run() {
  try {
    const url = 'https://api.zafronix.com/openapi.json';
    const { data } = await axios.get(url);
    
    console.log("Schema Keys:", Object.keys(data.components?.schemas || {}));
    
    // Dump schemas
    const schemas = data.components?.schemas || {};
    for (const [name, schema] of Object.entries(schemas)) {
      console.log(`\n=================== Schema: ${name} ===================`);
      console.log(JSON.stringify(schema, null, 2).substring(0, 2000));
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
