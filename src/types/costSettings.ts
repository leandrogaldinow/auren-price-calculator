/** Every fee/cost key that participates in pricing, including gatewayFixedFee (flat, not %). */
export type CostKey =
  | 'gatewayPercent'
  | 'gatewayFixedFee'
  | 'checkoutPercent'
  | 'iofPercent'
  | 'marketingPercent'
  | 'taxPercent'
  | 'fxConversionPercent'
  | 'extraPercent'
  | 'reservePercent';

export interface CostSettings {
  enabled: Record<CostKey, boolean>;
  visible: Record<CostKey, boolean>;
}
