const WebSocket = require('ws');

const wsUrl = 'ws://localhost:9222/devtools/page/C0579F053406CE5C86EFA5FDA179B374';
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('Connected to Chrome Debugger WebSocket');
  
  // Enable Network domain
  ws.send(JSON.stringify({ id: 1, method: 'Network.enable' }));
  
  // Request cookies
  setTimeout(() => {
    ws.send(JSON.stringify({
      id: 2,
      method: 'Network.getCookies',
      params: { urls: ['https://api.sofascore.com', 'https://www.sofascore.com'] }
    }));
  }, 500);
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString('utf8'));
  if (response.id === 2) {
    console.log('Received cookies:');
    const cookies = response.result?.cookies || [];
    cookies.forEach(c => {
      console.log(`${c.name}=${c.value.substring(0, 15)}... (Domain: ${c.domain})`);
    });
    ws.close();
  }
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err.message);
});
