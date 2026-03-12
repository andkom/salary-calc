export type CurrencyCode = string;

export type CurrencyRates = Record<CurrencyCode, number>;
export type CurrencyLabels = Record<CurrencyCode, string>;
export type CurrencyEntry = [CurrencyCode, string];

export type SalaryPeriodKey = 'hour' | 'day' | 'week' | 'month' | 'year';
export type HoursPeriodKey = Exclude<SalaryPeriodKey, 'hour'>;
export type HoursFieldKey = HoursPeriodKey | 'daysPerWeek';

export type FieldDef<T extends string> = {
  key: T;
  label: string;
  unit?: string;
};

export type HoursSettings = Record<HoursPeriodKey, number> & {
  daysPerWeek: number;
};
export type SalaryValues = Record<SalaryPeriodKey, number>;

export type DraftState<T extends string> = {
  field: T | null;
  value: string;
};
