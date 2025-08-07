import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000', // 🔁 Adjust if your backend runs elsewhere
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Attach JWT from localStorage if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
