import { useMemo, useRef, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { useAppStore } from '../store/appStore';
import type { CurrencyEntry } from '../types';
import { useShallow } from 'zustand/react/shallow';

export default function CurrencySwitcher() {
  const {
    currency,
    setCurrency,
    recentCustomCurrency,
    currencyLabels,
    quickCurrencies,
    toggleQuickCurrency,
    currenciesLoading,
    currenciesError,
  } = useAppStore(
    useShallow((state) => ({
      currency: state.currency,
      setCurrency: state.setCurrency,
      recentCustomCurrency: state.recentCustomCurrency,
      currencyLabels: state.currencyLabels,
      quickCurrencies: state.quickCurrencies,
      toggleQuickCurrency: state.toggleQuickCurrency,
      currenciesLoading: state.currenciesLoading,
      currenciesError: state.currenciesError,
    }))
  );

  const [pickerOpen, setPickerOpen] = useState(false);
  const [currencyQuery, setCurrencyQuery] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(pickerRef, () => setPickerOpen(false));

  const quickTabs = useMemo(() => {
    const tabs = quickCurrencies.filter((code) => currencyLabels[code]);

    if (
      recentCustomCurrency &&
      currencyLabels[recentCustomCurrency] &&
      !tabs.includes(recentCustomCurrency)
    ) {
      tabs.push(recentCustomCurrency);
    }

    if (!tabs.includes(currency) && currencyLabels[currency]) {
      tabs.push(currency);
    }

    return tabs;
  }, [quickCurrencies, recentCustomCurrency, currency, currencyLabels]);

  const currencyEntries = useMemo(
    () =>
      (Object.entries(currencyLabels) as CurrencyEntry[]).sort(([codeA], [codeB]) =>
        codeA.localeCompare(codeB)
      ),
    [currencyLabels]
  );

  const query = currencyQuery.trim().toLowerCase();
  const filteredCurrencyEntries = useMemo(
    () =>
      currencyEntries.filter(([code, label]) => {
        if (!query) {
          return true;
        }
        return code.toLowerCase().includes(query) || label.toLowerCase().includes(query);
      }),
    [currencyEntries, query]
  );

  return (
    <div className="relative flex w-full items-center gap-2 sm:w-auto" ref={pickerRef}>
      <div className="min-w-0 flex-1 rounded-xl bg-slate-100 p-1">
        <div className="flex flex-nowrap gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {quickTabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCurrency(item)}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                currency === item
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPickerOpen((prev) => !prev)}
        aria-label={pickerOpen ? 'Close currency picker' : 'Open currency picker'}
        aria-expanded={pickerOpen}
        title="More currencies"
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-white transition ${
          pickerOpen
            ? 'border-teal-300 text-teal-700'
            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
        }`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-current">
          <circle cx="4" cy="10" r="1.7" />
          <circle cx="10" cy="10" r="1.7" />
          <circle cx="16" cy="10" r="1.7" />
        </svg>
        <span className="sr-only">More currencies</span>
      </button>

      {pickerOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <input
            type="text"
            value={currencyQuery}
            onChange={(event) => setCurrencyQuery(event.target.value)}
            placeholder="Search code or name"
            className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />

          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {filteredCurrencyEntries.map(([code, label]) => {
              const isPinned = quickCurrencies.includes(code);
              const isActive = currency === code;

              return (
                <div
                  key={code}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-50"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency(code);
                      setPickerOpen(false);
                      setCurrencyQuery('');
                    }}
                    className={`flex-1 text-left text-sm ${
                      isActive
                        ? 'font-semibold text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="font-semibold">{code}</span>
                    <span className="ml-2 text-xs text-slate-500">{label}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleQuickCurrency(code)}
                    title={isPinned ? 'Remove from quick tabs' : 'Pin to quick tabs'}
                    className={`rounded-md px-2 py-1 text-sm ${
                      isPinned ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                    }`}
                  >
                    ★
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-xs text-slate-500">
            {currenciesLoading
              ? 'Updating available currencies...'
              : `${currencyEntries.length} currencies`}
          </div>
          {currenciesError ? <p className="mt-1 text-xs text-rose-500">{currenciesError}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
