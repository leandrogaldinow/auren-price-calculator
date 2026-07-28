import type { CurrencyCode } from './currency';

export interface SimulatorInputs {
  /** Daily ad budget. */
  dailyInvestment: number;
  cpa: number;
  days: number;
  dailyInvestmentCurrency: CurrencyCode;
  cpaCurrency: CurrencyCode;
}

export interface SimulatorResults {
  totalInvestment: number;
  orders: number;
  revenue: number;
  profit: number;
  roi: number;
  roas: number;
  ordersPerDay: number;
}
