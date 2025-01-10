import fetch from 'node-fetch';  // Change this line

exports.handler = async function(event, context) {
  const FRED_API_KEY = 'b12c1cced5c15f90f28f8f6aaeb331cd';
  
  try {
    const [fedResponse, unemploymentResponse, durablesResponse] = await Promise.all([
      fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=lin`),
      fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=lin`),
      fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=DGORDER&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=mil`)
    ]);

    const [fedData, unemploymentData, durablesData] = await Promise.all([
      fedResponse.json(),
      unemploymentResponse.json(),
      durablesResponse.json()
    ]);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'  // Add this line
      },
      body: JSON.stringify({
        fedData,
        unemploymentData,
        durablesData
      })
    };
  } catch (error) {
    console.error('Error:', error);  // Add this line
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'  // Add this line
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
