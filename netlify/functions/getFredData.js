const fetch = require('node-fetch');  // Use require for node-fetch@2

export async function handler(event, context) {
  // Hardcoded API key
  const FRED_API_KEY = 'b12c1cced5c15f90f28f8f6aaeb331cd';  

  try {
    // Making the API request to FRED
    const fedResponse = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json`
    );

    // Check if the response is not OK (i.e., not 2xx status)
    if (!fedResponse.ok) {
      throw new Error(`FRED API responded with status: ${fedResponse.status}`);
    }

    // Parse the JSON response
    const fedData = await fedResponse.json();

    // Return the data to the frontend
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ fedData })
    };

  } catch (error) {
    // Log the error and return an error response
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: `FRED API Error: ${error.message}` })
    };
  }
}
