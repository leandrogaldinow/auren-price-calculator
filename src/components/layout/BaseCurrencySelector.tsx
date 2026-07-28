import { Select } from '@/components/ui/Select';
import { useCurrencyContext } from '@/context/CurrencyContext';
import { CURRENCIES } from '@/constants/currencies';
import type { CurrencyCode } from '@/types';

const OPTIONS = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: `${currency.flag} ${currency.code}`,
}));

/** Global "Moeda Base" control — all results across every tab display in this currency. */
export function BaseCurrencySelector() {
  const { baseCurrency, setBaseCurrency } = useCurrencyContext();

  return (
    <label className="flex items-center gap-2">
      <span className="whitespace-nowrap text-xs font-medium text-text-secondary">Moeda Base</span>
      <div className="w-[104px]">
        <Select
          value={baseCurrency}
          onChange={(event) => setBaseCurrency(event.target.value as CurrencyCode)}
          options={OPTIONS}
          aria-label="Moeda Base"
        />
      </div>
    </label>
  );
}
