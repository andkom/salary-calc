import { create } from 'zustand';
import {
  DEFAULT_QUICK_CURRENCIES,
  FALLBACK_CURRENCY_LABELS,
  FALLBACK_CURRENCY_RATES,
  MAX_QUICK_CURRENCIES,
} from '../constants/currencies';
import { MAX_HOURLY_SALARY_USD } from '../constants/limits';
import { DEFAULT_HOURS_SETTINGS } from '../constants/workHours';
import type {
  CurrencyCode,
  CurrencyLabels,
  CurrencyRates,
  HoursFieldKey,
  HoursSettings,
  SalaryPeriodKey,
} from '../types';
import { toUsd } from '../utils/currency';
import { clamp, round } from '../utils/math';
import { recalculateSettings } from '../utils/workHours';

type FrankfurterLatestResponse = {
  rates?: Record<string, number>;
};

type AppStore = {
  currency: CurrencyCode;
  recentCustomCurrency: CurrencyCode | null;
  currencyRates: CurrencyRates;
  currencyLabels: CurrencyLabels;
  quickCurrencies: CurrencyCode[];
  ratesLoading: boolean;
  ratesError: string;
  currenciesLoading: boolean;
  currenciesError: string;
  currenciesInitialized: boolean;
  rateRequestId: number;
  hoursSettings: HoursSettings;
  hourlySalaryUsd: number;
  setCurrency: (currency: CurrencyCode) => void;
  toggleQuickCurrency: (code: CurrencyCode) => void;
  loadCurrencies: () => Promise<void>;
  loadRateForCurrentCurrency: () => Promise<void>;
  setSalaryFromField: (field: SalaryPeriodKey, value: number) => void;
  setHoursFromField: (field: HoursFieldKey, value: number) => void;
};

function isCurrencyLabels(payload: unknown): payload is CurrencyLabels {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  return Object.values(payload as Record<string, unknown>).every(
    (item) => typeof item === 'string'
  );
}

function getSalaryFactor(hoursSettings: HoursSettings, field: SalaryPeriodKey): number {
  if (field === 'hour') {
    return 1;
  }

  return hoursSettings[field];
}

export const useAppStore = create<AppStore>((set, get) => ({
  currency: 'USD',
  recentCustomCurrency: null,
  currencyRates: FALLBACK_CURRENCY_RATES,
  currencyLabels: FALLBACK_CURRENCY_LABELS,
  quickCurrencies: DEFAULT_QUICK_CURRENCIES,
  ratesLoading: false,
  ratesError: '',
  currenciesLoading: false,
  currenciesError: '',
  currenciesInitialized: false,
  rateRequestId: 0,
  hoursSettings: DEFAULT_HOURS_SETTINGS,
  hourlySalaryUsd: 25,

  setCurrency: (currency) =>
    set((state) => ({
      currency,
      recentCustomCurrency: state.quickCurrencies.includes(currency)
        ? state.recentCustomCurrency
        : currency,
    })),

  toggleQuickCurrency: (code) =>
    set((state) => {
      if (state.quickCurrencies.includes(code)) {
        return {
          quickCurrencies: state.quickCurrencies.filter((item) => item !== code),
        };
      }

      const deduplicated = [...state.quickCurrencies.filter((item) => item !== code), code];
      if (deduplicated.length <= MAX_QUICK_CURRENCIES) {
        return { quickCurrencies: deduplicated };
      }

      const next = [...deduplicated];
      const removeIndex = next.findIndex((item) => item !== state.currency && item !== code);
      if (removeIndex >= 0) {
        next.splice(removeIndex, 1);
      } else {
        next.shift();
      }

      return { quickCurrencies: next };
    }),

  loadCurrencies: async () => {
    const { currenciesLoading, currenciesInitialized } = get();
    if (currenciesLoading || currenciesInitialized) {
      return;
    }

    set({ currenciesLoading: true, currenciesError: '' });

    try {
      const response = await fetch('https://api.frankfurter.app/currencies');
      if (!response.ok) {
        throw new Error(`Failed to fetch currencies: ${response.status}`);
      }

      const data: unknown = await response.json();
      if (!isCurrencyLabels(data)) {
        throw new Error('Invalid currencies payload');
      }

      set((state) => ({
        currencyLabels: { ...state.currencyLabels, ...data },
        currenciesError: '',
        currenciesLoading: false,
        currenciesInitialized: true,
      }));
    } catch {
      set({
        currenciesError: 'Could not load full currency list. Showing fallback set.',
        currenciesLoading: false,
      });
    }
  },

  loadRateForCurrentCurrency: async () => {
    const { currency } = get();
    const requestId = get().rateRequestId + 1;

    if (currency === 'USD') {
      set({ rateRequestId: requestId, ratesLoading: false, ratesError: '' });
      return;
    }

    set({ ratesLoading: true, ratesError: '', rateRequestId: requestId });

    try {
      const response = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch rates: ${response.status}`);
      }

      const data = (await response.json()) as FrankfurterLatestResponse;
      const nextRate = data.rates?.[currency];

      if (!Number.isFinite(nextRate) || !nextRate || nextRate <= 0) {
        throw new Error('Invalid exchange rate payload');
      }

      if (get().rateRequestId !== requestId) {
        return;
      }

      set((state) => ({
        currencyRates: { ...state.currencyRates, [currency]: round(nextRate, 6) },
        ratesLoading: false,
        ratesError: '',
      }));
    } catch {
      if (get().rateRequestId !== requestId) {
        return;
      }

      set({
        ratesLoading: false,
        ratesError: 'Could not refresh the exchange rate. Using the last known value.',
      });
    }
  },

  setSalaryFromField: (field, value) =>
    set((state) => {
      const valueInUsd = toUsd(value, state.currency, state.currencyRates);
      const factor = getSalaryFactor(state.hoursSettings, field);

      if (!Number.isFinite(factor) || factor <= 0) {
        return {
          hourlySalaryUsd: 0,
        };
      }

      return {
        hourlySalaryUsd: round(clamp(valueInUsd / factor, 0, MAX_HOURLY_SALARY_USD)),
      };
    }),

  setHoursFromField: (field, value) =>
    set((state) => ({
      hoursSettings: recalculateSettings(state.hoursSettings, field, value),
    })),
}));
