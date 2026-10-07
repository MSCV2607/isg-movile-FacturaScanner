import { DocumentoEscaneado } from '@domain/entities/DocumentoEscaneado';

export interface EscanerDocumentosDataSource {
  /** Abre el escáner del sistema y devuelve las páginas listas; null si el usuario lo cierra sin escanear. */
  escanear(maximoPaginas: number): Promise<DocumentoEscaneado | null>;
}
