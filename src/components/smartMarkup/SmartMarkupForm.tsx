import { Card, CardTitle } from '@/components/ui/Card';
import { NumberField } from '@/components/ui/NumberField';
import { PercentField } from '@/components/ui/PercentField';
import type { SmartMarkupInputs } from '@/types';

interface SmartMarkupFormProps {
  inputs: SmartMarkupInputs;
  onChange: <K extends keyof SmartMarkupInputs>(field: K, value: SmartMarkupInputs[K]) => void;
}

export function SmartMarkupForm({ inputs, onChange }: SmartMarkupFormProps) {
  return (
    <Card className="animate-fadeIn">
      <CardTitle className="mb-3">Metas de Precificação</CardTitle>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Produto"
          value={inputs.productCost}
          onChange={(value) => onChange('productCost', value)}
        />
        <NumberField label="Frete" value={inputs.shipping} onChange={(value) => onChange('shipping', value)} />
        <NumberField
          label="Lucro Desejado"
          value={inputs.desiredProfit}
          onChange={(value) => onChange('desiredProfit', value)}
        />
        <PercentField
          label="Margem Desejada"
          value={inputs.desiredMarginPercent}
          onChange={(value) => onChange('desiredMarginPercent', value)}
        />
      </div>
    </Card>
  );
}
