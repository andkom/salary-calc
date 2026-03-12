import type { HoursSettings } from '../types';

export const DEFAULT_DAYS_PER_WEEK = 5;
export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;

export const DEFAULT_HOURS_SETTINGS: HoursSettings = {
  day: 8,
  daysPerWeek: DEFAULT_DAYS_PER_WEEK,
  week: 8 * DEFAULT_DAYS_PER_WEEK,
  month: (8 * DEFAULT_DAYS_PER_WEEK * WEEKS_PER_YEAR) / MONTHS_PER_YEAR,
  year: 8 * DEFAULT_DAYS_PER_WEEK * WEEKS_PER_YEAR,
};
