import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { CopyIcon, DownloadIcon, UploadIcon } from '@/components/icons';

interface ResultsActionsProps {
  onCopy: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export function ResultsActions({ onCopy, onExport, onImport }: ResultsActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid grid-cols-3 gap-2">
      <Button size="sm" icon={<CopyIcon />} onClick={onCopy}>
        Copiar
      </Button>
      <Button size="sm" icon={<DownloadIcon />} onClick={onExport}>
        Exportar
      </Button>
      <Button size="sm" icon={<UploadIcon />} onClick={() => fileInputRef.current?.click()}>
        Importar
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onImport(file);
          event.target.value = '';
        }}
      />
    </div>
  );
}
