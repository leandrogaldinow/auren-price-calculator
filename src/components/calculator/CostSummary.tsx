import { computeCostSummary } from '@/services/costSettingsService';
import { useCalculatorContext } from '@/context/CalculatorContext';
import { useCostSettingsContext } from '@/context/CostSettingsContext';
import { formatPercent } from '@/utils/format';
import type { CostKey } from '@/types';

/** Aggregate summary shown while the fees accordion is collapsed, e.g. "9,5% · 7 de 9 custos ativos". */
export function CostSummary() {
  const { draftFees, gatewayFixedFee } = useCalculatorContext();
  const { costSettings } = useCostSettingsContext();

  const fees = { ...draftFees, gatewayFixedFee } as Record<CostKey, number>;
  const { percentSum, activeCount, totalCount } = computeCostSummary(costSettings, fees);

  return (
    <span className="truncate text-xs text-text-secondary">
      {formatPercent(percentSum)} · {activeCount} de {totalCount} custos ativos
    </span>
  );
}
