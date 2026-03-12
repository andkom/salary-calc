import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../store/appStore';

const CURRENCIES_RETRY_DELAY_MS = 15_000;

export function useAppInitialization(): void {
  const {
    currency,
    currenciesInitialized,
    currenciesLoading,
    currenciesError,
    loadCurrencies,
    loadRateForCurrentCurrency,
  } = useAppStore(
    useShallow((state) => ({
      currency: state.currency,
      currenciesInitialized: state.currenciesInitialized,
      currenciesLoading: state.currenciesLoading,
      currenciesError: state.currenciesError,
      loadCurrencies: state.loadCurrencies,
      loadRateForCurrentCurrency: state.loadRateForCurrentCurrency,
    }))
  );

  useEffect(() => {
    void loadCurrencies();
  }, [loadCurrencies]);

  useEffect(() => {
    if (currenciesInitialized || currenciesLoading || !currenciesError) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadCurrencies();
    }, CURRENCIES_RETRY_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [currenciesInitialized, currenciesLoading, currenciesError, loadCurrencies]);

  useEffect(() => {
    void loadRateForCurrentCurrency();
  }, [currency, loadRateForCurrentCurrency]);
}
