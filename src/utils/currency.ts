import type { CurrencyCode, ExchangeRate } from '@/types';
import { CURRENCIES } from '@/constants/currencies';

export function getCurrencyConfig(currency: CurrencyCode) {
  return CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
}

export function getCurrencyLocale(currency: CurrencyCode): string {
  return getCurrencyConfig(currency).locale;
}

const symbolCache = new Map<CurrencyCode, string>();

/** Symbol resolved dynamically via Intl (never a hardcoded string). */
export function getCurrencySymbol(currency: CurrencyCode): string {
  const cached = symbolCache.get(currency);
  if (cached) return cached;

  const parts = new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).formatToParts(0);
  const symbol = parts.find((part) => part.type === 'currency')?.value ?? currency;
  symbolCache.set(currency, symbol);
  return symbol;
}

/**
 * Converts an amount between any two supported currencies using only the
 * pairs the exchange rate service actually fetches (rates use BRL as the
 * common pivot), so adding a currency just needs a new BRL pair — no new
 * conversion paths to wire up.
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: ExchangeRate[],
): number {
  if (from === to) return amount;

  const direct = rates.find((r) => r.from === from && r.to === to);
  if (direct) return amount * direct.rate;

  const inverse = rates.find((r) => r.from === to && r.to === from);
  if (inverse) return amount / inverse.rate;

  if (from !== 'BRL' && to !== 'BRL') {
    const toBrl = convertCurrency(amount, from, 'BRL', rates);
    return convertCurrency(toBrl, 'BRL', to, rates);
  }

  // No rate available (cache empty/failed) — degrade gracefully instead of breaking the calculation.
  return amount;
}
