import type { CostSettings } from './costSettings';

/** Device-local UI preferences — persisted separately from AurenStorageSchema, excluded from export/import. */
export interface UiPrefsSchema {
  feesAccordionExpanded: boolean;
  costSettings: CostSettings;
}
