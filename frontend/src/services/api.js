import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Restaurants
export const getRestaurants = (search = '') =>
  API.get(`/restaurants${search ? `?search=${search}` : ''}`);
export const getRestaurant = (id) => API.get(`/restaurants/${id}`);
export const getFilteredMenu = (id, params) =>
  API.get(`/restaurants/${id}/menu`, { params });

// Orders
export const placeOrder = (data) => API.post('/orders', data);
export const getUserOrders = (userId) => API.get(`/orders/${userId}`);
export const getAllOrders = (status) =>
  API.get(`/orders/all${status ? `?status=${status}` : ''}`);

export default API;
