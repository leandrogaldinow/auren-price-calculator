import { Card, CardTitle } from '@/components/ui/Card';
import { NumberField } from '@/components/ui/NumberField';

interface CostFormProps {
  productCost: number;
  shipping: number;
  markup: number;
  onProductCostChange: (value: number) => void;
  onShippingChange: (value: number) => void;
  onMarkupChange: (value: number) => void;
}

export function CostForm({
  productCost,
  shipping,
  markup,
  onProductCostChange,
  onShippingChange,
  onMarkupChange,
}: CostFormProps) {
  return (
    <Card className="animate-fadeIn">
      <CardTitle className="mb-3">Custos do Produto</CardTitle>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Produto" value={productCost} onChange={onProductCostChange} />
        <NumberField label="Frete" value={shipping} onChange={onShippingChange} />
        <div className="col-span-2">
          <NumberField label="Markup" value={markup} onChange={onMarkupChange} prefix="" suffix="x" />
        </div>
      </div>
    </Card>
  );
}
