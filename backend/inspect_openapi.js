const axios = require('axios');

async function run() {
  try {
    const url = 'https://api.zafronix.com/openapi.json';
    const { data } = await axios.get(url);
    
    console.log("OpenAPI Paths:");
    const paths = Object.keys(data.paths || {});
    paths.forEach(p => {
      const methods = Object.keys(data.paths[p]);
      console.log(`  ${methods.join(', ').toUpperCase()} ${p}`);
      methods.forEach(m => {
        const desc = data.paths[p][m].summary || data.paths[p][m].description || 'No summary';
        console.log(`    -> ${desc}`);
      });
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
