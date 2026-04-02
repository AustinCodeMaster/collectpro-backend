import axios from 'axios';

// Create a base Axios instance configured for our Node/Express backend
export const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Match this to your backend PORT
});

// Automatically attach the JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
