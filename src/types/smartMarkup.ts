import type { CurrencyCode } from './currency';

export interface SmartMarkupInputs {
  productCost: number;
  shipping: number;
  desiredProfit: number;
  desiredMarginPercent: number;
  productCostCurrency: CurrencyCode;
  shippingCurrency: CurrencyCode;
  desiredProfitCurrency: CurrencyCode;
}

/** One scenario's worth of derived pricing — computed twice: by desired profit, by desired margin. */
export interface SmartMarkupScenario {
  idealPrice: number;
  idealMarkup: number;
  maxCpa: number;
  breakEvenRoas: number;
  achievedMarginPercent: number;
}

export interface SmartMarkupResults {
  byProfit: SmartMarkupScenario | null;
  byMargin: SmartMarkupScenario | null;
}
