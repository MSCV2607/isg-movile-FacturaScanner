import { Ajustes } from '../entities/Ajustes';

/** Preferencias del usuario guardadas en el celular (categorías y topes). */
export interface AjustesRepository {
  /** Si el usuario nunca los tocó, devuelve los valores de fábrica. */
  obtener(): Promise<Ajustes>;
  guardar(ajustes: Ajustes): Promise<void>;
}
