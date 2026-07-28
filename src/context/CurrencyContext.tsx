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

interface CurrencySettings {
  baseCurrency: CurrencyCode;
}

interface CurrencyContextValue {
  baseCurrency: CurrencyCode;
  setBaseCurrency: (currency: CurrencyCode) => void;
  rates: ExchangeRate[];
  lastUpdate: number | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  convert: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [baseCurrency, setBaseCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    storageGet<CurrencySettings>(SETTINGS_KEY).then((settings) => {
      if (settings?.baseCurrency) setBaseCurrencyState(settings.baseCurrency);
    });
    void load(false);
  }, [load]);

  const setBaseCurrency = useCallback((currency: CurrencyCode) => {
    setBaseCurrencyState(currency);
    void storageSet<CurrencySettings>(SETTINGS_KEY, { baseCurrency: currency });
  }, []);

  const refresh = useCallback(() => load(true), [load]);

  const convert = useCallback(
    (amount: number, from: CurrencyCode, to: CurrencyCode) => convertCurrency(amount, from, to, rates),
    [rates],
  );

  const value: CurrencyContextValue = useMemo(
    () => ({ baseCurrency, setBaseCurrency, rates, lastUpdate, isLoading, error, refresh, convert }),
    [baseCurrency, setBaseCurrency, rates, lastUpdate, isLoading, error, refresh, convert],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its provider by design
export function useCurrencyContext(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrencyContext must be used within CurrencyProvider');
  return ctx;
}
