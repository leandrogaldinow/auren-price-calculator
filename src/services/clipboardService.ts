import type { CalculatorResults, CurrencyCode } from '@/types';
import { formatCurrency, formatMultiplier, formatPercent } from '@/utils/format';

export function buildResultsSummary(
  results: CalculatorResults,
  markup: number,
  currency: CurrencyCode,
): string {
  return [
    'Auren Price Calculator — Resultado',
    `Preço de Venda: ${formatCurrency(results.sellingPrice, currency)}`,
    `Produto + Frete: ${formatCurrency(results.productPlusShipping, currency)}`,
    `Markup: ${formatMultiplier(markup)}`,
    `Custos Financeiros: ${formatCurrency(results.financialCosts, currency)}`,
    `Marketing: ${formatCurrency(results.marketingFee, currency)}`,
    `Taxas Totais: ${formatCurrency(results.totalFees, currency)}`,
    `Lucro Líquido: ${formatCurrency(results.netProfit, currency)}`,
    `Margem: ${formatPercent(results.marginPercent)}`,
    `ROI: ${formatPercent(results.roi)}`,
    `Break Even ROAS: ${results.breakEvenRoas.toFixed(2)}x`,
    `CPA Máximo: ${formatCurrency(results.maxCpa, currency)}`,
    `CPA Ideal: ${formatCurrency(results.idealCpa, currency)}`,
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
