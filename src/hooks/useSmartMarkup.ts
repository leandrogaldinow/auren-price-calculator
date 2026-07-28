import { useMemo, useState } from 'react';
import type { ProfileFees, SmartMarkupInputs } from '@/types';
import { calculateSmartMarkup } from '@/utils/calculations/smartMarkupCalculator';
import { useCurrencyContext } from '@/context/CurrencyContext';
import { DEFAULT_CURRENCY } from '@/constants/currencies';

const INITIAL_INPUTS: SmartMarkupInputs = {
  productCost: 0,
  shipping: 0,
  desiredProfit: 0,
  desiredMarginPercent: 0,
  productCostCurrency: DEFAULT_CURRENCY,
  shippingCurrency: DEFAULT_CURRENCY,
  desiredProfitCurrency: DEFAULT_CURRENCY,
};

export function useSmartMarkup(activeProfileFees: ProfileFees) {
  const [inputs, setInputs] = useState<SmartMarkupInputs>(INITIAL_INPUTS);
  const { baseCurrency, convert } = useCurrencyContext();

  const setField = <K extends keyof SmartMarkupInputs>(field: K, value: SmartMarkupInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const converted = {
      productCost: convert(inputs.productCost, inputs.productCostCurrency, baseCurrency),
      shipping: convert(inputs.shipping, inputs.shippingCurrency, baseCurrency),
      desiredProfit: convert(inputs.desiredProfit, inputs.desiredProfitCurrency, baseCurrency),
      desiredMarginPercent: inputs.desiredMarginPercent,
    };
    return calculateSmartMarkup(converted, activeProfileFees);
  }, [inputs, activeProfileFees, baseCurrency, convert]);

  return { inputs, setField, results };
}
