import { CampoFactura, Factura } from './Factura';

/** Cómo se leyó una factura y qué se le mostró al usuario, para medir después cuánto tuvo que corregir. */
export interface RegistroLectura {
  proveedor: string;
  conQr: boolean;
  /** true si se usó una segunda lectura de la IA, hecha porque la primera tenía datos que no cerraban. */
  segundaPasada: boolean;
  /** Campos que la IA marcó como dudosos. */
  camposDudosos: CampoFactura[];
  /** Campos en los que la IA leyó distinto que el QR de ARCA. */
  camposConDiscrepancia: CampoFactura[];
  /** La factura tal como se le mostró al usuario para revisar. */
  mostrada: Factura;
}

/** Un dato que el usuario cambió al revisar lo que se le mostró. */
export interface CorreccionCampo {
  campo: CampoFactura;
  valorLeido: string;
  valorFinal: string;
}

/** Lo que queda guardado de una lectura una vez que el usuario confirmó la factura. */
export interface LecturaIaGuardada {
  proveedor: string;
  conQr: boolean;
  segundaPasada: boolean;
  camposDudosos: CampoFactura[];
  camposCorregidos: CampoFactura[];
}

/** Resumen de cuánto acierta la lectura con IA, medido sobre las facturas ya guardadas. */
export interface ResumenPrecisionIa {
  /** Facturas leídas con IA y guardadas. */
  lecturas: number;
  /** De ellas, las que el usuario no tuvo que corregir en ningún campo. */
  sinCorrecciones: number;
  /** Las que necesitaron una segunda lectura. */
  conSegundaPasada: number;
  /** Los campos que más se corrigen, de mayor a menor. */
  camposMasCorregidos: { campo: CampoFactura; veces: number }[];
}
