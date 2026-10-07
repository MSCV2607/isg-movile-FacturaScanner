import { ModoEscaneo } from '@presentation/hooks/modoEscaneo';

export type ScannerSheetEstado =
  | 'lista'
  | 'capturando'
  | 'con-fotos'
  | 'analizando'
  | 'error'
  | 'sin-permiso';

export interface TextosSheet {
  chip: string;
  titulo: string;
  detalle: string;
}

const fotos = (cantidad: number) => `${cantidad} ${cantidad === 1 ? 'foto' : 'fotos'}`;

/** Textos de la hoja inferior del escáner según el estado en que esté. */
export function textosDelSheet(
  estado: ScannerSheetEstado,
  modo: ModoEscaneo,
  cantidadFotos: number,
  mensajeError: string | null,
  qrDetectado = false,
): TextosSheet {
  const textos = textosBase(estado, modo, cantidadFotos, mensajeError);
  // Con el QR de ARCA leído, los datos principales ya están asegurados.
  const conQr = estado === 'lista' || estado === 'capturando' || estado === 'con-fotos';
  return qrDetectado && conQr ? { ...textos, chip: `${textos.chip} · QR de ARCA leído` } : textos;
}

function textosBase(
  estado: ScannerSheetEstado,
  modo: ModoEscaneo,
  cantidadFotos: number,
  mensajeError: string | null,
): TextosSheet {
  switch (estado) {
    case 'lista':
      return modo === 'automatico'
        ? {
            chip: 'Cámara lista',
            titulo: 'Tocá Empezar y bajá despacio',
            detalle: 'Ideal para tickets largos: la app saca las fotos sola mientras lo recorrés.',
          }
        : {
            chip: 'Cámara lista',
            titulo: 'Sacá una foto de la factura',
            detalle: 'Si es larga, sacá una foto por tramo y tocá Terminar al llegar al final.',
          };
    case 'capturando':
      return {
        chip: fotos(cantidadFotos),
        titulo: 'Bajá despacio por el ticket',
        detalle: 'Mantené el celular firme. Tocá Terminar cuando llegues al final.',
      };
    case 'con-fotos':
      return {
        chip: fotos(cantidadFotos),
        titulo: 'Bajá hasta el siguiente tramo',
        detalle: 'Dejá un poco del tramo anterior en la foto. Tocá Terminar al llegar al final.',
      };
    case 'analizando':
      return {
        chip: 'Analizando factura...',
        titulo: 'Leyendo los datos',
        detalle: cantidadFotos > 1 ? `Uniendo ${fotos(cantidadFotos)}. Puede tardar un poco más.` : 'Puede tardar unos segundos.',
      };
    case 'error':
      return {
        chip: 'No se pudo leer',
        titulo: 'Probemos de nuevo',
        detalle: mensajeError ?? '',
      };
    case 'sin-permiso':
      return {
        chip: 'Cámara sin permiso',
        titulo: 'Necesitamos usar la cámara',
        detalle: 'La cámara se usa solamente para sacarle fotos a tus facturas.',
      };
  }
}
