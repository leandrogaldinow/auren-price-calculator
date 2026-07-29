import { Accordion } from '@/components/ui/Accordion';
import { CostCategorySection } from '@/components/calculator/CostCategorySection';
import { CostSettingsButton } from '@/components/calculator/CostSettingsButton';
import { CostSummary } from '@/components/calculator/CostSummary';
import { COST_CATEGORIES } from '@/constants/costRegistry';
import { useCostSettingsContext } from '@/context/CostSettingsContext';

export function CostAccordion() {
  const { feesAccordionExpanded, toggleFeesAccordion } = useCostSettingsContext();

  return (
    <Accordion
      title="Taxas e Percentuais"
      expanded={feesAccordionExpanded}
      onToggle={toggleFeesAccordion}
      headerExtra={<CostSettingsButton />}
      subtitle={<CostSummary />}
    >
      <div className="flex flex-col gap-4">
        {COST_CATEGORIES.map((category) => (
          <CostCategorySection key={category.id} categoryId={category.id} />
        ))}
      </div>
    </Accordion>
  );
}
