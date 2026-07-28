import type { Profile, RegionKey } from '@/types';

/** Seed fee presets. Values are realistic starting points for each market and are fully editable. */
const REGION_PRESETS: Record<Exclude<RegionKey, 'custom'>, { name: string } & Omit<
  Profile,
  'id' | 'name' | 'region' | 'createdAt' | 'updatedAt'
>> = {
  brasil: {
    name: 'Brasil',
    markup: 2.5,
    gatewayPercent: 4.99,
    checkoutPercent: 2.0,
    iofPercent: 0,
    taxPercent: 6.0,
    marketingPercent: 15.0,
    extraPercent: 2.0,
  },
  mexico: {
    name: 'México',
    markup: 2.5,
    gatewayPercent: 4.5,
    checkoutPercent: 2.0,
    iofPercent: 0,
    taxPercent: 4.0,
    marketingPercent: 15.0,
    extraPercent: 2.0,
  },
  eua: {
    name: 'Estados Unidos',
    markup: 3.0,
    gatewayPercent: 3.49,
    checkoutPercent: 1.5,
    iofPercent: 6.38,
    taxPercent: 0,
    marketingPercent: 18.0,
    extraPercent: 2.0,
  },
  europa: {
    name: 'Europa',
    markup: 3.0,
    gatewayPercent: 3.4,
    checkoutPercent: 1.8,
    iofPercent: 6.38,
    taxPercent: 0,
    marketingPercent: 18.0,
    extraPercent: 2.0,
  },
};

export function createDefaultProfiles(): Profile[] {
  const now = Date.now();
  return (Object.keys(REGION_PRESETS) as Array<Exclude<RegionKey, 'custom'>>).map((region) => {
    const preset = REGION_PRESETS[region];
    return {
      id: `preset-${region}`,
      name: preset.name,
      region,
      markup: preset.markup,
      gatewayPercent: preset.gatewayPercent,
      checkoutPercent: preset.checkoutPercent,
      iofPercent: preset.iofPercent,
      taxPercent: preset.taxPercent,
      marketingPercent: preset.marketingPercent,
      extraPercent: preset.extraPercent,
      createdAt: now,
      updatedAt: now,
    };
  });
}
