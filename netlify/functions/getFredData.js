const fetch = require('node-fetch');

export async function handler(event, context) {
  const FRED_API_KEY = 'b12c1cced5c15f90f28f8f6aaeb331cd';  
  try {
    const fedResponse = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json`
    );
    
    if (!fedResponse.ok) {
      throw new Error(`FRED API responded with status: ${fedResponse.status}`);
    }
    
    const responseData = await fedResponse.json();
    console.log('FRED Direct Response:', responseData);  // Add this log

    // Return the data with proper structure
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        observations: responseData.observations  // Make sure we're sending the observations
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: `FRED API Error: ${error.message}` })
    };
  }
}
