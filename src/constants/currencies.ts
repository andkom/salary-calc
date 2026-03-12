import type { CurrencyLabels, CurrencyRates } from '../types';

export const FALLBACK_CURRENCY_RATES: CurrencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  PLN: 3.95,
};

export const FALLBACK_CURRENCY_LABELS: CurrencyLabels = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  PLN: 'Polish Zloty',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PLN: 'zl',
};

export const DEFAULT_QUICK_CURRENCIES: string[] = ['USD', 'EUR', 'GBP', 'PLN'];
export const MAX_QUICK_CURRENCIES = 5;
