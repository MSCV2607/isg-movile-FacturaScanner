import { Envio } from '@domain/entities/Envio';

export interface EnvioRepository {
  /** Devuelve los envíos más recientes, del más nuevo al más antiguo. */
  obtenerUltimos(cantidad: number): Promise<Envio[]>;
}
