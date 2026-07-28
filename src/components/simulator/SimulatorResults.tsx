import { Card, CardTitle } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { ResultRow } from '@/components/calculator/ResultRow';
import type { SimulatorResults as SimulatorResultsType } from '@/types';
import { formatCurrency, formatMultiplier, formatNumber, formatPercent } from '@/utils/format';

export function SimulatorResults({ results }: { results: SimulatorResultsType }) {
  const profitColor = results.profit >= 0 ? 'text-success' : 'text-danger';

  return (
    <Card hoverable className="animate-fadeIn">
      <CardTitle className="mb-1">Pedidos Projetados</CardTitle>
      <p className="mb-3 text-3xl font-bold tracking-tight text-primary">
        {formatNumber(results.orders, 0)}
      </p>

      <Divider className="mb-2" />

      <ResultRow label="Investimento Total" value={formatCurrency(results.totalInvestment)} />
      <ResultRow label="Pedidos / dia" value={formatNumber(results.ordersPerDay, 1)} />
      <ResultRow label="Faturamento" value={formatCurrency(results.revenue)} />

      <Divider className="my-2" />

      <ResultRow label="Lucro" value={formatCurrency(results.profit)} emphasis valueClassName={profitColor} />
      <ResultRow label="ROI" value={formatPercent(results.roi)} valueClassName={profitColor} />
      <ResultRow label="ROAS" value={formatMultiplier(results.roas)} />
    </Card>
  );
}
