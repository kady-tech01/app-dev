import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true, // ننتظر التأكد من التوكين المحفوظ عند فتح التطبيق

  // 1. فحص التوكين المحفوظ فور فتح التطبيق
  checkAuth: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('user_token');
      if (storedToken) {
        set({ token: storedToken, isAuthenticated: true, isLoading: false });
      } else {
        set({ token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ token: null, isAuthenticated: false, isLoading: false });
    }
  },

  // 2. تسجيل الدخول وحفظ التوكين مشفراً
  login: async (newToken: string) => {
    await SecureStore.setItemAsync('user_token', newToken);
    set({ token: newToken, isAuthenticated: true });
  },

  // 3. تسجيل الخروج وحذف التوكين
  logout: async () => {
    await SecureStore.deleteItemAsync('user_token');
    set({ token: null, isAuthenticated: false });
  },
}));