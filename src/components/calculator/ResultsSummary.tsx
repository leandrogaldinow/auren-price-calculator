import { Card, CardTitle } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { ResultRow } from './ResultRow';
import { MarginBadge } from './MarginBadge';
import type { CalculatorResults } from '@/types';
import { formatCurrency, formatMultiplier, formatPercent } from '@/utils/format';

export function ResultsSummary({ results }: { results: CalculatorResults }) {
  const profitColor = results.netProfit >= 0 ? 'text-success' : 'text-danger';

  return (
    <Card hoverable className="animate-fadeIn">
      <div className="mb-1 flex items-center justify-between">
        <CardTitle>Preço de Venda</CardTitle>
        <MarginBadge marginPercent={results.marginPercent} />
      </div>
      <p className="mb-3 text-3xl font-bold tracking-tight text-primary">
        {formatCurrency(results.sellingPrice)}
      </p>

      <Divider className="mb-2" />

      <ResultRow label="Produto + Frete" value={formatCurrency(results.productPlusShipping)} />
      <ResultRow label="Custos Financeiros" value={formatCurrency(results.financialCosts)} />
      <ResultRow label="Marketing" value={formatCurrency(results.marketingFee)} />
      <ResultRow label="Taxas Totais" value={formatCurrency(results.totalFees)} />

      <Divider className="my-2" />

      <ResultRow
        label="Lucro Líquido"
        value={formatCurrency(results.netProfit)}
        emphasis
        valueClassName={profitColor}
      />
      <ResultRow label="Margem" value={formatPercent(results.marginPercent)} valueClassName={profitColor} />
      <ResultRow label="ROI" value={formatPercent(results.roi)} />
      <ResultRow label="Break Even ROAS" value={formatMultiplier(results.breakEvenRoas)} />
      <ResultRow label="CPA Máximo" value={formatCurrency(results.maxCpa)} />
      <ResultRow label="CPA Ideal" value={formatCurrency(results.idealCpa)} />
    </Card>
  );
}
