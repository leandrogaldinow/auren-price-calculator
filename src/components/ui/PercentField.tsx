import { useEffect, useState, type ChangeEvent } from 'react';
import { formatNumber } from '@/utils/format';
import { parseLocaleNumber, sanitizeNumericInput } from '@/utils/numberInput';
import { clampPercent } from '@/utils/clamp';

interface PercentFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/** Percentage input clamped to 0–100, one decimal place, comma-friendly. */
export function PercentField({ label, value, onChange }: PercentFieldProps) {
  const [raw, setRaw] = useState(() => formatNumber(value, 1));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(formatNumber(value, 1));
  }, [value, focused]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumericInput(event.target.value);
    setRaw(sanitized);
    onChange(clampPercent(parseLocaleNumber(sanitized)));
  };

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <div className="flex items-center rounded-lg border border-border bg-background px-3 transition-colors duration-150 focus-within:border-primary">
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          placeholder="0,0"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          className="w-full bg-transparent py-2 text-sm text-text outline-none placeholder:text-text-secondary/50"
        />
        <span className="ml-1.5 text-sm text-text-secondary">%</span>
      </div>
    </label>
  );
}
