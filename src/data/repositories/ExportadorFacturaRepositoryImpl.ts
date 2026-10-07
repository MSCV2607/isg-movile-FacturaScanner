import { FacturaGuardada } from '@domain/entities/FacturaGuardada';
import { ExportadorFacturaRepository } from '@domain/repositories/ExportadorFacturaRepository';

import { ArchivosDataSource } from '../datasources/ArchivosDataSource';
import { ExcelDataSource, TIPO_MIME_EXCEL } from '../datasources/ExcelDataSource';

export class ExportadorFacturaRepositoryImpl implements ExportadorFacturaRepository {
  constructor(
    private readonly excel: ExcelDataSource,
    private readonly archivos: ArchivosDataSource,
  ) {}

  async exportarExcel(factura: FacturaGuardada): Promise<boolean> {
    const carpeta = await this.archivos.elegirCarpeta();
    if (!carpeta) return false;

    const { nombre, base64 } = this.excel.generar(factura);
    this.archivos.guardarBase64EnCarpeta(carpeta, nombre, TIPO_MIME_EXCEL, base64);
    return true;
  }

  async descargarFotos(factura: FacturaGuardada): Promise<number> {
    const carpeta = await this.archivos.elegirCarpeta();
    if (!carpeta) return 0;

    const base = `Factura_${factura.factura.letra}_${factura.id}`;
    for (const [indice, uri] of factura.fotos.entries()) {
      const extension = uri.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
      await this.archivos.copiarACarpeta(carpeta, uri, `${base}_foto${indice + 1}.${extension}`, `image/${extension === 'png' ? 'png' : 'jpeg'}`);
    }
    return factura.fotos.length;
  }

  async compartirExcel(factura: FacturaGuardada): Promise<void> {
    const { nombre, base64 } = this.excel.generar(factura);
    const uri = this.archivos.guardarTemporal(nombre, base64);
    await this.archivos.compartir(uri, TIPO_MIME_EXCEL, 'Compartir factura');
  }
}
