interface ResultRowProps {
  label: string;
  value: string;
  emphasis?: boolean;
  valueClassName?: string;
}

export function ResultRow({ label, value, emphasis = false, valueClassName = '' }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-sm ${emphasis ? 'text-text' : 'text-text-secondary'}`}>{label}</span>
      <span
        className={`font-semibold ${emphasis ? 'text-base' : 'text-sm'} ${valueClassName || 'text-text'}`}
      >
        {value}
      </span>
    </div>
  );
}
