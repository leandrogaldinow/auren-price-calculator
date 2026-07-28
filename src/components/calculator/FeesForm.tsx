import { Card, CardTitle } from '@/components/ui/Card';
import { PercentField } from '@/components/ui/PercentField';
import type { ProfileFees } from '@/types';

interface FeesFormProps {
  fees: ProfileFees;
  onChange: <K extends keyof ProfileFees>(field: K, value: ProfileFees[K]) => void;
}

const FEE_FIELDS: { key: keyof Omit<ProfileFees, 'markup'>; label: string }[] = [
  { key: 'gatewayPercent', label: 'Gateway' },
  { key: 'checkoutPercent', label: 'Checkout' },
  { key: 'iofPercent', label: 'IOF' },
  { key: 'taxPercent', label: 'Imposto' },
  { key: 'marketingPercent', label: 'Marketing' },
  { key: 'extraPercent', label: 'Despesas Extras' },
];

export function FeesForm({ fees, onChange }: FeesFormProps) {
  return (
    <Card className="animate-fadeIn">
      <CardTitle className="mb-3">Taxas e Percentuais</CardTitle>
      <div className="grid grid-cols-2 gap-3">
        {FEE_FIELDS.map(({ key, label }) => (
          <PercentField key={key} label={label} value={fees[key]} onChange={(value) => onChange(key, value)} />
        ))}
      </div>
    </Card>
  );
}
