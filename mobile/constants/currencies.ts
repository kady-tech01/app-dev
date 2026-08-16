export interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
  isPopular?: boolean;
}

export const ALL_CURRENCIES: CurrencyOption[] = [
  // Most Popular (Top Priority)
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', isPopular: true },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', isPopular: true },
  { code: 'DZD', name: 'Algerian Dinar', flag: '🇩🇿', isPopular: true },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', isPopular: true },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', isPopular: true },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', isPopular: true },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', isPopular: true },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', isPopular: true },

  // Additional Currencies
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
  { code: 'MAD', name: 'Moroccan Dirham', flag: '🇲🇦' },
  { code: 'TND', name: 'Tunisian Dinar', flag: '🇹🇳' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
];