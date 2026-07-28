import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CurrencyCode, ExchangeRate } from '@/types';
import { getExchangeRates } from '@/services/ExchangeRateService';
import { convertCurrency } from '@/utils/currency';
import { storageGet, storageSet } from '@/storage/chromeStorage';
import { DEFAULT_CURRENCY } from '@/constants/currencies';

const SETTINGS_KEY = 'auren_currency_settings';

/** Every persisted currency-related preference, kept in one settings object so
 *  updating one field can never clobber the others in storage. */
interface CurrencySettings {
  baseCurrency: CurrencyCode;
  /** Independent display-only override for the "Preço de Venda" headline — doesn't affect calculation. */
  sellingPriceCurrency: CurrencyCode;
  isRatePanelExpanded: boolean;
}

const DEFAULT_SETTINGS: CurrencySettings = {
  baseCurrency: DEFAULT_CURRENCY,
  sellingPriceCurrency: DEFAULT_CURRENCY,
  isRatePanelExpanded: false,
};

interface CurrencyContextValue {
  baseCurrency: CurrencyCode;
  setBaseCurrency: (currency: CurrencyCode) => void;
  sellingPriceCurrency: CurrencyCode;
  setSellingPriceCurrency: (currency: CurrencyCode) => void;
  isRatePanelExpanded: boolean;
  setRatePanelExpanded: (expanded: boolean) => void;
  rates: ExchangeRate[];
  lastUpdate: number | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  convert: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CurrencySettings>(DEFAULT_SETTINGS);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persistSettings = useCallback((partial: Partial<CurrencySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      void storageSet(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  const load = useCallback(async (force: boolean) => {
    setIsLoading(true);
    const { cache, error: fetchError } = await getExchangeRates({ force });
    if (cache) {
      setRates(cache.exchangeRates);
      setLastUpdate(cache.lastUpdate);
    }
    setError(fetchError);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    storageGet<CurrencySettings>(SETTINGS_KEY).then((stored) => {
      if (stored) setSettings((prev) => ({ ...prev, ...stored }));
    });
    void load(false);
  }, [load]);

  const setBaseCurrency = useCallback(
    (currency: CurrencyCode) => persistSettings({ baseCurrency: currency }),
    [persistSettings],
  );

  const setSellingPriceCurrency = useCallback(
    (currency: CurrencyCode) => persistSettings({ sellingPriceCurrency: currency }),
    [persistSettings],
  );

  const setRatePanelExpanded = useCallback(
    (expanded: boolean) => persistSettings({ isRatePanelExpanded: expanded }),
    [persistSettings],
  );

  const refresh = useCallback(() => load(true), [load]);

  const convert = useCallback(
    (amount: number, from: CurrencyCode, to: CurrencyCode) => convertCurrency(amount, from, to, rates),
    [rates],
  );

  const value: CurrencyContextValue = useMemo(
    () => ({
      baseCurrency: settings.baseCurrency,
      setBaseCurrency,
      sellingPriceCurrency: settings.sellingPriceCurrency,
      setSellingPriceCurrency,
      isRatePanelExpanded: settings.isRatePanelExpanded,
      setRatePanelExpanded,
      rates,
      lastUpdate,
      isLoading,
      error,
      refresh,
      convert,
    }),
    [
      settings,
      setBaseCurrency,
      setSellingPriceCurrency,
      setRatePanelExpanded,
      rates,
      lastUpdate,
      isLoading,
      error,
      refresh,
      convert,
    ],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its provider by design
export function useCurrencyContext(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrencyContext must be used within CurrencyProvider');
  return ctx;
}
