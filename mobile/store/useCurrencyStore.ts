import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@exchange_rates_cache';

interface CurrencyStore {
  baseCurrency: string;
  targetCurrency: string;
  amount: string;
  convertedAmount: number | null;
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  setBaseCurrency: (currency: string) => void;
  setTargetCurrency: (currency: string) => void;
  setAmount: (amount: string) => void;
  fetchRates: () => Promise<void>;
  swapCurrencies: () => void;
  loadCachedRates: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  baseCurrency: 'USD',
  targetCurrency: 'DZD',
  amount: '100',
  convertedAmount: null,
  rates: {},
  loading: false,
  error: null,
  isOffline: false,

  setBaseCurrency: (currency) => {
    set({ baseCurrency: currency });
    get().fetchRates();
  },

  setTargetCurrency: (currency) => {
    set({ targetCurrency: currency });
    const { amount, rates } = get();
    if (rates[currency]) {
      set({ convertedAmount: (parseFloat(amount) || 0) * rates[currency] });
    }
  },

  setAmount: (amount) => {
    set({ amount });
    const { targetCurrency, rates } = get();
    const rate = rates[targetCurrency] || 0;
    set({ convertedAmount: (parseFloat(amount) || 0) * rate });
  },

  swapCurrencies: () => {
    const { baseCurrency, targetCurrency } = get();
    set({ baseCurrency: targetCurrency, targetCurrency: baseCurrency });
    get().fetchRates();
  },

  loadCachedRates: async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rates, baseCurrency } = JSON.parse(cached);
        const { amount, targetCurrency } = get();
        const rate = rates[targetCurrency] || 0;
        set({
          rates,
          baseCurrency,
          convertedAmount: (parseFloat(amount) || 0) * rate,
          isOffline: true,
          error: 'Offline mode: Using cached rates',
        });
      }
    } catch (e) {
      console.error('Failed to load cache', e);
    }
  },

  fetchRates: async () => {
    const { baseCurrency, amount, targetCurrency } = get();
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `https://open.er-api.com/v6/latest/${baseCurrency}`
      );
      const rates = response.data.rates;
      const rate = rates[targetCurrency] || 0;

      // Save to local storage for offline support
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ rates, baseCurrency, timestamp: Date.now() })
      );

      set({
        rates,
        convertedAmount: (parseFloat(amount) || 0) * rate,
        loading: false,
        isOffline: false,
      });
    } catch (err) {
      // Try loading from offline cache if network fails
      await get().loadCachedRates();
      set({ loading: false });
    }
  },
}));