import type { CalculatorResults, SimulatorInputs, SimulatorResults } from '@/types';

/** Pricing figures the simulator needs from the active Calculator tab. */
export type SimulatorPricingContext = Pick<
  CalculatorResults,
  'sellingPrice' | 'profitBeforeMarketing'
>;

/**
 * Projects a paid-traffic campaign using the selling price and per-unit costs
 * already computed on the Calculator tab — ad spend here comes from real CPA
 * instead of the modeled "marketing %" field, so marketing fee is excluded
 * from the per-unit cost base (profitBeforeMarketing already adds it back).
 */
export function calculateSimulation(
  inputs: SimulatorInputs,
  pricing: SimulatorPricingContext,
): SimulatorResults {
  const totalInvestment = inputs.dailyInvestment * inputs.days;
  const orders = inputs.cpa > 0 ? totalInvestment / inputs.cpa : 0;
  const ordersPerDay = inputs.cpa > 0 ? inputs.dailyInvestment / inputs.cpa : 0;

  const revenue = orders * pricing.sellingPrice;
  const costPerOrderExclMarketing = pricing.sellingPrice - pricing.profitBeforeMarketing;
  const totalCostExclMarketing = orders * costPerOrderExclMarketing;

  const profit = revenue - totalCostExclMarketing - totalInvestment;
  const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
  const roas = totalInvestment > 0 ? revenue / totalInvestment : 0;

  return {
    totalInvestment,
    orders,
    revenue,
    profit,
    roi,
    roas,
    ordersPerDay,
  };
}
