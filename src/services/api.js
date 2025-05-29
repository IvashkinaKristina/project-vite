import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/user/`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Обрабатываем ошибки валидации от бэкенда
      if (error.response.status === 422) {
        throw { 
          message: "Ошибки валидации",
          errors: error.response.data.detail
        };
      }
      throw { message: error.response.data.detail || "Ошибка сервера" };
    }
    throw { message: "Не удалось подключиться к серверу" };
  }
};

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  try {
    const response = await axios.post(`${API_URL}/login/token`, formData);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    throw { message: error.response?.data?.detail || "Ошибка авторизации" };
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await axios.get(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка получения пользователя:", error);
    return null;
  }
};