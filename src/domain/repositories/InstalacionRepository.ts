import { Instalacion } from '../entities/Instalacion';

export interface InstalacionRepository {
  /** Devuelve la instalación; la primera vez genera y guarda el UUID. */
  obtener(): Promise<Instalacion>;
}
