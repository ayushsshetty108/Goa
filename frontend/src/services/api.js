import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const apiHealth = () => api.get('/health').then(response => response.data);

export const collections = {
  trips: '/trips',
  checklist: '/checklists',
  favorites: '/favorites',
};
