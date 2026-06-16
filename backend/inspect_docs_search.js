const axios = require('axios');

async function run() {
  try {
    const url = 'https://api.zafronix.com/docs';
    const { data } = await axios.get(url);
    
    // Find all matches for cards/yellow/red/disciplinary
    const terms = ['card', 'yellow', 'red', 'disciplinary', 'stat', 'player'];
    console.log("Searching docs for terms...");
    
    // Let's strip HTML tags to make text matching cleaner
    const plainText = data.replace(/<[^>]*>/g, ' ');
    
    terms.forEach(term => {
      const regex = new RegExp(`([^\\n]{0,100}${term}[^\\n]{0,100})`, 'gi');
      const matches = [];
      let match;
      while ((match = regex.exec(plainText)) !== null && matches.length < 5) {
        matches.push(match[0].trim());
      }
      console.log(`\nMatches for "${term}":`);
      if (matches.length === 0) {
        console.log("  No matches found");
      } else {
        matches.forEach((m, idx) => console.log(`  ${idx + 1}. ... ${m} ...`));
      }
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
