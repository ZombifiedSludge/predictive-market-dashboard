import fetch from '@netlify/fetch';  // Change to use Netlify's fetch

export const handler = async function(event, context) {
  const FRED_API_KEY = 'b12c1cced5c15f90f28f8f6aaeb331cd';
  
  try {
    // Add timeout and better error handling
    const fetchWithTimeout = (url) => {
      return fetch(url, {
        timeout: 8000,
        headers: {
          'Accept': 'application/json'
        }
      });
    };

    const [fedResponse, unemploymentResponse, durablesResponse] = await Promise.all([
      fetchWithTimeout(`https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=lin`),
      fetchWithTimeout(`https://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=lin`),
      fetchWithTimeout(`https://api.stlouisfed.org/fred/series/observations?series_id=DGORDER&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=mil`)
    ]);

    // Check if responses are ok
    if (!fedResponse.ok || !unemploymentResponse.ok || !durablesResponse.ok) {
      throw new Error('One or more FRED API requests failed');
    }

    const [fedData, unemploymentData, durablesData] = await Promise.all([
      fedResponse.json(),
      unemploymentResponse.json(),
      durablesResponse.json()
    ]);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        fedData,
        unemploymentData,
        durablesData
      })
    };
  } catch (error) {
    console.error('FRED API Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch FRED data',
        details: error.message 
      })
    };
  }
};
