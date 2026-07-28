import { CalculatorIcon } from '@/components/icons';

export function Header() {
  return (
    <header className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <CalculatorIcon width={18} height={18} />
      </div>
      <div>
        <h1 className="text-sm font-bold leading-tight text-text">Auren Price Calculator</h1>
        <p className="text-[11px] leading-tight text-text-secondary">Precificação para Dropshipping</p>
      </div>
    </header>
  );
}
