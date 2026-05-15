import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

export const createLecture = async (formData) => {
  const response = await api.post('/lectures', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getLectures = async () => {
  const response = await api.get('/lectures');
  return response.data;
};

export const getLecture = async (id) => {
  const response = await api.get(`/lectures/${id}`);
  return response.data;
};

export const updateLecture = async (id, formData) => {
  const response = await api.put(`/lectures/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const saveAnswer = async (data) => {
  const response = await api.post('/progress', data);
  return response.data;
};

export const getStatistics = async (lectureId) => {
  const response = await api.get(`/statistics/${lectureId}`);
  return response.data;
};