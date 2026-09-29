import axios from 'axios';
import { handleLocalApiRequest } from './localDataService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
});

// Interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alzaban_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track if server backend is reachable
let backendAvailable = null;

// Axios custom adapter to ensure 100% offline & static Vercel compatibility
const defaultAdapter = axios.getAdapter(axios.defaults.adapter);

api.defaults.adapter = async (config) => {
  // If static deployment already detected without backend
  if (backendAvailable === false) {
    try {
      const localData = handleLocalApiRequest(config);
      return {
        data: localData,
        status: 200,
        statusText: 'OK (Local Data)',
        headers: { 'content-type': 'application/json' },
        config
      };
    } catch (localErr) {
      return Promise.reject(localErr);
    }
  }

  try {
    const response = await defaultAdapter(config);

    // If Vercel SPA rewrite returned index.html for an API endpoint
    if (typeof response.data === 'string' && (response.data.trim().startsWith('<!') || response.data.includes('<html'))) {
      console.warn('[Al Zaban Store] Backend not found on Vercel. Seamlessly switching to embedded full-catalog data store.');
      backendAvailable = false;
      const localData = handleLocalApiRequest(config);
      return {
        ...response,
        data: localData,
        headers: { 'content-type': 'application/json' }
      };
    }

    backendAvailable = true;
    return response;
  } catch (error) {
    // If backend is unreachable or returns 404 / 500 / network error
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error');
    const isNotFound = error.response && (error.response.status === 404 || error.response.status === 502 || error.response.status === 503);

    if (isNetworkError || isNotFound) {
      console.warn('[Al Zaban Store] Network/API unavailable. Serving from embedded full-catalog data store for:', config.url);
      backendAvailable = false;
      try {
        const localData = handleLocalApiRequest(config);
        return {
          data: localData,
          status: 200,
          statusText: 'OK (Client Store)',
          headers: { 'content-type': 'application/json' },
          config
        };
      } catch (localErr) {
        return Promise.reject(localErr);
      }
    }

    return Promise.reject(error);
  }
};

export default api;
