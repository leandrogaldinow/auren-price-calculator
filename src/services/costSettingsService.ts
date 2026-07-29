import { COST_REGISTRY } from '@/constants/costRegistry';
import type { CalculatorInputs, CostCategoryId, CostDefinition, CostKey, CostSettings } from '@/types';

export const COST_KEYS: CostKey[] = COST_REGISTRY.map((c) => c.id);

export function getCostDefinition(id: CostKey): CostDefinition {
  const def = COST_REGISTRY.find((c) => c.id === id);
  if (!def) throw new Error(`Unknown cost id: ${id}`);
  return def;
}

export function getCostsByCategory(categoryId: CostCategoryId): CostDefinition[] {
  return COST_REGISTRY.filter((c) => c.category === categoryId);
}

export function defaultCostSettings(): CostSettings {
  const enabled = {} as Record<CostKey, boolean>;
  const visible = {} as Record<CostKey, boolean>;
  for (const cost of COST_REGISTRY) {
    enabled[cost.id] = cost.enabledByDefault;
    visible[cost.id] = cost.visibleByDefault;
  }
  return { enabled, visible };
}

/** Backfills missing/partial cost settings (legacy installs, malformed storage) with registry defaults. */
export function withCostSettingsDefaults(raw: unknown): CostSettings {
  const candidate = raw as Partial<CostSettings> | undefined;
  const defaults = defaultCostSettings();
  for (const key of COST_KEYS) {
    if (typeof candidate?.enabled?.[key] === 'boolean') defaults.enabled[key] = candidate.enabled[key];
    if (typeof candidate?.visible?.[key] === 'boolean') defaults.visible[key] = candidate.visible[key];
  }
  return defaults;
}

/** Zeroes out any cost the user disabled, without touching the stored draft values. */
export function applyCostSettingsMask(inputs: CalculatorInputs, settings: CostSettings): CalculatorInputs {
  const masked = { ...inputs };
  for (const key of COST_KEYS) {
    if (!settings.enabled[key]) masked[key] = 0;
  }
  return masked;
}

/** Aggregate summary across the whole registry — used by the collapsed accordion state. */
export function computeCostSummary(
  settings: CostSettings,
  fees: Record<CostKey, number>,
): { percentSum: number; activeCount: number; totalCount: number } {
  let percentSum = 0;
  let activeCount = 0;
  for (const cost of COST_REGISTRY) {
    const isEnabled = settings.enabled[cost.id];
    if (isEnabled) {
      activeCount += 1;
      if (cost.type === 'percent') percentSum += fees[cost.id] ?? 0;
    }
  }
  return { percentSum, activeCount, totalCount: COST_REGISTRY.length };
}
