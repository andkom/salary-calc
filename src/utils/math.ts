import { MAX_FRACTION_DIGITS, MAX_INPUT_LENGTH } from '../constants/limits';

export function sanitizeNumber(value: string): number {
  const normalized = value.replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function sanitizeDecimalInput(
  rawValue: string,
  maxLength = MAX_INPUT_LENGTH,
  maxFractionDigits = MAX_FRACTION_DIGITS
): string {
  const normalized = rawValue.replace(',', '.').replace(/[^\d.]/g, '');
  const dotIndex = normalized.indexOf('.');

  let intPart = normalized;
  let fractionPart = '';

  if (dotIndex >= 0) {
    intPart = normalized.slice(0, dotIndex);
    fractionPart = normalized.slice(dotIndex + 1).replace(/\./g, '');
  }

  const trimmedFraction = fractionPart.slice(0, maxFractionDigits);
  const hasDot = dotIndex >= 0;
  const composed = hasDot ? `${intPart}.${trimmedFraction}` : intPart;

  return composed.slice(0, maxLength);
}

export function round(value: number, precision = 6): number {
  const multiplier = 10 ** precision;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

export function formatValue(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatInputValue(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  const rounded = round(value, MAX_FRACTION_DIGITS);
  return String(rounded);
}
