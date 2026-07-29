import type { CalculatorInputs, CalculatorResults } from '@/types';
import { resolveMarginTier } from '@/constants/marginTiers';

const IDEAL_CPA_RATIO = 0.8;

export function calculatePricing(inputs: CalculatorInputs): CalculatorResults {
  const productPlusShipping = inputs.productCost + inputs.shipping;
  const sellingPrice = productPlusShipping * inputs.markup;

  const gatewayFee = sellingPrice * (inputs.gatewayPercent / 100);
  const gatewayFixedFee = inputs.gatewayFixedFee;
  const checkoutFee = sellingPrice * (inputs.checkoutPercent / 100);
  const iofFee = sellingPrice * (inputs.iofPercent / 100);
  const taxFee = sellingPrice * (inputs.taxPercent / 100);
  const marketingFee = sellingPrice * (inputs.marketingPercent / 100);
  const extraFee = sellingPrice * (inputs.extraPercent / 100);
  const fxConversionFee = sellingPrice * (inputs.fxConversionPercent / 100);
  const reserveFee = sellingPrice * (inputs.reservePercent / 100);

  const financialCosts = gatewayFee + gatewayFixedFee + checkoutFee + iofFee;
  const totalFees = financialCosts + taxFee + marketingFee + extraFee + fxConversionFee + reserveFee;

  const netProfit =
    sellingPrice -
    inputs.productCost -
    inputs.shipping -
    gatewayFee -
    gatewayFixedFee -
    checkoutFee -
    iofFee -
    taxFee -
    marketingFee -
    extraFee -
    fxConversionFee -
    reserveFee;

  const profitBeforeMarketing = netProfit + marketingFee;

  const marginPercent = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
  const roi = productPlusShipping > 0 ? (netProfit / productPlusShipping) * 100 : 0;

  const maxCpa = netProfit;
  const idealCpa = maxCpa * IDEAL_CPA_RATIO;
  const breakEvenRoas = maxCpa > 0 ? sellingPrice / maxCpa : 0;

  return {
    sellingPrice,
    productPlusShipping,
    gatewayFee,
    gatewayFixedFee,
    checkoutFee,
    iofFee,
    taxFee,
    marketingFee,
    extraFee,
    fxConversionFee,
    reserveFee,
    financialCosts,
    totalFees,
    netProfit,
    profitBeforeMarketing,
    marginPercent,
    roi,
    breakEvenRoas,
    maxCpa,
    idealCpa,
    marginTier: resolveMarginTier(marginPercent).tier,
  };
}
