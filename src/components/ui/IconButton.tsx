import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
}

export function IconButton({ label, icon, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-all duration-150 hover:bg-white/[0.06] hover:text-text active:scale-[0.94] disabled:opacity-40 disabled:pointer-events-none ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
