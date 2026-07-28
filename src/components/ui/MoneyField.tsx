import type { CurrencyCode } from '@/types';
import { CURRENCIES } from '@/constants/currencies';
import { NumberField } from './NumberField';
import { Select } from './Select';

const CURRENCY_OPTIONS = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: `${currency.flag} ${currency.code}`,
}));

interface MoneyFieldProps {
  label: string;
  amount: number;
  currency: CurrencyCode;
  onAmountChange: (value: number) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  placeholder?: string;
}

/** Monetary field: a currency selector paired with a numeric amount input. */
export function MoneyField({
  label,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  placeholder,
}: MoneyFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <div className="flex items-start gap-1.5">
        <div className="w-[92px] shrink-0">
          <Select
            value={currency}
            onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
            options={CURRENCY_OPTIONS}
            aria-label={`Moeda de ${label}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <NumberField value={amount} onChange={onAmountChange} prefix="" placeholder={placeholder} />
        </div>
      </div>
    </div>
  );
}
