import { ImagenFactura } from '@domain/entities/ImagenFactura';

import { FacturaExtraidaDto } from '../dtos/FacturaExtraidaDto';
import { ExtractorFacturaDataSource } from './ExtractorFacturaDataSource';

const DEMORA_MS = 1500;

/** Devuelve una factura de ejemplo, sin llamar a la IA. Ver `USAR_EXTRACTOR_SIMULADO`. */
export class ExtractorSimuladoDataSource implements ExtractorFacturaDataSource {
  async extraer(_imagenes: ImagenFactura[], _apiKey: string): Promise<FacturaExtraidaDto> {
    await new Promise((resolver) => setTimeout(resolver, DEMORA_MS));
    return {
      es_factura: true,
      emisor_razon_social: 'Distribuidora Del Sur S.R.L.',
      emisor_cuit: '30-71234567-1',
      emisor_condicion_fiscal: 'Responsable Inscripto',
      tipo_comprobante: 'Factura',
      letra: 'A',
      punto_venta: 4,
      numero: 1234,
      fecha_emision: '2026-10-02',
      moneda: 'ARS',
      items: [
        { descripcion: 'Resma papel A4 x500', cantidad: 10, precio_unitario: 4500, alicuota_iva: 21, subtotal: 45000 },
        { descripcion: 'Tóner HP 105A', cantidad: 2, precio_unitario: 18500, alicuota_iva: 21, subtotal: 37000 },
      ],
      importe_neto: 82000,
      importe_iva: 17220,
      importe_total: 99220,
    };
  }
}
