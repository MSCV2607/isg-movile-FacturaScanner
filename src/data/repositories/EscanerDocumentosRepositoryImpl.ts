import { MAXIMO_PAGINAS_ESCANEO } from '@core/config/env';
import { DocumentoEscaneado } from '@domain/entities/DocumentoEscaneado';
import { EscanerDocumentosRepository } from '@domain/repositories/EscanerDocumentosRepository';

import { EscanerDocumentosDataSource } from '../datasources/EscanerDocumentosDataSource';

export class EscanerDocumentosRepositoryImpl implements EscanerDocumentosRepository {
  constructor(private readonly dataSource: EscanerDocumentosDataSource) {}

  escanear(): Promise<DocumentoEscaneado | null> {
    return this.dataSource.escanear(MAXIMO_PAGINAS_ESCANEO);
  }
}
