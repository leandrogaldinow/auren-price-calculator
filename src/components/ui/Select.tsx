import type { SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from '@/components/icons';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: SelectOption[];
}

export function Select({ options, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-8 text-sm text-text outline-none transition-colors duration-150 focus:border-primary"
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
    </div>
  );
}
