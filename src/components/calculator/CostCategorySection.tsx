import { CostGroup } from '@/components/calculator/CostGroup';
import { COST_CATEGORIES } from '@/constants/costRegistry';
import { getCostsByCategory } from '@/services/costSettingsService';
import { useCostSettingsContext } from '@/context/CostSettingsContext';
import type { CostCategoryId } from '@/types';

interface CostCategorySectionProps {
  categoryId: CostCategoryId;
}

/** Generic section for one cost category — adding a new category means adding registry data, not a new component. */
export function CostCategorySection({ categoryId }: CostCategorySectionProps) {
  const category = COST_CATEGORIES.find((c) => c.id === categoryId);
  const { costSettings } = useCostSettingsContext();
  const visibleCostIds = getCostsByCategory(categoryId)
    .filter((cost) => costSettings.visible[cost.id])
    .map((cost) => cost.id);

  if (visibleCostIds.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-text-secondary">{category?.label}</span>
      <CostGroup costIds={visibleCostIds} />
    </div>
  );
}
