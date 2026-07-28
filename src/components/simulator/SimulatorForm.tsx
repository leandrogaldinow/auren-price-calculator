import { Card, CardTitle } from '@/components/ui/Card';
import { NumberField } from '@/components/ui/NumberField';
import type { SimulatorInputs } from '@/types';

interface SimulatorFormProps {
  inputs: SimulatorInputs;
  onChange: <K extends keyof SimulatorInputs>(field: K, value: SimulatorInputs[K]) => void;
}

export function SimulatorForm({ inputs, onChange }: SimulatorFormProps) {
  return (
    <Card className="animate-fadeIn">
      <CardTitle className="mb-3">Simulação de Campanha</CardTitle>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Investimento / dia"
          value={inputs.dailyInvestment}
          onChange={(value) => onChange('dailyInvestment', value)}
        />
        <NumberField label="CPA" value={inputs.cpa} onChange={(value) => onChange('cpa', value)} />
        <div className="col-span-2">
          <NumberField
            label="Dias"
            value={inputs.days}
            onChange={(value) => onChange('days', value)}
            prefix=""
            suffix="dias"
            decimals={0}
          />
        </div>
      </div>
    </Card>
  );
}
