import type { MarginTier } from '@/types';

export interface MarginTierConfig {
  tier: MarginTier;
  label: string;
  emoji: string;
  minMarginPercent: number;
  colorClass: string;
  bgClass: string;
}

/** Ordered from best to worst — first match (margin >= threshold) wins. */
export const MARGIN_TIERS: MarginTierConfig[] = [
  {
    tier: 'excellent',
    label: 'Excelente',
    emoji: '🟢',
    minMarginPercent: 35,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
  },
  {
    tier: 'good',
    label: 'Boa',
    emoji: '🟡',
    minMarginPercent: 25,
    colorClass: 'text-warning',
    bgClass: 'bg-warning/10',
  },
  {
    tier: 'attention',
    label: 'Atenção',
    emoji: '🟠',
    minMarginPercent: 15,
    colorClass: 'text-orange-500',
    bgClass: 'bg-orange-500/10',
  },
  {
    tier: 'not-recommended',
    label: 'Não recomendado',
    emoji: '🔴',
    minMarginPercent: -Infinity,
    colorClass: 'text-danger',
    bgClass: 'bg-danger/10',
  },
];

export function resolveMarginTier(marginPercent: number): MarginTierConfig {
  return (
    MARGIN_TIERS.find((tier) => marginPercent >= tier.minMarginPercent) ??
    MARGIN_TIERS[MARGIN_TIERS.length - 1]
  );
}
