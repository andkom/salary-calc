import { useState } from 'react';
import { MAX_INPUT_LENGTH } from '../constants/limits';
import { SETTINGS_FIELDS } from '../constants/fields';
import { useAppStore } from '../store/appStore';
import type { DraftState, HoursFieldKey } from '../types';
import { formatInputValue, sanitizeDecimalInput, sanitizeNumber } from '../utils/math';
import { useShallow } from 'zustand/react/shallow';

export default function HoursSettingsFields() {
  const { hoursSettings, setHoursFromField } = useAppStore(
    useShallow((state) => ({
      hoursSettings: state.hoursSettings,
      setHoursFromField: state.setHoursFromField,
    }))
  );
  const [hoursDraft, setHoursDraft] = useState<DraftState<HoursFieldKey>>({
    field: null,
    value: '',
  });

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <h2 className="mb-1 text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
        Advanced Settings
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Change one value and the other working-time fields stay in sync.
      </p>
      <div className="space-y-3">
        {SETTINGS_FIELDS.map((field) => (
          <label key={field.key} className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
              <input
                type="text"
                inputMode="decimal"
                value={
                  hoursDraft.field === field.key
                    ? hoursDraft.value
                    : formatInputValue(hoursSettings[field.key])
                }
                onFocus={(event) => setHoursDraft({ field: field.key, value: event.target.value })}
                onBlur={() => setHoursDraft({ field: null, value: '' })}
                onChange={(event) => {
                  const nextValue = sanitizeDecimalInput(event.target.value);
                  setHoursDraft({ field: field.key, value: nextValue });
                  setHoursFromField(field.key, sanitizeNumber(nextValue));
                }}
                maxLength={MAX_INPUT_LENGTH}
                className="w-full bg-transparent text-right text-base font-semibold text-slate-900 outline-none"
              />
              <span className="ml-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                {field.unit ?? 'hours'}
              </span>
            </div>
          </label>
        ))}
      </div>
    </article>
  );
}
