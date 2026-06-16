require('dotenv').config();
const axios = require('axios');

const key = process.env.ZAFRONIX_API_KEY;
const baseUrl = 'https://api.zafronix.com/fifa/worldcup/v1';

async function run() {
  try {
    console.log("Fetching 2026 matches to compile cards leaderboard...");
    const res = await axios.get(`${baseUrl}/matches?year=2026`, {
      headers: { 'X-API-Key': key }
    });
    
    const matches = res.data.data || [];
    console.log(`Retrieved ${matches.length} matches.`);
    
    // Maps to track cards per player: name -> { team, yellow, red }
    const leaders = {};
    
    matches.forEach(m => {
      const cards = m.cards || [];
      const homeTeam = m.homeTeam?.trim();
      const awayTeam = m.awayTeam?.trim();
      
      cards.forEach(c => {
        const playerName = c.player?.trim();
        const teamName = c.team === 'home' ? homeTeam : awayTeam;
        const color = c.color || 'yellow';
        
        if (!leaders[playerName]) {
          leaders[playerName] = {
            nombre: playerName,
            equipo: teamName,
            amarillas: 0,
            rojas: 0
          };
        }
        
        if (color === 'yellow') {
          leaders[playerName].amarillas += 1;
        } else if (color === 'red' || color === 'second_yellow' || color === 'indirect_red') {
          leaders[playerName].rojas += 1;
        }
      });
    });
    
    const leaderboard = Object.values(leaders);
    console.log(`Total players with cards: ${leaderboard.length}`);
    
    // Sort by cards: rojas desc, then amarillas desc
    leaderboard.sort((a, b) => {
      if (b.rojas !== a.rojas) return b.rojas - a.rojas;
      return b.amarillas - a.amarillas;
    });
    
    console.log("\nTop 15 players with cards:");
    leaderboard.slice(0, 15).forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.nombre} (${p.equipo}) - Yellow: ${p.amarillas}, Red: ${p.rojas}`);
    });
    
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
