import { useMemo, useState } from 'react';
import type { SimulatorInputs } from '@/types';
import { calculateSimulation, type SimulatorPricingContext } from '@/utils/calculations/simulatorCalculator';
import { useCurrencyContext } from '@/context/CurrencyContext';
import { DEFAULT_CURRENCY } from '@/constants/currencies';

const INITIAL_INPUTS: SimulatorInputs = {
  dailyInvestment: 0,
  cpa: 0,
  days: 30,
  dailyInvestmentCurrency: DEFAULT_CURRENCY,
  cpaCurrency: DEFAULT_CURRENCY,
};

export function useSimulator(pricing: SimulatorPricingContext) {
  const [inputs, setInputs] = useState<SimulatorInputs>(INITIAL_INPUTS);
  const { baseCurrency, convert } = useCurrencyContext();

  const setField = <K extends keyof SimulatorInputs>(field: K, value: SimulatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const converted = {
      dailyInvestment: convert(inputs.dailyInvestment, inputs.dailyInvestmentCurrency, baseCurrency),
      cpa: convert(inputs.cpa, inputs.cpaCurrency, baseCurrency),
      days: inputs.days,
    };
    return calculateSimulation(converted, pricing);
  }, [inputs, pricing, baseCurrency, convert]);

  return { inputs, setField, results };
}
