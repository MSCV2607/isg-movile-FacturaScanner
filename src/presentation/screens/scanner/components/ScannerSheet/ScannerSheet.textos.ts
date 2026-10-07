import { EstadoCaptura } from '@presentation/hooks/estadoCaptura';

export type ScannerSheetEstado = EstadoCaptura;

export interface TextosSheet {
  chip: string;
  titulo: string;
  detalle: string;
}

const paginas = (cantidad: number) => `${cantidad} ${cantidad === 1 ? 'página' : 'páginas'}`;

/** Textos de la hoja inferior del escáner según el estado en que esté. */
export function textosDelSheet(
  estado: ScannerSheetEstado,
  cantidadPaginas: number,
  mensajeError: string | null,
  qrDetectado = false,
): TextosSheet {
  const textos = textosBase(estado, cantidadPaginas, mensajeError);
  // Con el QR de ARCA leído, los datos principales ya están asegurados.
  return qrDetectado && estado === 'analizando' ? { ...textos, chip: `${textos.chip} · QR de ARCA leído` } : textos;
}

function textosBase(estado: ScannerSheetEstado, cantidadPaginas: number, mensajeError: string | null): TextosSheet {
  switch (estado) {
    case 'abriendo':
      return {
        chip: 'Abriendo escáner...',
        titulo: 'Apuntá a la factura',
        detalle: 'El escáner encuadra y recorta solo. Si es un ticket largo, escaneá una página por tramo.',
      };
    case 'analizando':
      return {
        chip: 'Analizando factura...',
        titulo: 'Leyendo los datos',
        detalle:
          cantidadPaginas > 1
            ? `Uniendo ${paginas(cantidadPaginas)}. Puede tardar un poco más.`
            : 'Puede tardar unos segundos.',
      };
    case 'error':
      return {
        chip: 'No se pudo leer',
        titulo: 'Probemos de nuevo',
        detalle: mensajeError ?? '',
      };
  }
}
