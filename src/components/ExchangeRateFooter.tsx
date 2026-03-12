import { useAppStore } from '../store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { getCurrencyRate } from '../utils/currency';
import { formatValue } from '../utils/math';

export default function ExchangeRateFooter() {
  const { currency, currencyRates, ratesLoading, ratesError } = useAppStore(
    useShallow((state) => ({
      currency: state.currency,
      currencyRates: state.currencyRates,
      ratesLoading: state.ratesLoading,
      ratesError: state.ratesError,
    }))
  );
  const currentRate = getCurrencyRate(currencyRates, currency);

  return (
    <footer className="mt-6 text-xs text-slate-500">
      <p>
        Live rate: 1 USD = {formatValue(currentRate)} {currency}
        {ratesLoading ? ' (updating...)' : ''}
      </p>
      {ratesError ? <p className="mt-1 text-rose-500">{ratesError}</p> : null}
    </footer>
  );
}
