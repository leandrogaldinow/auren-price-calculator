import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:scale-[0.98] shadow-card',
  secondary:
    'bg-surface text-text border border-border hover:border-primary/50 hover:bg-white/[0.03] active:scale-[0.98]',
  ghost: 'text-text-secondary hover:text-text hover:bg-white/[0.04] active:scale-[0.98]',
  danger:
    'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 active:scale-[0.98]',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-3.5 py-2 gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
