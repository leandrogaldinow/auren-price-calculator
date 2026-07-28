import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  colorClass?: string;
  bgClass?: string;
}

export function Badge({ children, colorClass = 'text-text-secondary', bgClass = 'bg-white/5' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${colorClass} ${bgClass}`}
    >
      {children}
    </span>
  );
}
