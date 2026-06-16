const WebSocket = require('ws');

const wsUrl = 'ws://localhost:9222/devtools/page/C0579F053406CE5C86EFA5FDA179B374';
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('Connected to Chrome Debugger WebSocket');
  
  // Send CDP command to evaluate document.body.innerText
  const msg = {
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: 'document.body.innerText',
      returnByValue: true
    }
  };
  ws.send(JSON.stringify(msg));
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString('utf8'));
  console.log('Received response from Chrome:');
  if (response.id === 1) {
    const result = response.result?.result?.value;
    console.log(result ? result.substring(0, 500) : 'No value returned');
  }
  ws.close();
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err.message);
});
