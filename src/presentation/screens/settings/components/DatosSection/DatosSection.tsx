import { SecondaryButton } from '@presentation/components/SecondaryButton';

import { SettingsSection } from '../SettingsSection';

type DatosSectionProps = {
  onCategorias: () => void;
  onRespaldo: () => void;
};

export function DatosSection({ onCategorias, onRespaldo }: DatosSectionProps) {
  return (
    <SettingsSection title="MIS DATOS">
      <SecondaryButton label="Categorías y topes mensuales" onPress={onCategorias} />
      <SecondaryButton label="Respaldo y restauración" onPress={onRespaldo} />
    </SettingsSection>
  );
}
