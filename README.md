# 📱 Currency Converter & Live Exchange Rates App (`app-dev`)

An end-to-end full-stack mobile application for real-time currency conversion, financial tracking, and live exchange rate management built with **React Native (Expo)** and powered by a **Django REST Framework** backend.

---

## 🛠️ Tech Stack & Architecture

- **Mobile Frontend:** React Native, Expo, TypeScript, Expo Router
- **State Management & Storage:** Zustand, `@react-native-async-storage/async-storage`, `expo-secure-store`
- **Native Capabilities:** `expo-notifications`, `expo-image-picker`
- **Backend API:** Python, Django REST Framework (DRF), JWT Authentication
- **External Integration:** Live Exchange Rate API

---

## 🚀 Key Features

- **Live Conversion Engine:** Real-time exchange rates updates with instant multi-currency conversion.
- **Offline Mode:** Local caching via `AsyncStorage` to browse latest rates without active internet access.
- **User History & Favorites:** User preferences, favorite currencies, and conversion history synced with Django DRF.
- **Secure Authentication:** JWT-based session persistence stored securely using `expo-secure-store`.
- **Daily Notifications:** Scheduled local push alerts (`expo-notifications`) for tracked currency movements.

---
