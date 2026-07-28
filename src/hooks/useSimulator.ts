import { useMemo, useState } from 'react';
import type { SimulatorInputs } from '@/types';
import { calculateSimulation, type SimulatorPricingContext } from '@/utils/calculations/simulatorCalculator';

const INITIAL_INPUTS: SimulatorInputs = { dailyInvestment: 0, cpa: 0, days: 30 };

export function useSimulator(pricing: SimulatorPricingContext) {
  const [inputs, setInputs] = useState<SimulatorInputs>(INITIAL_INPUTS);

  const setField = <K extends keyof SimulatorInputs>(field: K, value: SimulatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => calculateSimulation(inputs, pricing), [inputs, pricing]);

  return { inputs, setField, results };
}
