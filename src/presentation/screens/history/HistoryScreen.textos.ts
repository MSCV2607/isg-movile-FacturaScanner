export const TEXTOS_HISTORIAL = {
  titulo: 'Historial',
  buscar: 'Buscar por emisor, CUIT o número',
  vacioSinFacturas: 'Todavía no guardaste ninguna factura.',
  vacioConFiltros: 'No hay facturas que coincidan con la búsqueda.',
  limpiarFiltros: 'Limpiar filtros',
  exportar: 'Exportar estas facturas',
  errorCarga: 'No se pudieron cargar las facturas.',
  resumen: 'Resumen del mes',
  exportarTitulo: 'Exportar',
  subtitulo: (cantidad: number) => `${cantidad} ${cantidad === 1 ? 'factura' : 'facturas'}`,
} as const;
