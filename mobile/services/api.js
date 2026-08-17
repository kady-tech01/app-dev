import axios from 'axios';

// استبدلي هذا الـ IP بـ IP حاسوبكِ (مثل 192.168.1.15)
const BASE_URL = 'http://192.168.85.166:8000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// جلب أحدث أسعار الصرف
export const getExchangeRates = async () => {
  try {
    const response = await api.get('/rates/');
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

// إنشاء تنبيه سعر جديد
export const createPriceAlert = async (alertData) => {
  try {
    const response = await api.post('/alerts/', alertData);
    return response.data;
  } catch (error) {
    console.error('Error creating price alert:', error);
    throw error;
  }
};

export default api;