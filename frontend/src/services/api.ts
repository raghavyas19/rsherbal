import axios from 'axios';

// Normalize backend URL: allow port-only values like "5000" in env by coercing to http://localhost:5000
// Production default: use the API subdomain so cookies set for `.rsherbal.shop` are sent correctly.
const rawBackend = import.meta.env.VITE_BACKEND_URL || '';
const isProd = import.meta.env.MODE === 'production';
let backendBase = rawBackend;
if (!backendBase) backendBase = isProd ? 'https://api.rsherbal.shop' : 'http://localhost:5000';
// If someone mistakenly set just a port number like '5000' or ':5000', fix it
if (/^:\d+$/.test(backendBase) || /^\d+$/.test(backendBase)) {
  backendBase = `http://localhost:${backendBase.replace(/^:/, '')}`;
} else if (!/^https?:\/\//i.test(backendBase)) {
  // If it doesn't start with protocol but contains a host, assume http
  backendBase = `http://${backendBase}`;
}

const API = axios.create({
  baseURL: backendBase,
  withCredentials: true, // Send cookies for auth
});

// Products
export const fetchProducts = () => API.get('/api/products');
export const fetchProduct = (id: string) => API.get(`/api/products/${id}`);

// Authentication endpoints

// Cart
export const getCart = () => API.get('/api/cart');
export const addOrUpdateCart = (data: any) => API.post('/api/cart', data);
export const removeCartItem = (itemId: string) => API.delete(`/api/cart/${itemId}`);
export const mergeGuestCart = (data: any) => API.post('/api/cart/merge', data);

// Orders
export const placeOrder = (data: any) => API.post('/api/orders', data);
export const getUserOrders = () => API.get('/api/orders');

// Reviews
export const addReview = (productId: string, data: any) => API.post(`/api/reviews/${productId}`, data);
export const getProductReviews = (productId: string) => API.get(`/api/reviews/${productId}`);

export const getProfile = () => API.get('/api/user/me');
export const updateProfile = (data: any) => API.patch('/api/user/me', data);

// ADMIN
export const adminFetchOrders = () => API.get('/api/admin/orders');
export const adminFetchOrderStats = () => API.get('/api/admin/order-stats');
export const adminFetchTopProducts = () => API.get('/api/admin/top-products');
export const adminFetchUsers = () => API.get('/api/admin/users');
export const adminAddProduct = (data: any) => API.post('/api/admin/products', data);
export const adminUpdateProduct = (id: string, data: any) => API.patch(`/api/admin/products/${id}`, data);
export const adminDeleteProduct = (id: string) => API.delete(`/api/admin/products/${id}`);
export const adminUpdateOrderStatus = (orderId: string, data: any) => API.patch(`/api/admin/orders/${orderId}/status`, data);
export const adminLogin = (payload: { id: string; password: string }) => API.post('/api/admin/login', payload);
export const adminLogout = () => API.post('/api/admin/logout');
export const adminDeleteUser = (id: string) => API.delete(`/api/admin/users/${id}`);
export const adminDeleteOrder = (id: string) => API.delete(`/api/admin/orders/${id}`);

export default API; 