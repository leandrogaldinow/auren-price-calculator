export type CurrencyCode = 'BRL' | 'USD' | 'MXN';

/** Static metadata for a supported currency — add a new currency by adding one entry. */
export interface CurrencyConfig {
  code: CurrencyCode;
  label: string;
  flag: string;
  locale: string;
}

export interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
}

/** Shape persisted in chrome.storage.local for the exchange rate cache. */
export interface ExchangeCache {
  exchangeRates: ExchangeRate[];
  lastUpdate: number;
}
