import { useCalculatorContext } from '@/context/CalculatorContext';
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
    draftFees,
    isDirty,
    results,
    setProductCost,
    setShipping,
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
  const { toast, showToast } = useToast();

  if (!activeProfile) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(buildResultsSummary(results, draftFees.markup));
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
        onProductCostChange={setProductCost}
        onShippingChange={setShipping}
        onMarkupChange={(value) => setDraftFee('markup', value)}
      />

      <FeesForm fees={draftFees} onChange={setDraftFee} />

      <ResultsSummary results={results} />

      <ResultsActions onCopy={handleCopy} onExport={exportData} onImport={handleImport} />

      <Toast toast={toast} />
    </div>
  );
}
