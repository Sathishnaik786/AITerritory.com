import axios from 'axios';

// API Configuration - Use Render URL in production, relative URL in development
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://aiterritory-backend.onrender.com/api'
  : '/api';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    console.error('API Response Error:', error.response?.status, error.config?.url, error.message);
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