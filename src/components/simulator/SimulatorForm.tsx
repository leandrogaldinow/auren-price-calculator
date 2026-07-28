import { Card, CardTitle } from '@/components/ui/Card';
import { NumberField } from '@/components/ui/NumberField';
import { MoneyField } from '@/components/ui/MoneyField';
import type { SimulatorInputs } from '@/types';

interface SimulatorFormProps {
  inputs: SimulatorInputs;
  onChange: <K extends keyof SimulatorInputs>(field: K, value: SimulatorInputs[K]) => void;
}

export function SimulatorForm({ inputs, onChange }: SimulatorFormProps) {
  return (
    <Card className="animate-fadeIn">
      <CardTitle className="mb-3">Simulação de Campanha</CardTitle>
      <div className="flex flex-col gap-3">
        <MoneyField
          label="Investimento / dia"
          amount={inputs.dailyInvestment}
          currency={inputs.dailyInvestmentCurrency}
          onAmountChange={(value) => onChange('dailyInvestment', value)}
          onCurrencyChange={(currency) => onChange('dailyInvestmentCurrency', currency)}
        />
        <MoneyField
          label="CPA"
          amount={inputs.cpa}
          currency={inputs.cpaCurrency}
          onAmountChange={(value) => onChange('cpa', value)}
          onCurrencyChange={(currency) => onChange('cpaCurrency', currency)}
        />
        <NumberField
          label="Dias"
          value={inputs.days}
          onChange={(value) => onChange('days', value)}
          prefix=""
          suffix="dias"
          decimals={0}
        />
      </div>
    </Card>
  );
}
