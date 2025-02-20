// src/components/SP500Prediction/useKalshiData.js
import { createSignal, createEffect } from 'solid-js';

const CACHE_KEY = 'kalshi_sp500_data';
const MARKET_CLOSE_HOUR = 16; // 4 PM EST

function shouldFetchNewData() {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return true;

  const { timestamp } = JSON.parse(cachedData);
  const lastFetchDate = new Date(timestamp);
  const now = new Date();

  // Convert both to EST
  const estOffset = -4; // EST is UTC-4
  const lastFetchEST = new Date(lastFetchDate.getTime() + (estOffset * 60 * 60 * 1000));
  const nowEST = new Date(now.getTime() + (estOffset * 60 * 60 * 1000));

  // If it's a different day or it's after 4 PM EST and we haven't fetched today after 4 PM
  return (
    lastFetchEST.getDate() !== nowEST.getDate() ||
    (nowEST.getHours() >= MARKET_CLOSE_HOUR && lastFetchEST.getHours() < MARKET_CLOSE_HOUR)
  );
}

export function useKalshiData() {
  const [data, setData] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  const fetchData = async () => {
    try {
      const timestamp = Date.now().toString();
      const method = 'GET';
      const path = '/trade-api/v2/markets?series=SP500Y25';
      
      const headers = {
        'KALSHI-ACCESS-KEY': '731c0410-6dbe-47a2-ac7f-bab9a4be1e0b',
        'KALSHI-ACCESS-TIMESTAMP': timestamp
      };

      const response = await fetch('https://demo-api.kalshi.co' + path, { headers });
      const jsonData = await response.json();

      // Process the data
      const processedData = {
        timestamp: Date.now(),
        ranges: jsonData.markets.map(market => ({
          range: market.title,
          probability: market.probability * 100
        })).sort((a, b) => b.probability - a.probability)
      };

      // Cache the data
      localStorage.setItem(CACHE_KEY, JSON.stringify(processedData));
      setData(processedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  createEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    if (shouldFetchNewData()) {
      fetchData();
    } else if (cachedData) {
      setData(JSON.parse(cachedData));
      setLoading(false);
    }
  });

  return { data, loading, error };
}
