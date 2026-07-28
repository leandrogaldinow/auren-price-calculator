import { Card, CardTitle } from '@/components/ui/Card';
import { NumberField } from '@/components/ui/NumberField';
import { MoneyField } from '@/components/ui/MoneyField';
import type { CurrencyCode } from '@/types';

interface CostFormProps {
  productCost: number;
  shipping: number;
  markup: number;
  productCostCurrency: CurrencyCode;
  shippingCurrency: CurrencyCode;
  onProductCostChange: (value: number) => void;
  onShippingChange: (value: number) => void;
  onMarkupChange: (value: number) => void;
  onProductCostCurrencyChange: (currency: CurrencyCode) => void;
  onShippingCurrencyChange: (currency: CurrencyCode) => void;
}

export function CostForm({
  productCost,
  shipping,
  markup,
  productCostCurrency,
  shippingCurrency,
  onProductCostChange,
  onShippingChange,
  onMarkupChange,
  onProductCostCurrencyChange,
  onShippingCurrencyChange,
}: CostFormProps) {
  return (
    <Card className="animate-fadeIn">
      <CardTitle className="mb-3">Custos do Produto</CardTitle>
      <div className="flex flex-col gap-3">
        <MoneyField
          label="Produto"
          amount={productCost}
          currency={productCostCurrency}
          onAmountChange={onProductCostChange}
          onCurrencyChange={onProductCostCurrencyChange}
        />
        <MoneyField
          label="Frete"
          amount={shipping}
          currency={shippingCurrency}
          onAmountChange={onShippingChange}
          onCurrencyChange={onShippingCurrencyChange}
        />
        <NumberField label="Markup" value={markup} onChange={onMarkupChange} prefix="" suffix="x" />
      </div>
    </Card>
  );
}
