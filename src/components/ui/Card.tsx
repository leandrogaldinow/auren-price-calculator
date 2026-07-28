import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-4 shadow-card transition-colors duration-150 ${
        hoverable ? 'hover:border-primary/40' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`text-xs font-semibold uppercase tracking-wide text-text-secondary ${className}`}>
      {children}
    </h3>
  );
}
