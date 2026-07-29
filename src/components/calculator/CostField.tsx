import { PercentField } from '@/components/ui/PercentField';
import { MoneyField } from '@/components/ui/MoneyField';
import { getCostDefinition } from '@/services/costSettingsService';
import { useCalculatorContext } from '@/context/CalculatorContext';
import type { CostKey, ProfileFees } from '@/types';

interface CostFieldProps {
  costId: CostKey;
}

/**
 * Single cost input, resolved by registry definition — the only place CostKey maps to its
 * value/handler. Intentionally plain (no icon/tooltip) so the main form stays visually
 * identical to before this refactor — those live only in CostSettingsPanel.
 */
export function CostField({ costId }: CostFieldProps) {
  const def = getCostDefinition(costId);
  const {
    draftFees,
    setDraftFee,
    gatewayFixedFee,
    gatewayFixedFeeCurrency,
    setGatewayFixedFee,
    setGatewayFixedFeeCurrency,
  } = useCalculatorContext();

  if (def.type === 'money') {
    return (
      <MoneyField
        label={def.label}
        amount={gatewayFixedFee}
        currency={gatewayFixedFeeCurrency}
        onAmountChange={setGatewayFixedFee}
        onCurrencyChange={setGatewayFixedFeeCurrency}
      />
    );
  }

  const key = costId as keyof ProfileFees;
  return <PercentField label={def.label} value={draftFees[key]} onChange={(value) => setDraftFee(key, value)} />;
}
