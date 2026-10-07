import { CapturaFactura } from '../entities/CapturaFactura';
import { DatosQrArca } from '../entities/DatosQrArca';
import { EscanerDocumentosRepository } from '../repositories/EscanerDocumentosRepository';
import { LeerQrFacturaUseCase } from './LeerQrFacturaUseCase';

/** Escanea la factura y, de los QR que se vean en sus páginas, se queda con el de ARCA. */
export class EscanearDocumentoUseCase {
  constructor(
    private readonly escaner: EscanerDocumentosRepository,
    private readonly leerQr: LeerQrFacturaUseCase,
  ) {}

  /** Devuelve null si el usuario cerró el escáner sin escanear nada. */
  async ejecutar(): Promise<CapturaFactura | null> {
    const documento = await this.escaner.escanear();
    if (!documento || documento.imagenes.length === 0) return null;

    return { imagenes: documento.imagenes, qr: this.buscarQrDeArca(documento.textosQr) };
  }

  private buscarQrDeArca(textos: string[]): DatosQrArca | null {
    for (const texto of textos) {
      const qr = this.leerQr.ejecutar(texto);
      if (qr) return qr;
    }
    return null;
  }
}
