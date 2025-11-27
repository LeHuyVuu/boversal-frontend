import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// API Gateway Configuration
const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
const PROJECT_SERVICE = process.env.NEXT_PUBLIC_PROJECT_SERVICE || '/project-management-service';

// Configure axios defaults - All requests go through Gateway
axios.defaults.baseURL = `${GATEWAY_URL}${PROJECT_SERVICE}`;
axios.defaults.withCredentials = true; // ⚠️ QUAN TRỌNG: Enable cookies
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Debug logging
console.log('=== Axios Configuration ===');
console.log('GATEWAY_URL:', GATEWAY_URL);
console.log('PROJECT_SERVICE:', PROJECT_SERVICE);
console.log('axios.defaults.baseURL:', axios.defaults.baseURL);
console.log('withCredentials:', axios.defaults.withCredentials);
console.log('==========================');

// Request interceptor
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log all requests
    console.log('🔵 [API Request]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error: AxiosError) => {
    console.error('🔴 [Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log all successful responses
    console.log('🟢 [API Response]', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error: AxiosError) => {
    // Log all errors with details
    console.error('🔴 [API Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      console.warn('⚠️ [Auth] Unauthorized - Token expired or invalid');
      
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;
