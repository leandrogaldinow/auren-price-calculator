import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ResetIcon } from '@/components/icons';
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

/** Compact, always-visible "Cotação" panel — cache-backed, never fetches on its own. */
export function ExchangeRateCard() {
  const { rates, lastUpdate, isLoading, error, refresh } = useCurrencyContext();
  const hasRates = rates.length > 0;

  return (
    <Card className="animate-fadeIn">
      <div className="mb-2 flex items-center justify-between">
        <CardTitle>Cotação</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => void refresh()} disabled={isLoading}>
          <ResetIcon width={14} height={14} className={isLoading ? 'animate-spin' : ''} />
          Atualizar Cotação
        </Button>
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

      {hasRates && (
        <>
          <div className="grid grid-cols-3 gap-2">
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
