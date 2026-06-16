const http2 = require('http2');

async function testHttp2() {
  return new Promise((resolve, reject) => {
    const client = http2.connect('https://api.sofascore.com');

    client.on('error', (err) => {
      console.error('HTTP2 Connect Error:', err);
      reject(err);
    });

    const req = client.request({
      ':path': '/api/v1/unique-tournament/16/seasons',
      ':method': 'GET',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'referer': 'https://www.sofascore.com/',
      'origin': 'https://www.sofascore.com',
      'cache-control': 'no-cache'
    });

    let data = '';

    req.on('response', (headers, flags) => {
      console.log('Status:', headers[':status']);
    });

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      client.close();
      resolve(data);
    });

    req.on('error', (err) => {
      console.error('HTTP2 Request Error:', err);
      client.close();
      reject(err);
    });

    req.end();
  });
}

async function run() {
  try {
    console.log("Sending HTTP/2 request to Sofascore...");
    const response = await testHttp2();
    console.log("Response length:", response.length);
    console.log("Response body:", response.substring(0, 500));
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

run();
