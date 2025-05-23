// src/services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Базовый URL бэкенда

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  try {
    const response = await axios.post(`${API_URL}/login/token`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await axios.get(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};