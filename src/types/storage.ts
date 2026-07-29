import type { Profile } from './profile';
import type { CalculatorInputs } from './calculator';
import type { CurrencyCode } from './currency';

/** Shape persisted in chrome.storage.local under a single root key. */
export interface AurenStorageSchema {
  profiles: Profile[];
  activeProfileId: string;
  lastProductCost: number;
  lastShipping: number;
  /** Optional for backward compat — state saved before multi-currency support won't have these. */
  lastProductCostCurrency?: CurrencyCode;
  lastShippingCurrency?: CurrencyCode;
  /** Flat "Taxa Fixa do Gateway" fee — lives outside profiles, same reasoning as Produto/Frete. */
  lastGatewayFixedFee?: number;
  lastGatewayFixedFeeCurrency?: CurrencyCode;
  version: number;
}

export type PersistableCalculatorState = Pick<CalculatorInputs, 'productCost' | 'shipping'>;
