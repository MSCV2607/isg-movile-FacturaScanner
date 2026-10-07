import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';

import { ScannerSheetEstado } from '../ScannerSheet';

type ScannerActionsProps = {
  estado: ScannerSheetEstado;
  /** Hay páginas ya escaneadas: se pueden volver a leer sin escanear de nuevo. */
  hayPaginas: boolean;
  onReintentar: () => void;
  onEscanearDeNuevo: () => void;
};

/** Botones de la hoja del escáner: cambian según el estado de la captura. */
export function ScannerActions({ estado, hayPaginas, onReintentar, onEscanearDeNuevo }: ScannerActionsProps) {
  switch (estado) {
    case 'abriendo':
      return <PrimaryButton label="Abriendo escáner" loading />;

    case 'analizando':
      return <PrimaryButton label="Analizando" loading />;

    case 'error':
      return hayPaginas ? (
        <>
          <PrimaryButton label="Reintentar" onPress={onReintentar} />
          <SecondaryButton label="Escanear de nuevo" onPress={onEscanearDeNuevo} />
        </>
      ) : (
        <PrimaryButton label="Escanear de nuevo" onPress={onEscanearDeNuevo} />
      );
  }
}
