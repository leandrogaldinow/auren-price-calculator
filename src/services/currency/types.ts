export type CurrencyCode = 'USD' | 'CNY' | 'BRL' | 'MXN' | 'EUR';

export interface ConversionRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  updatedAt: number;
}
