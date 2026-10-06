import { Configuracion } from '../entities/Configuracion';

export interface ConfiguracionRepository {
  obtener(): Promise<Configuracion>;
  guardar(configuracion: Configuracion): Promise<void>;
}
