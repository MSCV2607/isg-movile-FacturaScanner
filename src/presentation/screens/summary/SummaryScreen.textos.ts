export const TEXTOS_RESUMEN = {
  titulo: 'Resumen',
  total: 'Gastado en el mes',
  facturas: (cantidad: number) => `${cantidad} ${cantidad === 1 ? 'factura' : 'facturas'}`,
  iva: (monto: string) => `IVA: ${monto}`,
  porCategoria: 'Por categoría',
  proveedores: 'Principales proveedores',
  vacio: 'No hay facturas en este mes.',
  errorCarga: 'No se pudo cargar el resumen.',
  otraMoneda: (cantidad: number) =>
    `No incluye ${cantidad} ${cantidad === 1 ? 'factura' : 'facturas'} en otra moneda.`,
} as const;
