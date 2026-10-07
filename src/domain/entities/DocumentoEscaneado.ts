import { ImagenFactura } from './ImagenFactura';

/** Resultado crudo del escáner: las páginas ya recortadas y los textos de los QR que se vieron en ellas. */
export interface DocumentoEscaneado {
  imagenes: ImagenFactura[];
  /** Texto de cada QR encontrado (sin repetir). Todavía no se sabe si alguno es de ARCA. */
  textosQr: string[];
}
