/** A saved fee/markup configuration a user switches between (e.g. per country). */
export interface Profile {
  id: string;
  name: string;
  /** Preset region this profile was created from, or 'custom' for user-created ones. */
  region: RegionKey;
  markup: number;
  gatewayPercent: number;
  checkoutPercent: number;
  iofPercent: number;
  taxPercent: number;
  marketingPercent: number;
  /** Displayed as "Despesas Operacionais" in the UI. */
  extraPercent: number;
  /** Displayed as "Conversão Cambial" in the UI. */
  fxConversionPercent: number;
  /** Reserve for chargebacks/refunds/losses. */
  reservePercent: number;
  createdAt: number;
  updatedAt: number;
}

export type RegionKey = 'brasil' | 'mexico' | 'eua' | 'europa' | 'custom';

/** Fee fields copyable between profiles / used to seed a new profile. */
export type ProfileFees = Pick<
  Profile,
  | 'markup'
  | 'gatewayPercent'
  | 'checkoutPercent'
  | 'iofPercent'
  | 'taxPercent'
  | 'marketingPercent'
  | 'extraPercent'
  | 'fxConversionPercent'
  | 'reservePercent'
>;
