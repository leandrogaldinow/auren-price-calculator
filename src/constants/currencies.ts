import type { CurrencyConfig, CurrencyCode } from '@/types';

/**
 * Supported currencies. To add a new one: add an entry here and add its
 * BRL pair to the endpoint in `src/services/ExchangeRateService.ts`.
 */
export const CURRENCIES: CurrencyConfig[] = [
  { code: 'BRL', label: 'Real Brasileiro', flag: '🇧🇷', locale: 'pt-BR' },
  { code: 'USD', label: 'Dólar Americano', flag: '🇺🇸', locale: 'en-US' },
  { code: 'MXN', label: 'Peso Mexicano', flag: '🇲🇽', locale: 'es-MX' },
];

export const DEFAULT_CURRENCY: CurrencyCode = 'BRL';
