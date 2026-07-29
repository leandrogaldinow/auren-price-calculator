import type { ReactNode } from 'react';
import { CardTitle } from '@/components/ui/Card';
import { ChevronDownIcon } from '@/components/icons';

interface AccordionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  headerExtra?: ReactNode;
  /** Rendered next to the title only while collapsed — e.g. a summary of the section's content. */
  subtitle?: ReactNode;
  children: ReactNode;
}

export function Accordion({ title, expanded, onToggle, headerExtra, subtitle, children }: AccordionProps) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card transition-colors duration-150">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <ChevronDownIcon
            className={`shrink-0 text-text-secondary transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
          />
          <CardTitle>{title}</CardTitle>
          {!expanded && subtitle}
        </button>
        {headerExtra}
      </div>
      {expanded && <div className="animate-fadeIn px-4 pb-4">{children}</div>}
    </div>
  );
}
