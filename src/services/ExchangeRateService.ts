import type { CurrencyCode, ExchangeCache, ExchangeRate } from '@/types';
import { storageGet, storageSet } from '@/storage/chromeStorage';

/**
 * Only place in the app that talks to the exchange rate API. To swap providers
 * later, this is the sole module that needs to change — callers only ever see
 * `ExchangeCache`/`ExchangeRate`.
 */
const API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,MXN-BRL,USD-MXN';
const CACHE_KEY = 'auren_exchange_rate_cache';
const STALE_MS = 30 * 60 * 1000;

const FRIENDLY_ERROR = 'Não foi possível atualizar as cotações.';

interface AwesomeApiPair {
  code: CurrencyCode;
  codein: CurrencyCode;
  bid: string;
}

type AwesomeApiResponse = Record<string, AwesomeApiPair>;

async function fetchExchangeRates(): Promise<ExchangeCache> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`AwesomeAPI request failed with status ${response.status}`);

  const data = (await response.json()) as AwesomeApiResponse;
  const exchangeRates: ExchangeRate[] = Object.values(data).map((pair) => ({
    from: pair.code,
    to: pair.codein,
    rate: Number.parseFloat(pair.bid),
  }));

  const cache: ExchangeCache = { exchangeRates, lastUpdate: Date.now() };
  await storageSet(CACHE_KEY, cache);
  return cache;
}

export interface ExchangeRatesResult {
  cache: ExchangeCache | null;
  error: string | null;
}

/**
 * Cache-first read: reuses the stored rates when they're under 30 minutes
 * old, otherwise fetches fresh ones. Pass `force: true` (the "Atualizar
 * Cotação" button) to bypass the TTL. Network failures fall back to whatever
 * cache exists — only surfaces an error when there's truly nothing to show.
 */
export async function getExchangeRates(options?: { force?: boolean }): Promise<ExchangeRatesResult> {
  const cached = (await storageGet<ExchangeCache>(CACHE_KEY)) ?? null;
  const isStale = !cached || Date.now() - cached.lastUpdate > STALE_MS;

  if (!options?.force && cached && !isStale) {
    return { cache: cached, error: null };
  }

  try {
    const fresh = await fetchExchangeRates();
    return { cache: fresh, error: null };
  } catch {
    if (cached) return { cache: cached, error: null };
    return { cache: null, error: FRIENDLY_ERROR };
  }
}
