import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AurenStorageSchema,
  CalculatorInputs,
  CalculatorResults,
  Profile,
  ProfileFees,
} from '@/types';
import { loadState, saveState } from '@/storage/profileStorage';
import {
  applyProfileFees,
  buildDuplicateProfile,
  buildNewProfile,
  resetProfileFees,
} from '@/services/profileService';
import { calculatePricing } from '@/utils/calculations/pricingCalculator';
import { exportStateToFile, parseImportedFile } from '@/services/exportImportService';

interface CalculatorContextValue {
  isLoaded: boolean;
  profiles: Profile[];
  activeProfile: Profile | undefined;
  productCost: number;
  shipping: number;
  draftFees: ProfileFees;
  isDirty: boolean;
  inputs: CalculatorInputs;
  results: CalculatorResults;
  setProductCost: (value: number) => void;
  setShipping: (value: number) => void;
  setDraftFee: <K extends keyof ProfileFees>(field: K, value: ProfileFees[K]) => void;
  selectProfile: (id: string) => void;
  saveProfile: () => void;
  createProfile: (name: string) => void;
  duplicateProfile: () => void;
  deleteProfile: () => void;
  resetProfile: () => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

const FEE_KEYS: (keyof ProfileFees)[] = [
  'markup',
  'gatewayPercent',
  'checkoutPercent',
  'iofPercent',
  'taxPercent',
  'marketingPercent',
  'extraPercent',
];

function extractFees(profile: Profile): ProfileFees {
  return {
    markup: profile.markup,
    gatewayPercent: profile.gatewayPercent,
    checkoutPercent: profile.checkoutPercent,
    iofPercent: profile.iofPercent,
    taxPercent: profile.taxPercent,
    marketingPercent: profile.marketingPercent,
    extraPercent: profile.extraPercent,
  };
}

function feesEqual(a: ProfileFees, b: ProfileFees): boolean {
  return FEE_KEYS.every((key) => a[key] === b[key]);
}

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState('');
  const [productCost, setProductCostState] = useState(0);
  const [shipping, setShippingState] = useState(0);
  const [draftFees, setDraftFees] = useState<ProfileFees>({
    markup: 2.5,
    gatewayPercent: 0,
    checkoutPercent: 0,
    iofPercent: 0,
    taxPercent: 0,
    marketingPercent: 0,
    extraPercent: 0,
  });

  useEffect(() => {
    loadState().then((state) => {
      setProfiles(state.profiles);
      setActiveProfileId(state.activeProfileId);
      setProductCostState(state.lastProductCost);
      setShippingState(state.lastShipping);
      const active = state.profiles.find((p) => p.id === state.activeProfileId);
      if (active) setDraftFees(extractFees(active));
      setIsLoaded(true);
    });
  }, []);

  const persist = useCallback(
    (next: Partial<AurenStorageSchema>) => {
      const nextState: AurenStorageSchema = {
        profiles: next.profiles ?? profiles,
        activeProfileId: next.activeProfileId ?? activeProfileId,
        lastProductCost: next.lastProductCost ?? productCost,
        lastShipping: next.lastShipping ?? shipping,
        version: 1,
      };
      void saveState(nextState);
    },
    [profiles, activeProfileId, productCost, shipping],
  );

  // Persist product/shipping immediately — they live outside any profile.
  useEffect(() => {
    if (!isLoaded) return;
    persist({ lastProductCost: productCost, lastShipping: shipping });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCost, shipping, isLoaded]);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId),
    [profiles, activeProfileId],
  );

  const isDirty = useMemo(
    () => (activeProfile ? !feesEqual(draftFees, extractFees(activeProfile)) : false),
    [activeProfile, draftFees],
  );

  const inputs: CalculatorInputs = useMemo(
    () => ({ productCost, shipping, ...draftFees }),
    [productCost, shipping, draftFees],
  );

  const results = useMemo(() => calculatePricing(inputs), [inputs]);

  const setDraftFee = useCallback(
    <K extends keyof ProfileFees>(field: K, value: ProfileFees[K]) => {
      setDraftFees((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const selectProfile = useCallback(
    (id: string) => {
      const target = profiles.find((p) => p.id === id);
      if (!target) return;
      setActiveProfileId(id);
      setDraftFees(extractFees(target));
      persist({ activeProfileId: id });
    },
    [profiles, persist],
  );

  const saveProfile = useCallback(() => {
    if (!activeProfile) return;
    const updated = applyProfileFees(activeProfile, draftFees);
    const nextProfiles = profiles.map((p) => (p.id === updated.id ? updated : p));
    setProfiles(nextProfiles);
    persist({ profiles: nextProfiles });
  }, [activeProfile, draftFees, profiles, persist]);

  const createProfile = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const created = buildNewProfile(trimmed, draftFees);
      const nextProfiles = [...profiles, created];
      setProfiles(nextProfiles);
      setActiveProfileId(created.id);
      persist({ profiles: nextProfiles, activeProfileId: created.id });
    },
    [draftFees, profiles, persist],
  );

  const duplicateProfile = useCallback(() => {
    if (!activeProfile) return;
    const source = applyProfileFees(activeProfile, draftFees);
    const duplicated = buildDuplicateProfile(source);
    const nextProfiles = [...profiles, duplicated];
    setProfiles(nextProfiles);
    setActiveProfileId(duplicated.id);
    setDraftFees(extractFees(duplicated));
    persist({ profiles: nextProfiles, activeProfileId: duplicated.id });
  }, [activeProfile, draftFees, profiles, persist]);

  const deleteProfile = useCallback(() => {
    if (!activeProfile || profiles.length <= 1) return;
    const nextProfiles = profiles.filter((p) => p.id !== activeProfile.id);
    const fallback = nextProfiles[0];
    setProfiles(nextProfiles);
    setActiveProfileId(fallback.id);
    setDraftFees(extractFees(fallback));
    persist({ profiles: nextProfiles, activeProfileId: fallback.id });
  }, [activeProfile, profiles, persist]);

  const resetProfile = useCallback(() => {
    if (!activeProfile) return;
    const reset = resetProfileFees(activeProfile);
    const nextProfiles = profiles.map((p) => (p.id === reset.id ? reset : p));
    setProfiles(nextProfiles);
    setDraftFees(extractFees(reset));
    persist({ profiles: nextProfiles });
  }, [activeProfile, profiles, persist]);

  const exportData = useCallback(() => {
    exportStateToFile({
      profiles,
      activeProfileId,
      lastProductCost: productCost,
      lastShipping: shipping,
      version: 1,
    });
  }, [profiles, activeProfileId, productCost, shipping]);

  const importData = useCallback(async (file: File) => {
    const imported = await parseImportedFile(file);
    setProfiles(imported.profiles);
    setActiveProfileId(imported.activeProfileId);
    setProductCostState(imported.lastProductCost);
    setShippingState(imported.lastShipping);
    const active = imported.profiles.find((p) => p.id === imported.activeProfileId);
    if (active) setDraftFees(extractFees(active));
    await saveState(imported);
  }, []);

  const value: CalculatorContextValue = {
    isLoaded,
    profiles,
    activeProfile,
    productCost,
    shipping,
    draftFees,
    isDirty,
    inputs,
    results,
    setProductCost: setProductCostState,
    setShipping: setShippingState,
    setDraftFee,
    selectProfile,
    saveProfile,
    createProfile,
    duplicateProfile,
    deleteProfile,
    resetProfile,
    exportData,
    importData,
  };

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its provider by design
export function useCalculatorContext(): CalculatorContextValue {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error('useCalculatorContext must be used within CalculatorProvider');
  return ctx;
}
