import { DEFAULT_DAYS_PER_WEEK, MONTHS_PER_YEAR, WEEKS_PER_YEAR } from '../constants/workHours';
import { MAX_DAYS_PER_WEEK, MAX_HOURS_PER_DAY, MIN_DAYS_PER_WEEK } from '../constants/limits';
import type { HoursFieldKey, HoursSettings } from '../types';
import { clamp, round } from './math';

function normalizeDaysPerWeek(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_DAYS_PER_WEEK;
  }
  return round(clamp(value, MIN_DAYS_PER_WEEK, MAX_DAYS_PER_WEEK), 2);
}

function fromDayAndDaysPerWeek(day: number, daysPerWeek: number): HoursSettings {
  const normalizedDay = round(clamp(day, 0, MAX_HOURS_PER_DAY), 2);
  const normalizedDaysPerWeek = normalizeDaysPerWeek(daysPerWeek);
  const week = round(normalizedDay * normalizedDaysPerWeek);
  const year = round(week * WEEKS_PER_YEAR);
  const month = round(year / MONTHS_PER_YEAR);

  return {
    day: normalizedDay,
    daysPerWeek: normalizedDaysPerWeek,
    week,
    month,
    year,
  };
}

export function recalculateSettings(
  currentSettings: HoursSettings,
  field: HoursFieldKey,
  value: number
): HoursSettings {
  const daysPerWeek = normalizeDaysPerWeek(currentSettings.daysPerWeek);

  if (field === 'day') {
    return fromDayAndDaysPerWeek(value, daysPerWeek);
  }

  if (field === 'daysPerWeek') {
    return fromDayAndDaysPerWeek(currentSettings.day, value);
  }

  if (field === 'week') {
    const day = daysPerWeek > 0 ? value / daysPerWeek : 0;
    return fromDayAndDaysPerWeek(day, daysPerWeek);
  }

  if (field === 'month') {
    const year = value * MONTHS_PER_YEAR;
    const week = year / WEEKS_PER_YEAR;
    const day = daysPerWeek > 0 ? week / daysPerWeek : 0;
    return fromDayAndDaysPerWeek(day, daysPerWeek);
  }

  const week = value / WEEKS_PER_YEAR;
  const day = daysPerWeek > 0 ? week / daysPerWeek : 0;
  return fromDayAndDaysPerWeek(day, daysPerWeek);
}
