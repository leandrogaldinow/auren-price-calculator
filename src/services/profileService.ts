import type { Profile, ProfileFees } from '@/types';
import { generateId } from '@/utils/id';
import { createDefaultProfiles } from '@/constants/defaultProfiles';
import { COST_REGISTRY } from '@/constants/costRegistry';

const REGISTRY_PERCENT_DEFAULTS = Object.fromEntries(
  COST_REGISTRY.filter((c) => c.type === 'percent').map((c) => [c.id, c.defaultValue]),
) as Omit<ProfileFees, 'markup'>;

const EMPTY_FEES: ProfileFees = { markup: 2.5, ...REGISTRY_PERCENT_DEFAULTS };

export function buildNewProfile(name: string, fees: ProfileFees): Profile {
  const now = Date.now();
  return {
    id: generateId('profile'),
    name,
    region: 'custom',
    ...fees,
    createdAt: now,
    updatedAt: now,
  };
}

export function buildDuplicateProfile(source: Profile): Profile {
  const now = Date.now();
  return {
    ...source,
    id: generateId('profile'),
    name: `${source.name} (cópia)`,
    region: 'custom',
    createdAt: now,
    updatedAt: now,
  };
}

export function applyProfileFees(profile: Profile, fees: ProfileFees): Profile {
  return { ...profile, ...fees, updatedAt: Date.now() };
}

/** Restores a preset profile to its original values, or a custom profile to blank defaults. */
export function resetProfileFees(profile: Profile): Profile {
  if (profile.region !== 'custom') {
    const preset = createDefaultProfiles().find((p) => p.region === profile.region);
    if (preset) return { ...profile, ...preset, id: profile.id, name: profile.name };
  }
  return { ...profile, ...EMPTY_FEES, updatedAt: Date.now() };
}
