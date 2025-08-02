// Shared API configuration for consistent API URLs across all services
export const getApiBaseUrl = () => {
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  return isProduction 
    ? 'https://aiterritory-com.onrender.com/api'
    : 'http://localhost:3003/api';
};

// Export the base URL for direct use
export const API_BASE_URL = getApiBaseUrl(); 