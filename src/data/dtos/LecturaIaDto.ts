/** Datos de una lectura con IA tal como se guardan en SQLite (los campos van separados por coma). */
export interface NuevaLecturaIaDto {
  creada_en: string;
  proveedor: string;
  con_qr: number;
  segunda_pasada: number;
  campos_dudosos: string;
  campos_discrepancia: string;
  campos_corregidos: string;
  /** JSON: [{ campo, valorLeido, valorFinal }]. Sirve para ver qué errores comete la IA y mejorar las instrucciones. */
  correcciones: string;
}

/** Lo que se lee de la tabla para medir la precisión. */
export interface LecturaIaFilaDto {
  proveedor: string;
  con_qr: number;
  segunda_pasada: number;
  campos_dudosos: string;
  campos_corregidos: string;
}
