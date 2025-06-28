// client/src/services/api.js

import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  // Use your backend's URL. For development, it's usually this:
  baseURL: 'http://localhost:5000/api', // Adjust the port if your backend uses a different one
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  This is an interceptor. It's a piece of code that runs
  BEFORE each request is sent. It's the perfect place to
  attach the authentication token.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;