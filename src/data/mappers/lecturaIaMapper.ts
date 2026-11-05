import { CampoFactura } from '@domain/entities/Factura';
import { CorreccionCampo, LecturaIaGuardada, RegistroLectura } from '@domain/entities/RegistroLectura';

import { LecturaIaFilaDto, NuevaLecturaIaDto } from '../dtos/LecturaIaDto';

const CAMPOS_VALIDOS: CampoFactura[] = [
  'razonSocial',
  'cuitEmisor',
  'condicionFiscal',
  'puntoVenta',
  'numero',
  'fecha',
  'importeNeto',
  'importeIva',
  'importeTotal',
];

const unir = (campos: CampoFactura[]) => campos.join(',');

/** "fecha,importeTotal" → ['fecha', 'importeTotal']. Ignora lo que no sea un campo conocido. */
function separar(texto: string): CampoFactura[] {
  return texto
    .split(',')
    .map((campo) => campo.trim())
    .filter((campo): campo is CampoFactura => (CAMPOS_VALIDOS as string[]).includes(campo));
}

export const lecturaIaMapper = {
  toNuevaDto(lectura: RegistroLectura, correcciones: CorreccionCampo[], creadaEn: Date): NuevaLecturaIaDto {
    return {
      creada_en: creadaEn.toISOString(),
      proveedor: lectura.proveedor,
      con_qr: lectura.conQr ? 1 : 0,
      segunda_pasada: lectura.segundaPasada ? 1 : 0,
      campos_dudosos: unir(lectura.camposDudosos),
      campos_discrepancia: unir(lectura.camposConDiscrepancia),
      campos_corregidos: unir(correcciones.map((correccion) => correccion.campo)),
      correcciones: JSON.stringify(correcciones),
    };
  },

  toEntity(fila: LecturaIaFilaDto): LecturaIaGuardada {
    return {
      proveedor: fila.proveedor,
      conQr: fila.con_qr === 1,
      segundaPasada: fila.segunda_pasada === 1,
      camposDudosos: separar(fila.campos_dudosos),
      camposCorregidos: separar(fila.campos_corregidos),
    };
  },
};
