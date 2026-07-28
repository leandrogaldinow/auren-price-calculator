import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { ResetIcon, ChevronDownIcon } from '@/components/icons';
import { useCurrencyContext } from '@/context/CurrencyContext';
import { formatDateTime, formatNumber } from '@/utils/format';
import type { CurrencyCode, ExchangeRate } from '@/types';

function findRate(rates: ExchangeRate[], from: CurrencyCode, to: CurrencyCode): number | undefined {
  return rates.find((r) => r.from === from && r.to === to)?.rate;
}

function formatRate(rate: number | undefined): string {
  if (rate === undefined) return '—';
  return formatNumber(rate, rate < 1 ? 3 : 2);
}

function RateItem({ label, rate }: { label: string; rate: number | undefined }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-background px-2 py-1.5">
      <span className="text-[10px] text-text-secondary">{label}</span>
      <span className="text-sm font-semibold text-text">{formatRate(rate)}</span>
    </div>
  );
}

/**
 * Compact, always-visible "Cotação" panel — starts collapsed (accordion), and
 * "Atualizar Cotação" lives in the header so refreshing works collapsed too.
 */
export function ExchangeRateCard() {
  const { rates, lastUpdate, isLoading, error, refresh, isRatePanelExpanded, setRatePanelExpanded } =
    useCurrencyContext();
  const hasRates = rates.length > 0;

  return (
    <Card className="animate-fadeIn">
      <div className="flex items-center justify-between">
        <CardTitle>Cotação</CardTitle>
        <div className="flex items-center gap-0.5">
          <IconButton
            label="Atualizar Cotação"
            icon={<ResetIcon width={14} height={14} className={isLoading ? 'animate-spin' : ''} />}
            onClick={() => void refresh()}
            disabled={isLoading}
          />
          <IconButton
            label={isRatePanelExpanded ? 'Recolher Cotação' : 'Expandir Cotação'}
            aria-expanded={isRatePanelExpanded}
            icon={
              <ChevronDownIcon
                width={14}
                height={14}
                className={`transition-transform duration-150 ${isRatePanelExpanded ? 'rotate-180' : ''}`}
              />
            }
            onClick={() => setRatePanelExpanded(!isRatePanelExpanded)}
          />
        </div>
      </div>

      {!hasRates && isLoading && (
        <div className="flex justify-center py-3">
          <Spinner size={20} />
        </div>
      )}

      {!hasRates && !isLoading && error && (
        <div className="flex flex-col items-start gap-2 py-1">
          <p className="text-xs text-danger">{error}</p>
          <Button variant="secondary" size="sm" onClick={() => void refresh()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {hasRates && isRatePanelExpanded && (
        <>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <RateItem label="USD → BRL" rate={findRate(rates, 'USD', 'BRL')} />
            <RateItem label="MXN → BRL" rate={findRate(rates, 'MXN', 'BRL')} />
            <RateItem label="USD → MXN" rate={findRate(rates, 'USD', 'MXN')} />
          </div>
          {lastUpdate && (
            <p className="mt-2 text-center text-[11px] text-text-secondary">
              Última atualização: {formatDateTime(lastUpdate)}
            </p>
          )}
        </>
      )}
    </Card>
  );
}
