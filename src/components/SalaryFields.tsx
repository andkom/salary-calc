import { useEffect, useMemo, useState } from 'react';
import { MAX_INPUT_LENGTH } from '../constants/limits';
import { SALARY_FIELDS } from '../constants/fields';
import { useAppStore } from '../store/appStore';
import type { DraftState, SalaryPeriodKey } from '../types';
import { getCurrencySymbol, toDisplayValue } from '../utils/currency';
import { formatInputValue, sanitizeDecimalInput, sanitizeNumber } from '../utils/math';
import { useShallow } from 'zustand/react/shallow';

export default function SalaryFields() {
  const { currency, currencyRates, hoursSettings, hourlySalaryUsd, setSalaryFromField } =
    useAppStore(
      useShallow((state) => ({
        currency: state.currency,
        currencyRates: state.currencyRates,
        hoursSettings: state.hoursSettings,
        hourlySalaryUsd: state.hourlySalaryUsd,
        setSalaryFromField: state.setSalaryFromField,
      }))
    );

  const currentCurrencySymbol = getCurrencySymbol(currency);
  const [salaryDraft, setSalaryDraft] = useState<DraftState<SalaryPeriodKey>>({
    field: null,
    value: '',
  });

  useEffect(() => {
    setSalaryDraft({ field: null, value: '' });
  }, [currency]);

  const salaryFactors = useMemo<Record<SalaryPeriodKey, number>>(
    () => ({
      hour: 1,
      day: hoursSettings.day,
      week: hoursSettings.week,
      month: hoursSettings.month,
      year: hoursSettings.year,
    }),
    [hoursSettings]
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <h2 className="mb-1 text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
        Salary Rates
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Change one value and the other salary fields stay in sync.
      </p>
      <div className="space-y-3">
        {SALARY_FIELDS.map((field) => (
          <label key={field.key} className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
              <span className="mr-2 text-base font-semibold text-slate-500">
                {currentCurrencySymbol}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={
                  salaryDraft.field === field.key
                    ? salaryDraft.value
                    : formatInputValue(
                        toDisplayValue(
                          hourlySalaryUsd * salaryFactors[field.key],
                          currency,
                          currencyRates
                        )
                      )
                }
                onFocus={(event) => setSalaryDraft({ field: field.key, value: event.target.value })}
                onBlur={() => setSalaryDraft({ field: null, value: '' })}
                onChange={(event) => {
                  const nextValue = sanitizeDecimalInput(event.target.value);
                  setSalaryDraft({ field: field.key, value: nextValue });
                  setSalaryFromField(field.key, sanitizeNumber(nextValue));
                }}
                maxLength={MAX_INPUT_LENGTH}
                className="w-full bg-transparent text-right text-base font-semibold text-slate-900 outline-none"
              />
            </div>
          </label>
        ))}
      </div>
    </article>
  );
}
