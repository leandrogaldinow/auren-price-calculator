import type { ProfileFees, SmartMarkupInputs, SmartMarkupResults, SmartMarkupScenario } from '@/types';

/** Numeric inputs only, already converted to the base currency by the caller. */
export type SmartMarkupCalculationInputs = Pick<
  SmartMarkupInputs,
  'productCost' | 'shipping' | 'desiredProfit' | 'desiredMarginPercent'
>;

/** Sum of every percentage-of-price fee on the active profile, as a 0–1 fraction. */
function feesFraction(fees: ProfileFees): number {
  return (
    (fees.gatewayPercent +
      fees.checkoutPercent +
      fees.iofPercent +
      fees.taxPercent +
      fees.marketingPercent +
      fees.extraPercent) /
    100
  );
}

function buildScenario(
  price: number,
  profit: number,
  productCost: number,
  shipping: number,
): SmartMarkupScenario | null {
  const costBase = productCost + shipping;
  if (!Number.isFinite(price) || price <= 0 || costBase <= 0) return null;

  return {
    idealPrice: price,
    idealMarkup: price / costBase,
    maxCpa: profit,
    breakEvenRoas: profit > 0 ? price / profit : 0,
    achievedMarginPercent: (profit / price) * 100,
  };
}

/**
 * Works backwards from a profit or margin target — using the active profile's
 * fee percentages — to find the selling price that hits it exactly.
 */
export function calculateSmartMarkup(
  inputs: SmartMarkupCalculationInputs,
  activeProfileFees: ProfileFees,
): SmartMarkupResults {
  const costBase = inputs.productCost + inputs.shipping;
  const fraction = feesFraction(activeProfileFees);

  let byProfit: SmartMarkupScenario | null = null;
  if (inputs.desiredProfit > 0 && fraction < 1) {
    const price = (costBase + inputs.desiredProfit) / (1 - fraction);
    byProfit = buildScenario(price, inputs.desiredProfit, inputs.productCost, inputs.shipping);
  }

  let byMargin: SmartMarkupScenario | null = null;
  const marginFraction = inputs.desiredMarginPercent / 100;
  if (inputs.desiredMarginPercent > 0 && fraction + marginFraction < 1) {
    const price = costBase / (1 - fraction - marginFraction);
    const profit = price * marginFraction;
    byMargin = buildScenario(price, profit, inputs.productCost, inputs.shipping);
  }

  return { byProfit, byMargin };
}
