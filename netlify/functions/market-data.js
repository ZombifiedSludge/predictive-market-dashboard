const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Your API key from Finnhub
  const API_KEY = 'cv3a3b1r01qk43u1g0r0cv3a3b1r01qk43u1g0rg';
  
  try {
    // Get symbol from the query string
    const { symbol } = event.queryStringParameters || {};
    
    if (!symbol) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Symbol parameter is required' })
      };
    }
    
    // Make the actual API call to Finnhub
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    const data = await response.json();
    
    // Return the data to the client
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
