import { CURRENCY_SYMBOLS, FALLBACK_CURRENCY_RATES } from '../constants/currencies';
import type { CurrencyCode, CurrencyRates } from '../types';
import { round } from './math';

export function getCurrencyRate(currencyRates: CurrencyRates, currency: CurrencyCode): number {
  return currencyRates[currency] ?? FALLBACK_CURRENCY_RATES[currency] ?? 1;
}

export function toDisplayValue(
  amountInUsd: number,
  currency: CurrencyCode,
  currencyRates: CurrencyRates
): number {
  return round(amountInUsd * getCurrencyRate(currencyRates, currency));
}

export function toUsd(
  amount: number,
  currency: CurrencyCode,
  currencyRates: CurrencyRates
): number {
  return round(amount / getCurrencyRate(currencyRates, currency));
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}
