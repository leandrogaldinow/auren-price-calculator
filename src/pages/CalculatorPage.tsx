import { useCalculatorContext } from '@/context/CalculatorContext';
import { useCurrencyContext } from '@/context/CurrencyContext';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';
import { ProfileSelector } from '@/components/calculator/ProfileSelector';
import { ProfileActions } from '@/components/calculator/ProfileActions';
import { CostForm } from '@/components/calculator/CostForm';
import { FeesForm } from '@/components/calculator/FeesForm';
import { ResultsSummary } from '@/components/calculator/ResultsSummary';
import { ResultsActions } from '@/components/calculator/ResultsActions';
import { buildResultsSummary, copyToClipboard } from '@/services/clipboardService';
import { ImportValidationError } from '@/services/exportImportService';

export function CalculatorPage() {
  const {
    profiles,
    activeProfile,
    productCost,
    shipping,
    productCostCurrency,
    shippingCurrency,
    draftFees,
    isDirty,
    results,
    setProductCost,
    setShipping,
    setProductCostCurrency,
    setShippingCurrency,
    setDraftFee,
    selectProfile,
    saveProfile,
    createProfile,
    duplicateProfile,
    deleteProfile,
    resetProfile,
    exportData,
    importData,
  } = useCalculatorContext();
  const { baseCurrency } = useCurrencyContext();
  const { toast, showToast } = useToast();

  if (!activeProfile) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(buildResultsSummary(results, draftFees.markup, baseCurrency));
    showToast(ok ? 'Resultados copiados!' : 'Não foi possível copiar.', ok ? 'success' : 'danger');
  };

  const handleImport = async (file: File) => {
    try {
      await importData(file);
      showToast('Dados importados com sucesso!');
    } catch (error) {
      const message = error instanceof ImportValidationError ? error.message : 'Falha ao importar arquivo.';
      showToast(message, 'danger');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <ProfileSelector profiles={profiles} activeProfileId={activeProfile.id} onSelect={selectProfile} />
        <ProfileActions
          isDirty={isDirty}
          canDelete={profiles.length > 1}
          onSave={() => {
            saveProfile();
            showToast('Perfil salvo!');
          }}
          onCreate={createProfile}
          onDuplicate={duplicateProfile}
          onDelete={deleteProfile}
          onReset={resetProfile}
        />
      </div>

      <CostForm
        productCost={productCost}
        shipping={shipping}
        markup={draftFees.markup}
        productCostCurrency={productCostCurrency}
        shippingCurrency={shippingCurrency}
        onProductCostChange={setProductCost}
        onShippingChange={setShipping}
        onMarkupChange={(value) => setDraftFee('markup', value)}
        onProductCostCurrencyChange={setProductCostCurrency}
        onShippingCurrencyChange={setShippingCurrency}
      />

      <FeesForm />

      <ResultsSummary results={results} currency={baseCurrency} />

      <ResultsActions onCopy={handleCopy} onExport={exportData} onImport={handleImport} />

      <Toast toast={toast} />
    </div>
  );
}
