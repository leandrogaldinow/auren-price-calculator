import { useMemo, useState } from 'react';
import type { ProfileFees, SmartMarkupInputs } from '@/types';
import { calculateSmartMarkup } from '@/utils/calculations/smartMarkupCalculator';

const INITIAL_INPUTS: SmartMarkupInputs = {
  productCost: 0,
  shipping: 0,
  desiredProfit: 0,
  desiredMarginPercent: 0,
};

export function useSmartMarkup(activeProfileFees: ProfileFees) {
  const [inputs, setInputs] = useState<SmartMarkupInputs>(INITIAL_INPUTS);

  const setField = <K extends keyof SmartMarkupInputs>(field: K, value: SmartMarkupInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(
    () => calculateSmartMarkup(inputs, activeProfileFees),
    [inputs, activeProfileFees],
  );

  return { inputs, setField, results };
}
