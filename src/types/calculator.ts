export interface CalculatorInputs {
  productCost: number;
  shipping: number;
  markup: number;
  gatewayPercent: number;
  checkoutPercent: number;
  iofPercent: number;
  taxPercent: number;
  marketingPercent: number;
  extraPercent: number;
}

export type MarginTier = 'excellent' | 'good' | 'attention' | 'not-recommended';

export interface CalculatorResults {
  sellingPrice: number;
  productPlusShipping: number;
  gatewayFee: number;
  checkoutFee: number;
  iofFee: number;
  taxFee: number;
  marketingFee: number;
  extraFee: number;
  /** Gateway + checkout + IOF — payment-processing related costs. */
  financialCosts: number;
  /** Sum of every fee applied on top of the selling price. */
  totalFees: number;
  netProfit: number;
  /** Profit before marketing spend is deducted — used by the Simulator. */
  profitBeforeMarketing: number;
  marginPercent: number;
  roi: number;
  breakEvenRoas: number;
  maxCpa: number;
  idealCpa: number;
  marginTier: MarginTier;
}
