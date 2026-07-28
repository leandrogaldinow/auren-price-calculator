import { useState } from 'react';
import { CalculatorProvider, useCalculatorContext } from '@/context/CalculatorContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { AppShell } from '@/components/layout/AppShell';
import { Spinner } from '@/components/ui/Spinner';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { SimulatorPage } from '@/pages/SimulatorPage';
import { SmartMarkupPage } from '@/pages/SmartMarkupPage';

const TABS = [
  { id: 'calculator', label: 'Calculadora' },
  { id: 'simulator', label: 'Simulador' },
  { id: 'smartMarkup', label: 'Markup Inteligente' },
];

function AppContent() {
  const [activeTabId, setActiveTabId] = useState('calculator');
  const { isLoaded } = useCalculatorContext();

  if (!isLoaded) {
    return (
      <div className="flex h-[700px] w-[420px] items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <AppShell tabs={TABS} activeTabId={activeTabId} onTabChange={setActiveTabId}>
      {activeTabId === 'calculator' && <CalculatorPage />}
      {activeTabId === 'simulator' && <SimulatorPage />}
      {activeTabId === 'smartMarkup' && <SmartMarkupPage />}
    </AppShell>
  );
}

export function App() {
  return (
    <CurrencyProvider>
      <CalculatorProvider>
        <AppContent />
      </CalculatorProvider>
    </CurrencyProvider>
  );
}
