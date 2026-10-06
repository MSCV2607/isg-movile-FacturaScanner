import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { ModoEscaneo } from '@presentation/hooks/modoEscaneo';

import { ModoSelector } from '../ModoSelector';
import { ScannerSheetEstado } from '../ScannerSheet';
import { ShutterButton } from '../ShutterButton';

type ScannerActionsProps = {
  estado: ScannerSheetEstado;
  modo: ModoEscaneo;
  cantidadFotos: number;
  /** El sistema ya no muestra el diálogo de permiso: hay que ir a los ajustes. */
  permisoBloqueado: boolean;
  onCambiarModo: (modo: ModoEscaneo) => void;
  onSacarFoto: () => void;
  onIniciarAutomatico: () => void;
  onTerminar: () => void;
  onReiniciar: () => void;
  onPermisoPress: () => void;
};

/** Botones de la hoja del escáner: cambian según el estado y el modo de captura. */
export function ScannerActions({
  estado,
  modo,
  cantidadFotos,
  permisoBloqueado,
  onCambiarModo,
  onSacarFoto,
  onIniciarAutomatico,
  onTerminar,
  onReiniciar,
  onPermisoPress,
}: ScannerActionsProps) {
  switch (estado) {
    case 'sin-permiso':
      return (
        <PrimaryButton label={permisoBloqueado ? 'Abrir ajustes' : 'Permitir cámara'} onPress={onPermisoPress} />
      );

    case 'analizando':
      return <PrimaryButton label="Analizando" loading />;

    case 'capturando':
      return (
        <>
          <PrimaryButton label={`Terminar (${cantidadFotos})`} onPress={onTerminar} />
          <SecondaryButton label="Cancelar" onPress={onReiniciar} />
        </>
      );

    case 'con-fotos':
      return (
        <>
          <ShutterButton onPress={onSacarFoto} />
          <PrimaryButton label={`Terminar (${cantidadFotos})`} onPress={onTerminar} />
          <SecondaryButton label="Empezar de nuevo" onPress={onReiniciar} />
        </>
      );

    case 'error':
      return (
        <>
          {cantidadFotos > 0 ? <PrimaryButton label="Reintentar" onPress={onTerminar} /> : null}
          <SecondaryButton label="Empezar de nuevo" onPress={onReiniciar} />
        </>
      );

    case 'lista':
      return (
        <>
          <ModoSelector modo={modo} onChange={onCambiarModo} />
          {modo === 'automatico' ? (
            <PrimaryButton label="Empezar a escanear" onPress={onIniciarAutomatico} />
          ) : (
            <ShutterButton onPress={onSacarFoto} />
          )}
        </>
      );
  }
}
