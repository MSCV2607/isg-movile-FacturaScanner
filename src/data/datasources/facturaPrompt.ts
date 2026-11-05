// Instrucciones y esquema de la factura, comunes a todos los servicios de IA.

const INSTRUCCIONES_BASE = `Leé la foto de esta factura argentina y devolvé sus datos.
- El EMISOR es quien emite el comprobante (el encabezado), no el cliente ni el receptor. El CUIT del cliente va en receptor_cuit.
- CUIT: 11 dígitos, sin guiones.
- Condición fiscal del emisor: "Responsable Inscripto", "Monotributo", "Exento", etc., tal como figura.
- Punto de venta y número como enteros. Si figuran juntos ("0004-00001234"), el primero es el punto de venta y el segundo el número.
- Fecha de emisión en formato AAAA-MM-DD. En el comprobante suele estar como DD/MM/AAAA: no la confundas con la fecha de vencimiento ni con la del CAE.
- Importes como números con punto decimal y sin separador de miles. En Argentina se escriben con coma decimal y punto de miles ("1.234,56" es 1234.56).
- importe_neto: neto gravado (o subtotal sin IVA); importe_iva: IVA total; importe_total: total del comprobante.
- Factura C o emisor Monotributo: no discrimina IVA. importe_iva = 0 e importe_neto = importe_total.
- Si el ticket solo dice "IVA contenido" (consumidor final): importe_iva = ese valor e importe_neto = total menos ese IVA.
- Percepciones (IIBB, IVA), impuestos internos y otros tributos van en importe_otros_tributos: no son neto ni IVA, pero suman al total. Si no hay, 0.
- Si hay descuentos o bonificaciones, el neto es el que queda después de aplicarlos.
- En notas de crédito los importes van en positivo; el tipo_comprobante indica que es una nota de crédito.
- Incluí todos los ítems del detalle. alicuota_iva en porcentaje (21, 10.5, 27...); omitila si no figura.
- Si un dato no se ve o no existe, usá "" para texto y 0 para números. No inventes nada.
- En campos_dudosos listá los campos que no se leen bien, que adivinaste o que no cierran entre sí. Si estás seguro de todo, devolvé una lista vacía.
- Si la imagen no es una factura o comprobante, poné es_factura en false.`;

/**
 * Instrucciones para la IA. Con varias fotos (ticket largo) se aclara que son tramos de una misma factura.
 * `correcciones` son los problemas que tuvo una lectura anterior: se pide una segunda pasada que los revise.
 */
export function instruccionesPara(cantidadFotos: number, correcciones: string[] = []): string {
  const partes = [INSTRUCCIONES_BASE];

  if (cantidadFotos > 1) {
    partes.push(`- Recibís ${cantidadFotos} fotos de UNA SOLA factura (un ticket largo), ordenadas de arriba hacia abajo. Cada foto se solapa un poco con la anterior.
- Unilas en una única factura: no repitas los ítems ni los importes que aparezcan en dos fotos, y tomá los totales de la última.`);
  }

  if (correcciones.length > 0) {
    partes.push(`Una lectura anterior de esta misma factura tuvo estos problemas:
${correcciones.map((problema) => `- ${problema}`).join('\n')}
Volvé a mirar la imagen con atención. Corregí un dato solo si la imagen lo confirma; si la imagen coincide con la lectura anterior, mantenelo y marcalo en campos_dudosos.`);
  }

  return partes.join('\n');
}

/** Nombres que usa la IA para marcar un dato dudoso (ver `facturaExtraidaMapper`). */
export const CAMPOS_DUDOSOS = [
  'razon_social',
  'cuit',
  'condicion_fiscal',
  'punto_venta',
  'numero',
  'fecha',
  'importe_neto',
  'importe_iva',
  'importe_total',
];

export const ESQUEMA = {
  type: 'object',
  properties: {
    es_factura: { type: 'boolean' },
    emisor_razon_social: { type: 'string' },
    emisor_cuit: { type: 'string' },
    emisor_condicion_fiscal: { type: 'string' },
    receptor_cuit: { type: 'string', description: 'CUIT/CUIL/DNI del cliente, solo dígitos. "" si no figura.' },
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
    importe_otros_tributos: { type: 'number', description: 'Percepciones, impuestos internos y otros tributos.' },
    importe_total: { type: 'number' },
    campos_dudosos: {
      type: 'array',
      description: 'Campos poco legibles o adivinados.',
      items: { type: 'string', enum: CAMPOS_DUDOSOS },
    },
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
    'receptor_cuit',
    'importe_otros_tributos',
    'campos_dudosos',
  ],
};
