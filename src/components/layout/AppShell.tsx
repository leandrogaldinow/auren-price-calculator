import type { ReactNode } from 'react';
import { Header } from './Header';
import { BaseCurrencySelector } from './BaseCurrencySelector';
import { Tabs } from '@/components/ui/Tabs';
import { ExchangeRateCard } from '@/components/currency/ExchangeRateCard';

interface AppShellProps {
  tabs: { id: string; label: string }[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
}

export function AppShell({ tabs, activeTabId, onTabChange, children }: AppShellProps) {
  return (
    <div className="flex h-[700px] w-[420px] flex-col bg-background text-text">
      <Header />
      <div className="flex flex-col gap-2 px-4 pt-3">
        <div className="flex justify-end">
          <BaseCurrencySelector />
        </div>
        <ExchangeRateCard />
        <Tabs tabs={tabs} activeId={activeTabId} onChange={onTabChange} />
      </div>
      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
    </div>
  );
}
