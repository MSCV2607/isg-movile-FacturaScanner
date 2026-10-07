import { DocumentoEscaneado } from '../entities/DocumentoEscaneado';

/** Escanea documentos con la cámara (detecta los bordes, endereza y recorta cada página). */
export interface EscanerDocumentosRepository {
  /** Abre el escáner. Devuelve null si el usuario lo cierra sin escanear nada. Falla si no se puede abrir. */
  escanear(): Promise<DocumentoEscaneado | null>;
}
