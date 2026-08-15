import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ضعي IP جهازكِ المحمول/الحاسوب هنا للتواصل مع سيرفر Django
export const api = axios.create({
  baseURL: 'http://192.168.1.5:8000/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// إرفاق التوكين تلقائياً مع كل طلب يخرج لـ Django
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});