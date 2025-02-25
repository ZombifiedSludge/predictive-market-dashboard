// Utility functions for caching API responses
// Refreshes cache daily at 4 PM EST

/**
 * Checks if data should be refreshed based on:
 * 1. If we have no cached data
 * 2. If it's after 4 PM EST today and we haven't refreshed today
 * 3. If the cache is from a previous day
 * 
 * @param {string} cacheKey - Key for the cached data
 * @returns {boolean} - Whether we should fetch fresh data
 */
export const shouldRefreshCache = (cacheKey) => {
  // Get cached data and timestamp
  const cachedData = localStorage.getItem(cacheKey);
  if (!cachedData) return true;
  
  try {
    const { timestamp } = JSON.parse(cachedData);
    if (!timestamp) return true;
    
    const cachedDate = new Date(timestamp);
    const now = new Date();
    
    // Check if cached date is from a previous day
    if (cachedDate.toDateString() !== now.toDateString()) {
      return true;
    }
    
    // Check if it's after 4 PM EST and we haven't refreshed since 4 PM
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const isPastFourPM = estNow.getHours() >= 16; // 4 PM = 16:00
    const cachedEstTime = new Date(cachedDate.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const wasCachedBeforeFourPM = cachedEstTime.getHours() < 16;
    
    // Refresh if it's after 4 PM and our last refresh was before 4 PM
    if (isPastFourPM && wasCachedBeforeFourPM) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error parsing cache timestamp:", error);
    return true; // Refresh if there's any issue with the cache
  }
};

/**
 * Gets data from cache or returns null if invalid
 * 
 * @param {string} cacheKey - Key for the cached data
 * @returns {object|null} - Cached data or null
 */
export const getCachedData = (cacheKey) => {
  const cachedData = localStorage.getItem(cacheKey);
  if (!cachedData) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cachedData);
    return { data, timestamp };
  } catch (error) {
    console.error("Error retrieving cached data:", error);
    return null;
  }
};

/**
 * Saves data to cache with current timestamp
 * 
 * @param {string} cacheKey - Key for storing the data
 * @param {object} data - Data to cache
 */
export const saveToCache = (cacheKey, data) => {
  try {
    const cacheObject = {
      data,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
  } catch (error) {
    console.error("Error saving to cache:", error);
  }
};

/**
 * Formats a timestamp to a user-friendly string
 * 
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted date/time string
 */
export const formatCacheTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown";
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) + " EST";
  } catch (error) {
    return "Invalid date";
  }
};
