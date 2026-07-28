import { Card, CardTitle } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { ResultRow } from '@/components/calculator/ResultRow';
import type { CurrencyCode, SmartMarkupScenario } from '@/types';
import { formatCurrency, formatMultiplier, formatPercent } from '@/utils/format';

interface ScenarioCardProps {
  title: string;
  scenario: SmartMarkupScenario | null;
  emptyHint: string;
  currency: CurrencyCode;
}

function ScenarioCard({ title, scenario, emptyHint, currency }: ScenarioCardProps) {
  return (
    <Card hoverable className="animate-fadeIn">
      <CardTitle className="mb-2">{title}</CardTitle>
      {!scenario ? (
        <p className="py-2 text-sm text-text-secondary">{emptyHint}</p>
      ) : (
        <>
          <p className="mb-2 text-2xl font-bold tracking-tight text-primary">
            {formatCurrency(scenario.idealPrice, currency)}
          </p>
          <Divider className="mb-2" />
          <ResultRow label="Markup Ideal" value={formatMultiplier(scenario.idealMarkup)} />
          <ResultRow label="Margem Alcançada" value={formatPercent(scenario.achievedMarginPercent)} />
          <ResultRow label="CPA Máximo" value={formatCurrency(scenario.maxCpa, currency)} />
          <ResultRow label="Break Even ROAS" value={formatMultiplier(scenario.breakEvenRoas)} />
        </>
      )}
    </Card>
  );
}

interface SmartMarkupResultsProps {
  byProfit: SmartMarkupScenario | null;
  byMargin: SmartMarkupScenario | null;
  currency: CurrencyCode;
}

export function SmartMarkupResults({ byProfit, byMargin, currency }: SmartMarkupResultsProps) {
  return (
    <div className="flex flex-col gap-3">
      <ScenarioCard
        title="Baseado em Lucro Desejado"
        scenario={byProfit}
        emptyHint="Informe produto, frete e lucro desejado para calcular."
        currency={currency}
      />
      <ScenarioCard
        title="Baseado em Margem Desejada"
        scenario={byMargin}
        emptyHint="Informe produto, frete e margem desejada para calcular."
        currency={currency}
      />
    </div>
  );
}
