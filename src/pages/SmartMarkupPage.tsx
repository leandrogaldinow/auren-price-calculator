import { useCalculatorContext } from '@/context/CalculatorContext';
import { useSmartMarkup } from '@/hooks/useSmartMarkup';
import { SmartMarkupForm } from '@/components/smartMarkup/SmartMarkupForm';
import { SmartMarkupResults } from '@/components/smartMarkup/SmartMarkupResults';

export function SmartMarkupPage() {
  const { draftFees, activeProfile } = useCalculatorContext();
  const { inputs, setField, results } = useSmartMarkup(draftFees);

  return (
    <div className="flex flex-col gap-3">
      <SmartMarkupForm inputs={inputs} onChange={setField} />
      <SmartMarkupResults byProfit={results.byProfit} byMargin={results.byMargin} />
      <p className="px-1 text-center text-xs text-text-secondary">
        Usa as taxas do perfil "{activeProfile?.name}" para calcular o preço ideal.
      </p>
    </div>
  );
}
