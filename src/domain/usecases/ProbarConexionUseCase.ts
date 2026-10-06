import { Configuracion } from '../entities/Configuracion';
import { ResultadoConexion } from '../entities/ResultadoEnvio';
import { ServidorRepository } from '../repositories/ServidorRepository';

/** Prueba la configuración que está en pantalla, aunque todavía no se haya guardado. */
export class ProbarConexionUseCase {
  constructor(private readonly servidor: ServidorRepository) {}

  ejecutar(configuracion: Configuracion): Promise<ResultadoConexion> {
    return this.servidor.verificarConexion(configuracion);
  }
}
