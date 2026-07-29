import type { CostKey } from './costSettings';

export type CostType = 'percent' | 'money';

/** Add a new id here to create a new cost category. */
export type CostCategoryId = 'financial' | 'operational';

export type CostIconName = 'percent' | 'money' | 'shield' | 'receipt';

export interface CostCategoryDefinition {
  id: CostCategoryId;
  label: string;
}

export interface CostDefinition {
  id: CostKey;
  label: string;
  description: string;
  category: CostCategoryId;
  type: CostType;
  defaultValue: number;
  enabledByDefault: boolean;
  visibleByDefault: boolean;
  icon: CostIconName;
}
