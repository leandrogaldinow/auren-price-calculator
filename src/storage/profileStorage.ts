import type { AurenStorageSchema } from '@/types';
import { storageGet, storageSet } from './chromeStorage';
import { STORAGE_ROOT_KEY, STORAGE_VERSION } from '@/constants/storageKeys';
import { createDefaultProfiles } from '@/constants/defaultProfiles';
import { DEFAULT_COST_CURRENCY } from '@/constants/currencies';

function buildInitialState(): AurenStorageSchema {
  const profiles = createDefaultProfiles();
  return {
    profiles,
    activeProfileId: profiles[0].id,
    lastProductCost: 0,
    lastShipping: 0,
    lastProductCostCurrency: DEFAULT_COST_CURRENCY,
    lastShippingCurrency: DEFAULT_COST_CURRENCY,
    lastGatewayFixedFee: 0,
    lastGatewayFixedFeeCurrency: DEFAULT_COST_CURRENCY,
    version: STORAGE_VERSION,
  };
}

export async function loadState(): Promise<AurenStorageSchema> {
  const stored = await storageGet<AurenStorageSchema>(STORAGE_ROOT_KEY);
  if (!stored || !stored.profiles?.length) {
    const initial = buildInitialState();
    await storageSet(STORAGE_ROOT_KEY, initial);
    return initial;
  }
  return stored;
}

export async function saveState(state: AurenStorageSchema): Promise<void> {
  await storageSet(STORAGE_ROOT_KEY, state);
}
