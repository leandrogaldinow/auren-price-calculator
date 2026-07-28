import { useState } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { SaveIcon, PlusIcon, DuplicateIcon, TrashIcon, ResetIcon, CheckIcon } from '@/components/icons';

interface ProfileActionsProps {
  isDirty: boolean;
  canDelete: boolean;
  onSave: () => void;
  onCreate: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onReset: () => void;
}

export function ProfileActions({
  isDirty,
  canDelete,
  onSave,
  onCreate,
  onDuplicate,
  onDelete,
  onReset,
}: ProfileActionsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const confirmCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName);
    setNewName('');
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') confirmCreate();
            if (e.key === 'Escape') setIsCreating(false);
          }}
          placeholder="Nome do perfil"
          className="w-full rounded-lg border border-primary bg-background px-3 py-2 text-sm text-text outline-none"
        />
        <IconButton label="Confirmar" icon={<CheckIcon />} onClick={confirmCreate} />
      </div>
    );
  }

  if (confirmingDelete) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2">
        <span className="text-xs font-medium text-danger">Excluir este perfil?</span>
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" onClick={() => setConfirmingDelete(false)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              onDelete();
              setConfirmingDelete(false);
            }}
          >
            Excluir
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <Button variant="primary" size="sm" icon={<SaveIcon />} onClick={onSave} disabled={!isDirty}>
        Salvar Perfil
      </Button>
      <div className="flex items-center gap-0.5">
        <IconButton label="Novo Perfil" icon={<PlusIcon />} onClick={() => setIsCreating(true)} />
        <IconButton label="Duplicar Perfil" icon={<DuplicateIcon />} onClick={onDuplicate} />
        <IconButton label="Resetar" icon={<ResetIcon />} onClick={onReset} />
        <IconButton
          label="Excluir Perfil"
          icon={<TrashIcon />}
          onClick={() => setConfirmingDelete(true)}
          disabled={!canDelete}
          className="hover:text-danger"
        />
      </div>
    </div>
  );
}
