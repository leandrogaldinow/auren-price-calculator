import { Card, CardTitle } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { Select } from '@/components/ui/Select';
import { ResultRow } from './ResultRow';
import { MarginBadge } from './MarginBadge';
import type { CalculatorResults, CurrencyCode } from '@/types';
import { formatCurrency, formatMultiplier, formatPercent } from '@/utils/format';
import { useCurrencyContext } from '@/context/CurrencyContext';
import { CURRENCIES } from '@/constants/currencies';

const SELLING_PRICE_CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.code, label: `${c.flag} ${c.code}` }));

interface ResultsSummaryProps {
  results: CalculatorResults;
  /** Currency every row below the headline is shown in (the app's "Moeda Base"). */
  currency: CurrencyCode;
}

export function ResultsSummary({ results, currency }: ResultsSummaryProps) {
  const profitColor = results.netProfit >= 0 ? 'text-success' : 'text-danger';
  // Independent display-only override for the headline number — calculation stays in `currency`.
  const { sellingPriceCurrency, setSellingPriceCurrency, convert } = useCurrencyContext();
  const displayedSellingPrice = convert(results.sellingPrice, currency, sellingPriceCurrency);

  return (
    <Card hoverable className="animate-fadeIn">
      <div className="mb-1 flex items-center justify-between">
        <CardTitle>Preço de Venda</CardTitle>
        <MarginBadge marginPercent={results.marginPercent} />
      </div>
      <div className="mb-3 flex items-end justify-between gap-2">
        <p className="text-3xl font-bold tracking-tight text-primary">
          {formatCurrency(displayedSellingPrice, sellingPriceCurrency)}
        </p>
        <div className="w-[92px] shrink-0 pb-1">
          <Select
            value={sellingPriceCurrency}
            onChange={(event) => setSellingPriceCurrency(event.target.value as CurrencyCode)}
            options={SELLING_PRICE_CURRENCY_OPTIONS}
            aria-label="Moeda do Preço de Venda"
          />
        </div>
      </div>

      <Divider className="mb-2" />

      <ResultRow label="Produto + Frete" value={formatCurrency(results.productPlusShipping, currency)} />
      <ResultRow label="Custos Financeiros" value={formatCurrency(results.financialCosts, currency)} />
      <ResultRow label="Marketing" value={formatCurrency(results.marketingFee, currency)} />
      <ResultRow label="Taxas Totais" value={formatCurrency(results.totalFees, currency)} />

      <Divider className="my-2" />

      <ResultRow
        label="Lucro Líquido"
        value={formatCurrency(results.netProfit, currency)}
        emphasis
        valueClassName={profitColor}
      />
      <ResultRow label="Margem" value={formatPercent(results.marginPercent)} valueClassName={profitColor} />
      <ResultRow label="ROI" value={formatPercent(results.roi)} />
      <ResultRow label="Break Even ROAS" value={formatMultiplier(results.breakEvenRoas)} />
      <ResultRow label="CPA Máximo" value={formatCurrency(results.maxCpa, currency)} />
      <ResultRow label="CPA Ideal" value={formatCurrency(results.idealCpa, currency)} />
    </Card>
  );
}
