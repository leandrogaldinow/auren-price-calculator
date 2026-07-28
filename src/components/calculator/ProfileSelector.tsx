import { Select } from '@/components/ui/Select';
import type { Profile } from '@/types';

interface ProfileSelectorProps {
  profiles: Profile[];
  activeProfileId: string;
  onSelect: (id: string) => void;
}

export function ProfileSelector({ profiles, activeProfileId, onSelect }: ProfileSelectorProps) {
  return (
    <Select
      options={profiles.map((profile) => ({ value: profile.id, label: profile.name }))}
      value={activeProfileId}
      onChange={(event) => onSelect(event.target.value)}
      aria-label="Perfil ativo"
    />
  );
}
