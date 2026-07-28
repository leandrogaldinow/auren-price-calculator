import type { CurrencyCode } from '@/types';
import { DEFAULT_CURRENCY } from '@/constants/currencies';

const currencyFormatters = new Map<CurrencyCode, Intl.NumberFormat>();

function getCurrencyFormatter(currency: CurrencyCode): Intl.NumberFormat {
  const cached = currencyFormatters.get(currency);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  currencyFormatters.set(currency, formatter);
  return formatter;
}

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export function formatCurrency(value: number, currency: CurrencyCode = DEFAULT_CURRENCY): string {
  const formatter = getCurrencyFormatter(currency);
  if (!Number.isFinite(value)) return formatter.format(0);
  return formatter.format(value);
}

export function formatDateTime(timestamp: number): string {
  return dateTimeFormatter.format(new Date(timestamp));
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return `${percentFormatter.format(0)}%`;
  return `${percentFormatter.format(value)}%`;
}

export function formatNumber(value: number, fractionDigits = 2): string {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toFixed(fractionDigits).replace('.', ',');
}

export function formatMultiplier(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(2).replace('.', ',')}x`;
}
