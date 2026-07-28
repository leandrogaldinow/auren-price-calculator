import type { CalculatorResults } from '@/types';
import { formatCurrency, formatMultiplier, formatPercent } from '@/utils/format';

export function buildResultsSummary(results: CalculatorResults, markup: number): string {
  return [
    'Auren Price Calculator — Resultado',
    `Preço de Venda: ${formatCurrency(results.sellingPrice)}`,
    `Produto + Frete: ${formatCurrency(results.productPlusShipping)}`,
    `Markup: ${formatMultiplier(markup)}`,
    `Custos Financeiros: ${formatCurrency(results.financialCosts)}`,
    `Marketing: ${formatCurrency(results.marketingFee)}`,
    `Taxas Totais: ${formatCurrency(results.totalFees)}`,
    `Lucro Líquido: ${formatCurrency(results.netProfit)}`,
    `Margem: ${formatPercent(results.marginPercent)}`,
    `ROI: ${formatPercent(results.roi)}`,
    `Break Even ROAS: ${results.breakEvenRoas.toFixed(2)}x`,
    `CPA Máximo: ${formatCurrency(results.maxCpa)}`,
    `CPA Ideal: ${formatCurrency(results.idealCpa)}`,
  ].join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
