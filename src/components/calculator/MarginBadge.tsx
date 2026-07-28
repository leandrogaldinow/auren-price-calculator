import { Badge } from '@/components/ui/Badge';
import { resolveMarginTier } from '@/constants/marginTiers';

export function MarginBadge({ marginPercent }: { marginPercent: number }) {
  const tier = resolveMarginTier(marginPercent);
  return (
    <Badge colorClass={tier.colorClass} bgClass={tier.bgClass}>
      <span>{tier.emoji}</span>
      {tier.label}
    </Badge>
  );
}
