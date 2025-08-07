// utils/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000', // ✅ must match backend
});

export default API;
