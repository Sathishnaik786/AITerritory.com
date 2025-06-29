import axios from 'axios';

// API Configuration - Use relative URL for Vite proxy in development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aiterritory-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
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