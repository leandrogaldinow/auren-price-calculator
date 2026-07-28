import { Card, CardTitle } from '@/components/ui/Card';
import { MoneyField } from '@/components/ui/MoneyField';
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
      <div className="flex flex-col gap-3">
        <MoneyField
          label="Produto"
          amount={inputs.productCost}
          currency={inputs.productCostCurrency}
          onAmountChange={(value) => onChange('productCost', value)}
          onCurrencyChange={(currency) => onChange('productCostCurrency', currency)}
        />
        <MoneyField
          label="Frete"
          amount={inputs.shipping}
          currency={inputs.shippingCurrency}
          onAmountChange={(value) => onChange('shipping', value)}
          onCurrencyChange={(currency) => onChange('shippingCurrency', currency)}
        />
        <MoneyField
          label="Lucro Desejado"
          amount={inputs.desiredProfit}
          currency={inputs.desiredProfitCurrency}
          onAmountChange={(value) => onChange('desiredProfit', value)}
          onCurrencyChange={(currency) => onChange('desiredProfitCurrency', currency)}
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
