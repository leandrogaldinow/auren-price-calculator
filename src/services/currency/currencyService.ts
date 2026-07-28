import type { ConversionRate, CurrencyCode } from './types';

/**
 * Static fallback rates so the app never breaks offline. TODO(currency):
 * replace with a live rate fetch (e.g. exchangerate.host) cached in
 * chrome.storage.local with a TTL — this module is the only place callers
 * need to touch when that lands.
 */
const FALLBACK_RATES: Record<string, number> = {
  'USD->BRL': 5.4,
  'CNY->BRL': 0.75,
  'BRL->MXN': 3.4,
  'EUR->BRL': 5.9,
};

export async function getConversionRate(
  from: CurrencyCode,
  to: CurrencyCode,
): Promise<ConversionRate> {
  const key = `${from}->${to}`;
  const rate = FALLBACK_RATES[key] ?? 1;
  return { from, to, rate, updatedAt: Date.now() };
}

export async function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): Promise<number> {
  if (from === to) return amount;
  const { rate } = await getConversionRate(from, to);
  return amount * rate;
}
