import { CostField } from '@/components/calculator/CostField';
import type { CostKey } from '@/types';

interface CostGroupProps {
  costIds: CostKey[];
}

/** Pure list of cost fields — no heading, no context reads beyond what CostField needs. */
export function CostGroup({ costIds }: CostGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      {costIds.map((id) => (
        <CostField key={id} costId={id} />
      ))}
    </div>
  );
}
