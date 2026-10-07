import { ActualizacionDisponible } from '../entities/ActualizacionDisponible';

/** Busca actualizaciones publicadas de la app y las instala. */
export interface ActualizacionRepository {
  /** Devuelve la actualización pendiente, o null si la app ya está al día. Falla si no se puede consultar. */
  buscar(): Promise<ActualizacionDisponible | null>;
  /** Descarga la actualización pendiente y reinicia la app para usarla. */
  instalar(): Promise<void>;
}
