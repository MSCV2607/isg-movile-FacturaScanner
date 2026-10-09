import { ResumenFactura } from '../entities/ResumenFactura';
import { ResumenPeriodo, SIN_CATEGORIA, TotalPorCategoria, TotalPorProveedor } from '../entities/ResumenPeriodo';
import { importeConSigno, redondear2 } from '../rules/comprobante';

const MONEDA_DEL_RESUMEN = 'ARS';
const CANTIDAD_DE_PROVEEDORES = 5;

/** Suma lo gastado en un conjunto de facturas, por rubro y por proveedor. Solo cuenta pesos; las notas de crédito restan. */
export class ResumirPeriodoUseCase {
  ejecutar(facturas: ResumenFactura[]): ResumenPeriodo {
    const enPesos = facturas.filter((factura) => factura.moneda === MONEDA_DEL_RESUMEN);

    const porCategoria = new Map<string, number>();
    const porProveedor = new Map<string, TotalPorProveedor>();
    let total = 0;
    let iva = 0;

    for (const factura of enPesos) {
      const importe = importeConSigno(factura.tipoComprobante, factura.importe);
      total += importe;
      iva += importeConSigno(factura.tipoComprobante, factura.importeIva);

      const categoria = factura.categoria.trim() || SIN_CATEGORIA;
      porCategoria.set(categoria, (porCategoria.get(categoria) ?? 0) + importe);

      const proveedor = porProveedor.get(factura.cuitEmisor) ?? {
        razonSocial: factura.razonSocial,
        cuit: factura.cuitEmisor,
        total: 0,
      };
      proveedor.total += importe;
      porProveedor.set(factura.cuitEmisor, proveedor);
    }

    const categorias: TotalPorCategoria[] = [...porCategoria.entries()]
      .map(([categoria, suma]) => ({
        categoria,
        total: redondear2(suma),
        porcentaje: total > 0 ? Math.round((suma / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const proveedores = [...porProveedor.values()]
      .map((proveedor) => ({ ...proveedor, total: redondear2(proveedor.total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, CANTIDAD_DE_PROVEEDORES);

    return {
      cantidad: enPesos.length,
      total: redondear2(total),
      iva: redondear2(iva),
      categorias,
      proveedores,
      cantidadOtraMoneda: facturas.length - enPesos.length,
    };
  }
}
