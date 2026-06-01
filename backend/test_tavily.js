require('dotenv').config();

async function testTavily() {
  const query = "cuando juega argentina con austria?";
  console.log("Key:", process.env.TAVILY_API_KEY);
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: "basic",
        max_results: 3
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.error("Error:", e);
  }
}

testTavily();
