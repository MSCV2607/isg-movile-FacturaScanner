import { AjustesGuardadosDto } from '../datasources/AjustesStorageDataSource';

export const FORMATO_RESPALDO = 'isg-facturascanner-respaldo';
export const VERSION_RESPALDO = 1;
export const ARCHIVO_RESPALDO = 'facturas.json';
export const CARPETA_FOTOS_RESPALDO = 'fotos';

/** Una factura dentro del archivo de respaldo. No usa los nombres de las columnas: así el respaldo no depende del esquema de la base. */
export interface FacturaRespaldoDto {
  creadaEn: string;
  emisor: { razonSocial: string; cuit: string; condicionFiscal: string };
  tipoComprobante: string;
  letra: string;
  puntoVenta: number;
  numero: number;
  fecha: string;
  moneda: string;
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    alicuotaIva: number | null;
    subtotal: number;
  }[];
  importeNeto: number;
  importeIva: number;
  importeTotal: number;
  categoria: string;
  medioPago: string;
  notas: string;
  /** Nombres de los archivos dentro de la carpeta "fotos" del respaldo, de arriba hacia abajo. */
  fotos: string[];
}

export interface RespaldoDto {
  formato: typeof FORMATO_RESPALDO;
  version: number;
  creadoEn: string;
  facturas: FacturaRespaldoDto[];
  ajustes: AjustesGuardadosDto;
}
