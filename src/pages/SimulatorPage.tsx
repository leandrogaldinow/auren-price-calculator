import { useCalculatorContext } from '@/context/CalculatorContext';
import { useCurrencyContext } from '@/context/CurrencyContext';
import { useSimulator } from '@/hooks/useSimulator';
import { SimulatorForm } from '@/components/simulator/SimulatorForm';
import { SimulatorResults } from '@/components/simulator/SimulatorResults';

export function SimulatorPage() {
  const { results: calculatorResults } = useCalculatorContext();
  const { baseCurrency } = useCurrencyContext();
  const { inputs, setField, results } = useSimulator({
    sellingPrice: calculatorResults.sellingPrice,
    profitBeforeMarketing: calculatorResults.profitBeforeMarketing,
  });

  return (
    <div className="flex flex-col gap-3">
      <SimulatorForm inputs={inputs} onChange={setField} />
      <SimulatorResults results={results} currency={baseCurrency} />
      <p className="px-1 text-center text-xs text-text-secondary">
        Baseado no preço de venda calculado na aba Calculadora ({calculatorResults.sellingPrice > 0 ? 'ativo' : 'defina os custos primeiro'}).
      </p>
    </div>
  );
}
