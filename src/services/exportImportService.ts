import type { AurenStorageSchema, CurrencyCode, Profile } from '@/types';
import { STORAGE_VERSION } from '@/constants/storageKeys';
import { CURRENCIES, DEFAULT_COST_CURRENCY } from '@/constants/currencies';

function isValidCurrency(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && CURRENCIES.some((c) => c.code === value);
}

function isValidProfile(value: unknown): value is Profile {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.region === 'string' &&
    typeof p.markup === 'number' &&
    typeof p.gatewayPercent === 'number' &&
    typeof p.checkoutPercent === 'number' &&
    typeof p.iofPercent === 'number' &&
    typeof p.taxPercent === 'number' &&
    typeof p.marketingPercent === 'number' &&
    typeof p.extraPercent === 'number'
  );
}

/** Fills in fxConversionPercent/reservePercent with 0 for files exported before these fields existed. */
function withFeeDefaults(raw: Record<string, unknown>): Profile {
  return {
    ...(raw as unknown as Profile),
    fxConversionPercent: typeof raw.fxConversionPercent === 'number' ? raw.fxConversionPercent : 0,
    reservePercent: typeof raw.reservePercent === 'number' ? raw.reservePercent : 0,
  };
}

export function exportStateToFile(state: AurenStorageSchema): void {
  const payload = { ...state, version: STORAGE_VERSION };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `auren-price-calculator-${Date.now()}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

export class ImportValidationError extends Error {}

export async function parseImportedFile(file: File): Promise<AurenStorageSchema> {
  const text = await file.text();
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ImportValidationError('Arquivo não é um JSON válido.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new ImportValidationError('Estrutura do arquivo inválida.');
  }

  const data = parsed as Record<string, unknown>;
  if (!Array.isArray(data.profiles) || !data.profiles.every(isValidProfile)) {
    throw new ImportValidationError('Perfis inválidos no arquivo importado.');
  }

  const profiles = (data.profiles as unknown as Record<string, unknown>[]).map(withFeeDefaults);
  const activeProfileId =
    typeof data.activeProfileId === 'string' &&
    profiles.some((p) => p.id === data.activeProfileId)
      ? data.activeProfileId
      : profiles[0].id;

  return {
    profiles,
    activeProfileId,
    lastProductCost: typeof data.lastProductCost === 'number' ? data.lastProductCost : 0,
    lastShipping: typeof data.lastShipping === 'number' ? data.lastShipping : 0,
    lastProductCostCurrency: isValidCurrency(data.lastProductCostCurrency)
      ? data.lastProductCostCurrency
      : DEFAULT_COST_CURRENCY,
    lastShippingCurrency: isValidCurrency(data.lastShippingCurrency)
      ? data.lastShippingCurrency
      : DEFAULT_COST_CURRENCY,
    lastGatewayFixedFee: typeof data.lastGatewayFixedFee === 'number' ? data.lastGatewayFixedFee : 0,
    lastGatewayFixedFeeCurrency: isValidCurrency(data.lastGatewayFixedFeeCurrency)
      ? data.lastGatewayFixedFeeCurrency
      : DEFAULT_COST_CURRENCY,
    version: STORAGE_VERSION,
  };
}
