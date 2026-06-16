// Test got-scraping to bypass Cloudflare TLS fingerprint detection
const { gotScraping } = require('got-scraping');

async function test() {
  try {
    const url = 'https://api.sofascore.com/api/v1/unique-tournament/16/seasons';
    console.log(`Testing got-scraping on: ${url}`);
    const response = await gotScraping({
      url,
      responseType: 'json',
      headerGeneratorOptions: {
        browsers: [{ name: 'chrome', minVersion: 120, maxVersion: 130 }],
        devices: ['desktop'],
        operatingSystems: ['windows'],
      },
    });
    console.log(`Status: ${response.statusCode}`);
    const data = response.body;
    console.log(`Seasons found: ${data.seasons?.length}`);
    if (data.seasons?.length > 0) {
      console.log(`First season: ${data.seasons[0].name} (ID: ${data.seasons[0].id})`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (err.response) {
      console.error(`Status: ${err.response.statusCode}`);
      console.error(`Body: ${JSON.stringify(err.response.body).substring(0, 300)}`);
    }
  }
}

test();
