import { Popover } from '@/components/ui/Popover';
import { IconButton } from '@/components/ui/IconButton';
import { SettingsIcon } from '@/components/icons';
import { CostSettingsPanel } from '@/components/calculator/CostSettingsPanel';

/** Gear trigger + popover for the cost settings panel — self-contained, reads context internally. */
export function CostSettingsButton() {
  return (
    <Popover trigger={<IconButton label="Configurar custos" icon={<SettingsIcon />} />}>
      <CostSettingsPanel />
    </Popover>
  );
}
