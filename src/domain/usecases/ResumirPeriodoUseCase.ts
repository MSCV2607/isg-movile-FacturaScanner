import { EstadoTope, ResumenPeriodo, SIN_CATEGORIA, TotalPorCategoria, TotalPorProveedor } from '../entities/ResumenPeriodo';
import { ResumenFactura } from '../entities/ResumenFactura';
import { importeConSigno, redondear2 } from '../rules/comprobante';

const MONEDA_DEL_RESUMEN = 'ARS';
const CANTIDAD_DE_PROVEEDORES = 5;
/** Desde este porcentaje del tope se avisa que falta poco para pasarse. */
const UMBRAL_CERCA = 80;

function estadoDelTope(total: number, tope: number | null): { estadoTope: EstadoTope; porcentajeDelTope: number } {
  if (tope === null) return { estadoTope: 'sin', porcentajeDelTope: 0 };
  const porcentajeDelTope = Math.round((total / tope) * 100);
  if (total > tope) return { estadoTope: 'excedido', porcentajeDelTope };
  return { estadoTope: porcentajeDelTope >= UMBRAL_CERCA ? 'cerca' : 'ok', porcentajeDelTope };
}

/**
 * Suma lo gastado en un conjunto de facturas, por rubro y por proveedor, y lo compara con el tope mensual de cada rubro.
 * Solo cuenta pesos; las notas de crédito restan.
 */
export class ResumirPeriodoUseCase {
  ejecutar(facturas: ResumenFactura[], topes: Record<string, number> = {}): ResumenPeriodo {
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

    // Un rubro con tope aparece aunque este período no haya gastado nada en él.
    for (const categoria of Object.keys(topes)) {
      if (!porCategoria.has(categoria)) porCategoria.set(categoria, 0);
    }

    const categorias: TotalPorCategoria[] = [...porCategoria.entries()]
      .map(([categoria, suma]) => {
        const sumaRedondeada = redondear2(suma);
        const tope = topes[categoria] ?? null;
        return {
          categoria,
          total: sumaRedondeada,
          porcentaje: total > 0 ? Math.round((suma / total) * 100) : 0,
          tope,
          ...estadoDelTope(sumaRedondeada, tope),
        };
      })
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
