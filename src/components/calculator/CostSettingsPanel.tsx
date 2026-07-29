import { Checkbox } from '@/components/ui/Checkbox';
import { Tooltip } from '@/components/ui/Tooltip';
import { InfoIcon } from '@/components/icons';
import { COST_ICON_MAP } from '@/components/icons/costIconMap';
import { COST_CATEGORIES } from '@/constants/costRegistry';
import { getCostsByCategory } from '@/services/costSettingsService';
import { useCostSettingsContext } from '@/context/CostSettingsContext';

export function CostSettingsPanel() {
  const { costSettings, toggleCostEnabled, toggleCostVisible } = useCostSettingsContext();

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Configurar Custos</span>
      {COST_CATEGORIES.map((category) => (
        <div key={category.id} className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-text">{category.label}</span>
          <div className="flex flex-col gap-3">
            {getCostsByCategory(category.id).map((cost) => {
              const CostIcon = COST_ICON_MAP[cost.icon];
              return (
                <div
                  key={cost.id}
                  className="flex flex-col gap-1.5 border-b border-border-subtle pb-2 last:border-none last:pb-0"
                >
                  <span className="flex items-center gap-1.5 text-sm font-medium text-text">
                    <CostIcon width={14} height={14} className="text-text-secondary" />
                    {cost.label}
                    <Tooltip content={cost.description}>
                      <button
                        type="button"
                        aria-label={`Sobre ${cost.label}`}
                        className="text-text-secondary hover:text-text"
                      >
                        <InfoIcon width={12} height={12} />
                      </button>
                    </Tooltip>
                  </span>
                  <Checkbox
                    label="Participa do cálculo"
                    checked={costSettings.enabled[cost.id]}
                    onChange={() => toggleCostEnabled(cost.id)}
                  />
                  <Checkbox
                    label="Exibir na interface"
                    checked={costSettings.visible[cost.id]}
                    onChange={() => toggleCostVisible(cost.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
