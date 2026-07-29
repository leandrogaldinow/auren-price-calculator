import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CostKey, CostSettings, UiPrefsSchema } from '@/types';
import { loadUiPrefs, saveUiPrefs } from '@/storage/uiPrefsStorage';
import { defaultCostSettings } from '@/services/costSettingsService';

interface CostSettingsContextValue {
  isLoaded: boolean;
  costSettings: CostSettings;
  feesAccordionExpanded: boolean;
  toggleFeesAccordion: () => void;
  toggleCostEnabled: (key: CostKey) => void;
  toggleCostVisible: (key: CostKey) => void;
}

const CostSettingsContext = createContext<CostSettingsContextValue | null>(null);

/**
 * Owns cost enabled/visible preferences and the fees-accordion open state — independent of
 * profiles/CalculatorContext so any future page can reuse it without pulling in profile logic.
 */
export function CostSettingsProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [costSettings, setCostSettingsState] = useState<CostSettings>(defaultCostSettings());
  const [feesAccordionExpanded, setFeesAccordionExpandedState] = useState(false);

  useEffect(() => {
    loadUiPrefs().then((prefs) => {
      setCostSettingsState(prefs.costSettings);
      setFeesAccordionExpandedState(prefs.feesAccordionExpanded);
      setIsLoaded(true);
    });
  }, []);

  const persistUiPrefs = useCallback(
    (next: Partial<UiPrefsSchema>) => {
      void saveUiPrefs({
        feesAccordionExpanded: next.feesAccordionExpanded ?? feesAccordionExpanded,
        costSettings: next.costSettings ?? costSettings,
      });
    },
    [feesAccordionExpanded, costSettings],
  );

  const toggleFeesAccordion = useCallback(() => {
    setFeesAccordionExpandedState((prev) => {
      const next = !prev;
      persistUiPrefs({ feesAccordionExpanded: next });
      return next;
    });
  }, [persistUiPrefs]);

  const toggleCostEnabled = useCallback(
    (key: CostKey) => {
      setCostSettingsState((prev) => {
        const next: CostSettings = { ...prev, enabled: { ...prev.enabled, [key]: !prev.enabled[key] } };
        persistUiPrefs({ costSettings: next });
        return next;
      });
    },
    [persistUiPrefs],
  );

  const toggleCostVisible = useCallback(
    (key: CostKey) => {
      setCostSettingsState((prev) => {
        const next: CostSettings = { ...prev, visible: { ...prev.visible, [key]: !prev.visible[key] } };
        persistUiPrefs({ costSettings: next });
        return next;
      });
    },
    [persistUiPrefs],
  );

  const value: CostSettingsContextValue = {
    isLoaded,
    costSettings,
    feesAccordionExpanded,
    toggleFeesAccordion,
    toggleCostEnabled,
    toggleCostVisible,
  };

  return <CostSettingsContext.Provider value={value}>{children}</CostSettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its provider by design
export function useCostSettingsContext(): CostSettingsContextValue {
  const ctx = useContext(CostSettingsContext);
  if (!ctx) throw new Error('useCostSettingsContext must be used within CostSettingsProvider');
  return ctx;
}
