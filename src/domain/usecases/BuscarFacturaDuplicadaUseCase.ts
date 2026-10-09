import { Factura } from '../entities/Factura';
import { ResumenFactura } from '../entities/ResumenFactura';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';
import { mismoComprobante } from '../rules/comprobante';

/** Busca si el comprobante que se está por guardar ya está guardado (mismo CUIT, tipo, letra, punto de venta y número). */
export class BuscarFacturaDuplicadaUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  async ejecutar(factura: Factura): Promise<ResumenFactura | null> {
    const { cuit } = factura.emisor;
    const parecidas = await this.facturas.buscarPorComprobante(cuit, factura.puntoVenta, factura.numero);

    const nueva = {
      cuit,
      tipoComprobante: factura.tipoComprobante,
      letra: factura.letra,
      puntoVenta: factura.puntoVenta,
      numero: factura.numero,
    };
    return (
      parecidas.find((guardada) =>
        mismoComprobante(nueva, {
          cuit: guardada.cuitEmisor,
          tipoComprobante: guardada.tipoComprobante,
          letra: guardada.letra,
          puntoVenta: guardada.puntoVenta,
          numero: guardada.numero,
        }),
      ) ?? null
    );
  }
}
