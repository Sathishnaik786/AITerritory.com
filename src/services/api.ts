import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

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

// Default timeout in milliseconds
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens and retry logic
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set a custom timeout if not already set
    if (!config.timeout) {
      config.timeout = DEFAULT_TIMEOUT;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and retries
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (!isProduction) {
      console.log(`API Response (${response.status}):`, {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If the error is a timeout, try to retry
    if (error.code === 'ECONNABORTED' && !originalRequest?._retry) {
      console.warn(`Request to ${originalRequest?.url} timed out, retrying...`);
      
      // Initialize retry count if not exists
      originalRequest._retry = originalRequest._retry || 0;
      
      if (originalRequest._retry < MAX_RETRIES) {
        originalRequest._retry++;
        
        // Exponential backoff: wait 1s, then 2s, etc.
        const backoffDelay = 1000 * Math.pow(2, originalRequest._retry - 1);
        
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(api(originalRequest));
          }, backoffDelay);
        });
      }
    }
    
    // Log detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error Response:', {
        url: error.config?.url,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response Error:', {
        url: error.config?.url,
        message: 'No response received from server',
      });
    } else {
      // Something happened in setting up the request
      console.error('API Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to make API calls with retry logic
export const fetchWithRetry = async <T>(
  url: string,
  config: AxiosRequestConfig = {},
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    const response = await api({
      ...config,
      url,
    });
    return response.data;
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error) && error.code !== 'ECONNABORTED') {
      console.log(`Retrying ${url}, ${retries} attempts left...`);
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (MAX_RETRIES - retries + 1)));
      return fetchWithRetry<T>(url, config, retries - 1);
    }
    throw error;
  }
};

// AI Innovations
export const fetchAIInnovations = async (type?: string) => {
  const url = type ? `/ai-innovations?type=${type}` : '/ai-innovations';
  const res = await fetchWithRetry(url);
  return res;
};

// Research Papers
export const fetchAIResearchPapers = async () => {
  const res = await fetchWithRetry('/ai-innovations/papers/all');
  return res;
};

// Export the configured axios instance
export default api;