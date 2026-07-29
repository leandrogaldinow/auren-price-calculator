import type { UiPrefsSchema } from '@/types';
import { storageGet, storageSet } from './chromeStorage';
import { UI_PREFS_STORAGE_KEY } from '@/constants/storageKeys';
import { withCostSettingsDefaults, defaultCostSettings } from '@/services/costSettingsService';

export async function loadUiPrefs(): Promise<UiPrefsSchema> {
  const stored = await storageGet<Partial<UiPrefsSchema>>(UI_PREFS_STORAGE_KEY);
  return {
    feesAccordionExpanded: stored?.feesAccordionExpanded ?? false,
    costSettings: stored?.costSettings ? withCostSettingsDefaults(stored.costSettings) : defaultCostSettings(),
  };
}

export async function saveUiPrefs(prefs: UiPrefsSchema): Promise<void> {
  await storageSet(UI_PREFS_STORAGE_KEY, prefs);
}
