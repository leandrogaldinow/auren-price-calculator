import type { Profile } from './profile';
import type { CalculatorInputs } from './calculator';

/** Shape persisted in chrome.storage.local under a single root key. */
export interface AurenStorageSchema {
  profiles: Profile[];
  activeProfileId: string;
  lastProductCost: number;
  lastShipping: number;
  version: number;
}

export type PersistableCalculatorState = Pick<CalculatorInputs, 'productCost' | 'shipping'>;
