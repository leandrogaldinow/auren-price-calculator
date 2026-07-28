import type { ReactNode } from 'react';
import { Header } from './Header';
import { Tabs } from '@/components/ui/Tabs';

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
      <div className="px-4 pt-3">
        <Tabs tabs={tabs} activeId={activeTabId} onChange={onTabChange} />
      </div>
      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
    </div>
  );
}
