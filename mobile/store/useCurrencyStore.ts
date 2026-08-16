import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@exchange_rates_cache';
const HISTORY_KEY = '@conversion_history';
const FAVORITES_KEY = '@favorite_pairs';

export interface HistoryItem {
  id: string;
  from: string;
  to: string;
  amount: string;
  result: number;
  date: string;
}

export interface FavoritePair {
  id: string;
  from: string;
  to: string;
}

interface CurrencyStore {
  baseCurrency: string;
  targetCurrency: string;
  amount: string;
  convertedAmount: number | null;
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  history: HistoryItem[];
  favorites: FavoritePair[];

  setBaseCurrency: (currency: string) => void;
  setTargetCurrency: (currency: string) => void;
  setAmount: (amount: string) => void;
  fetchRates: () => Promise<void>;
  swapCurrencies: () => void;
  
  // History Actions
  addHistoryItem: () => Promise<void>;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;

  // Favorites Actions
  toggleFavorite: (from: string, to: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  selectFavoritePair: (pair: FavoritePair) => void;
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
  history: [],
  favorites: [
    { id: '1', from: 'USD', to: 'DZD' },
    { id: '2', from: 'EUR', to: 'DZD' },
  ],

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

  fetchRates: async () => {
    const { baseCurrency, amount, targetCurrency } = get();
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `https://open.er-api.com/v6/latest/${baseCurrency}`
      );
      const rates = response.data.rates;
      const rate = rates[targetCurrency] || 0;

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
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const { rates } = JSON.parse(cached);
          const rate = rates[targetCurrency] || 0;
          set({
            rates,
            convertedAmount: (parseFloat(amount) || 0) * rate,
            isOffline: true,
            error: 'Offline mode: Using cached rates',
          });
        }
      } catch (e) {
        set({ error: 'Failed to fetch exchange rates' });
      }
      set({ loading: false });
    }
  },

  // History Functions
  addHistoryItem: async () => {
    const { baseCurrency, targetCurrency, amount, convertedAmount, history } = get();
    if (!convertedAmount || !amount) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      from: baseCurrency,
      to: targetCurrency,
      amount,
      result: convertedAmount,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newItem, ...history.slice(0, 19)]; // Keep last 20 items
    set({ history: updated });
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  clearHistory: async () => {
    set({ history: [] });
    await AsyncStorage.removeItem(HISTORY_KEY);
  },

  loadHistory: async () => {
    try {
      const saved = await AsyncStorage.getItem(HISTORY_KEY);
      if (saved) set({ history: JSON.parse(saved) });
    } catch (e) {
      console.error(e);
    }
  },

  // Favorites Functions
  toggleFavorite: async (from, to) => {
    const { favorites } = get();
    const exists = favorites.find((f) => f.from === from && f.to === to);
    let updated: FavoritePair[];

    if (exists) {
      updated = favorites.filter((f) => f.id !== exists.id);
    } else {
      updated = [...favorites, { id: Date.now().toString(), from, to }];
    }

    set({ favorites: updated });
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  },

  loadFavorites: async () => {
    try {
      const saved = await AsyncStorage.getItem(FAVORITES_KEY);
      if (saved) set({ favorites: JSON.parse(saved) });
    } catch (e) {
      console.error(e);
    }
  },

  selectFavoritePair: (pair) => {
    set({ baseCurrency: pair.from, targetCurrency: pair.to });
    get().fetchRates();
  },
}));