import { useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

/** Hover/focus-triggered tooltip. `children` should be a focusable element for keyboard access. */
export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="animate-fadeIn pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-48 -translate-x-1/2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-normal normal-case text-text shadow-elevated"
        >
          {content}
        </span>
      )}
    </span>
  );
}
