const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return currencyFormatter.format(0);
  return currencyFormatter.format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return `${percentFormatter.format(0)}%`;
  return `${percentFormatter.format(value)}%`;
}

export function formatNumber(value: number, fractionDigits = 2): string {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toFixed(fractionDigits).replace('.', ',');
}

export function formatMultiplier(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(2).replace('.', ',')}x`;
}
