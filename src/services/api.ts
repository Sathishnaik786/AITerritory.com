import axios from 'axios';

// API Configuration - Use proxy in development, direct URL in production
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Use proxy in development to avoid CORS issues, direct URL in production
const API_BASE_URL = isProduction 
  ? 'https://aiterritory-com.onrender.com/api'  // Use direct backend URL in production
  : '/api';  // Use proxy in development

// Debug logging for API configuration
console.log('🔧 API Configuration:');
console.log('  Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('  Hostname:', window.location.hostname);
console.log('  API Base URL:', API_BASE_URL);
console.log('  Full URL example:', `${API_BASE_URL}/blogs/test/comments`);
console.log('  Current URL:', window.location.href);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug: Log all blog detail responses in production
if (isProduction) {
  api.interceptors.response.use(
    (response) => {
      if (response.config.url && response.config.url.startsWith('/blogs/')) {
        console.log('Blog detail API response:', response.data);
      }
      return response;
    },
    (error) => Promise.reject(error)
  );
}

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.config?.url, error.message);
    console.error('  Full error:', error);
    
    // Log specific error types
    if (error.code === 'ERR_NETWORK') {
      console.error('  Network error - possible CORS issue');
    }
    if (error.response?.status === 404) {
      console.error('  404 Not Found - check if endpoint exists');
    }
    if (error.response?.status === 429) {
      // Back off to avoid spamming during dev
      console.warn('  429 Too Many Requests - backing off');
    }
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AI Innovations
export const fetchAIInnovations = async (type?: string) => {
  const url = type ? `/ai-innovations?type=${type}` : '/ai-innovations';
  const res = await api.get(url);
  return res.data;
};

// Research Papers
export const fetchAIResearchPapers = async () => {
  const res = await api.get('/ai-innovations/papers/all');
  return res.data;
};

export default api;