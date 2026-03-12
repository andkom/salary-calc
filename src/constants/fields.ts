import type { FieldDef, HoursFieldKey, SalaryPeriodKey } from '../types';

export const SETTINGS_FIELDS: Array<FieldDef<HoursFieldKey>> = [
  { key: 'daysPerWeek', label: 'Working days per week', unit: 'days' },
  { key: 'day', label: 'Working hours per day', unit: 'hours' },
  { key: 'week', label: 'Working hours per week', unit: 'hours' },
  { key: 'month', label: 'Working hours per month', unit: 'hours' },
  { key: 'year', label: 'Working hours per year', unit: 'hours' },
];

export const SALARY_FIELDS: Array<FieldDef<SalaryPeriodKey>> = [
  { key: 'hour', label: 'Salary per hour' },
  { key: 'day', label: 'Salary per day' },
  { key: 'week', label: 'Salary per week' },
  { key: 'month', label: 'Salary per month' },
  { key: 'year', label: 'Salary per year' },
];

export const SALARY_PERIOD_KEYS: SalaryPeriodKey[] = SALARY_FIELDS.map(({ key }) => key);
