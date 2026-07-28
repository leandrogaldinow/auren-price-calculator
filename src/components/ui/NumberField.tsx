import { useEffect, useState, type ChangeEvent } from 'react';
import { formatNumber } from '@/utils/format';
import { parseLocaleNumber, sanitizeNumericInput } from '@/utils/numberInput';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  decimals?: number;
}

/** Monetary/numeric input: rejects letters, accepts comma as decimal separator, formats on blur. */
export function NumberField({
  label,
  value,
  onChange,
  prefix = 'R$',
  suffix,
  placeholder = '0,00',
  decimals = 2,
}: NumberFieldProps) {
  const [raw, setRaw] = useState(() => formatNumber(value, decimals));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(formatNumber(value, decimals));
  }, [value, focused, decimals]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumericInput(event.target.value);
    setRaw(sanitized);
    onChange(parseLocaleNumber(sanitized));
  };

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <div className="flex items-center rounded-lg border border-border bg-background px-3 transition-colors duration-150 focus-within:border-primary">
        {prefix && <span className="mr-1.5 text-sm text-text-secondary">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          className="w-full bg-transparent py-2 text-sm text-text outline-none placeholder:text-text-secondary/50"
        />
        {suffix && <span className="ml-1.5 text-sm text-text-secondary">{suffix}</span>}
      </div>
    </label>
  );
}
