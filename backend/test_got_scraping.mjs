import { gotScraping } from 'got-scraping';

async function test() {
  try {
    const url = 'https://api.sofascore.com/api/v1/unique-tournament/16/seasons';
    console.log(`Testing got-scraping on: ${url}`);
    const response = await gotScraping({
      url,
      headerGeneratorOptions: {
        browsers: [{ name: 'chrome', minVersion: 120, maxVersion: 130 }],
        devices: ['desktop'],
        operatingSystems: ['windows'],
      },
    });
    console.log(`Status: ${response.statusCode}`);
    console.log(`Body: ${response.body.substring(0, 500)}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (err.response) {
      console.error(`Status: ${err.response.statusCode}`);
      console.error(`Body: ${err.response.body?.substring(0, 500)}`);
    }
  }

  // Test 2: Try with impersonation using Firefox instead
  try {
    const url2 = 'https://api.sofascore.com/api/v1/unique-tournament/16/seasons';
    console.log(`\nTesting with Firefox impersonation...`);
    const response2 = await gotScraping({
      url: url2,
      useHeaderGenerator: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
        'Accept': 'application/json',
      },
    });
    console.log(`Status: ${response2.statusCode}`);
    console.log(`Body: ${response2.body.substring(0, 500)}`);
  } catch (err) {
    console.error(`Firefox test error: ${err.message}`);
    if (err.response) {
      console.error(`Status: ${err.response.statusCode}`);
      console.error(`Body: ${err.response.body?.substring(0, 500)}`);
    }
  }
}

test();
