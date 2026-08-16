import { create } from 'zustand';
import axios from 'axios';

interface CurrencyStore {
  baseCurrency: string;
  targetCurrency: string;
  amount: string;
  convertedAmount: number | null;
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  setBaseCurrency: (currency: string) => void;
  setTargetCurrency: (currency: string) => void;
  setAmount: (amount: string) => void;
  fetchRates: () => Promise<void>;
  swapCurrencies: () => void;
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  baseCurrency: 'USD',
  targetCurrency: 'DZD',
  amount: '100',
  convertedAmount: null,
  rates: {},
  loading: false,
  error: null,

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
      // Free open-access API for exchange rates
      const response = await axios.get(
        `https://open.er-api.com/v6/latest/${baseCurrency}`
      );
      const rates = response.data.rates;
      const rate = rates[targetCurrency] || 0;

      set({
        rates,
        convertedAmount: (parseFloat(amount) || 0) * rate,
        loading: false,
      });
    } catch (err) {
      set({ error: 'Failed to fetch exchange rates', loading: false });
    }
  },
}));