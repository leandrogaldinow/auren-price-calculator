import type { ComponentType } from 'react';
import type { CostIconName } from '@/types';
import { MoneyIcon, PercentIcon, ReceiptIcon, ShieldIcon } from './index';

export const COST_ICON_MAP: Record<CostIconName, ComponentType<{ width?: number; height?: number; className?: string }>> = {
  percent: PercentIcon,
  money: MoneyIcon,
  shield: ShieldIcon,
  receipt: ReceiptIcon,
};
