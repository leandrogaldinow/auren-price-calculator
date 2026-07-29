import { CheckIcon } from '@/components/icons';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onChange, disabled = false }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
          checked ? 'border-primary bg-primary' : 'border-border bg-background'
        }`}
      >
        {checked && <CheckIcon width={11} height={11} className="text-white" />}
      </span>
      <span className="text-sm text-text">{label}</span>
    </label>
  );
}
