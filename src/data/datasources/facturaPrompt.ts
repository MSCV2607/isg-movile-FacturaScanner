// Instrucciones y esquema de la factura, comunes a todos los servicios de IA.

const INSTRUCCIONES_BASE = `Leé la foto de esta factura argentina y devolvé sus datos.
- El EMISOR es quien emite el comprobante (el encabezado), no el cliente ni el receptor.
- CUIT: 11 dígitos, sin guiones.
- Condición fiscal del emisor: "Responsable Inscripto", "Monotributo", "Exento", etc., tal como figura.
- Fecha de emisión en formato AAAA-MM-DD. Punto de venta y número como enteros.
- Importes como números con punto decimal y sin separador de miles.
- importe_neto: neto gravado (o subtotal sin IVA); importe_iva: IVA total; importe_total: total del comprobante.
- Incluí todos los ítems del detalle. alicuota_iva en porcentaje (21, 10.5, 27...); omitila si no figura.
- Si un dato no se ve o no existe, usá "" para texto y 0 para números. No inventes nada.
- Si la imagen no es una factura o comprobante, poné es_factura en false.`;

/** Instrucciones para la IA. Con varias fotos (ticket largo) se aclara que son tramos de una misma factura. */
export function instruccionesPara(cantidadFotos: number): string {
  if (cantidadFotos <= 1) return INSTRUCCIONES_BASE;

  return `${INSTRUCCIONES_BASE}
- Recibís ${cantidadFotos} fotos de UNA SOLA factura (un ticket largo), ordenadas de arriba hacia abajo. Cada foto se solapa un poco con la anterior.
- Unilas en una única factura: no repitas los ítems ni los importes que aparezcan en dos fotos, y tomá los totales de la última.`;
}

export const ESQUEMA = {
  type: 'object',
  properties: {
    es_factura: { type: 'boolean' },
    emisor_razon_social: { type: 'string' },
    emisor_cuit: { type: 'string' },
    emisor_condicion_fiscal: { type: 'string' },
    tipo_comprobante: { type: 'string', description: 'Factura, Nota de crédito, Nota de débito, etc.' },
    letra: { type: 'string', description: 'A, B, C, M...' },
    punto_venta: { type: 'integer' },
    numero: { type: 'integer' },
    fecha_emision: { type: 'string', description: 'AAAA-MM-DD' },
    moneda: { type: 'string', description: 'ARS, USD...' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          descripcion: { type: 'string' },
          cantidad: { type: 'number' },
          precio_unitario: { type: 'number' },
          alicuota_iva: { type: 'number' },
          subtotal: { type: 'number' },
        },
        required: ['descripcion', 'cantidad', 'precio_unitario', 'subtotal'],
      },
    },
    importe_neto: { type: 'number' },
    importe_iva: { type: 'number' },
    importe_total: { type: 'number' },
  },
  required: [
    'es_factura',
    'emisor_razon_social',
    'emisor_cuit',
    'emisor_condicion_fiscal',
    'tipo_comprobante',
    'letra',
    'punto_venta',
    'numero',
    'fecha_emision',
    'moneda',
    'items',
    'importe_neto',
    'importe_iva',
    'importe_total',
  ],
};
