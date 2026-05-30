const axios = require('axios');
const { exec } = require('child_process');

function safeSofascoreGet(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Origin': 'https://www.sofascore.com',
      'Referer': 'https://www.sofascore.com/'
    };
    
    let headerArgs = '';
    Object.entries(headers).forEach(([k, v]) => {
      headerArgs += ` -H "${k}: ${v}"`;
    });
    
    const curlBin = process.platform === 'win32' ? 'curl.exe --ssl-no-revoke' : 'curl';
    const cmd = `${curlBin} -s ${headerArgs} "${url}"`;
    
    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) return reject(error);
      try {
        const json = JSON.parse(stdout);
        resolve(json);
      } catch (e) {
        reject(new Error(`Failed to parse response: ${stdout.substring(0, 100)}`));
      }
    });
  });
}

async function run() {
  try {
    console.log('Searching for Argentina on Sofascore...');
    const searchRes = await safeSofascoreGet('https://api.sofascore.com/api/v1/search/all?q=Argentina');
    const teams = searchRes.results?.filter(r => r.type === 'team') || [];
    console.log(`Found ${teams.length} teams.`);
    const argTeam = teams.find(t => t.entity?.national) || teams[0];
    if (!argTeam) {
      console.log('Argentina team not found.');
      return;
    }
    
    const teamId = argTeam.entity.id;
    console.log(`Argentina Sofascore Team ID: ${teamId} (${argTeam.entity.name})`);
    
    console.log(`Fetching squad for team ${teamId} from Sofascore...`);
    const squadRes = await safeSofascoreGet(`https://api.sofascore.com/api/v1/team/${teamId}/players`);
    const players = squadRes.players || [];
    console.log(`Total players in Sofascore squad: ${players.length}`);
    
    // Check first few players
    players.slice(0, 10).forEach(p => {
      console.log(`- ${p.player.name} (${p.player.position})`);
    });
    
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

run();
