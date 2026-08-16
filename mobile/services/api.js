import axios from 'axios';

// Replace with your local IP address for physical device / emulator testing
const BASE_URL = 'http://192.168.1.15:8000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCurrencies = async () => {
  const response = await api.get('/currencies/');
  return response.data;
};

export const fetchExchangeRates = async () => {
  const response = await api.get('/rates/');
  return response.data;
};

export const createPriceAlert = async (alertData) => {
  const response = await api.post('/alerts/', alertData);
  return response.data;
};

export default api;