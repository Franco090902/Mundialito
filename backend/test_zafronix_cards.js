require('dotenv').config();
const axios = require('axios');

const key = process.env.ZAFRONIX_API_KEY;
const baseUrl = 'https://api.zafronix.com/fifa/worldcup/v1';

async function run() {
  try {
    console.log("Fetching matches for 2022 tournament from Zafronix...");
    // Let's get matches for year 2022, which is fully completed and has data
    const res = await axios.get(`${baseUrl}/matches?year=2022&limit=5`, {
      headers: { 'X-API-Key': key }
    });
    
    const matches = res.data.data || [];
    console.log(`Found ${matches.length} matches in response.`);
    
    if (matches.length > 0) {
      // Find a match with cards
      const sampleMatch = matches[0];
      console.log("\nSample Match keys:", Object.keys(sampleMatch));
      console.log("Sample Match basic details:", {
        id: sampleMatch.id,
        homeTeam: sampleMatch.homeTeam,
        awayTeam: sampleMatch.awayTeam,
        result: sampleMatch.result
      });
      
      // Print cards and substitutions if present
      console.log("Cards property:", sampleMatch.cards);
      console.log("Substitutions property:", sampleMatch.substitutions);
      
      // Let's check if there are matches where cards are populated
      const matchWithCards = matches.find(m => m.cards && m.cards.length > 0);
      if (matchWithCards) {
        console.log(`\nFound match with cards! ID: ${matchWithCards.id}`);
        console.log("Cards:", JSON.stringify(matchWithCards.cards, null, 2));
      } else {
        console.log("\nNo match in these 5 had cards. Let's dump the entire first match object to see what fields exist.");
        console.log(JSON.stringify(sampleMatch, null, 2));
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
    if (err.response) {
      console.error("Response:", err.response.data);
    }
  }
}

run();
