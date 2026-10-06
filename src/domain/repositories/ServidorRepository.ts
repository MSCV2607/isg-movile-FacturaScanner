import { Configuracion } from '../entities/Configuracion';
import { Factura } from '../entities/Factura';
import { ResultadoConexion, ResultadoEnvio } from '../entities/ResultadoEnvio';

export interface ServidorRepository {
  /** Nunca lanza: los fallos de red se informan dentro del resultado. */
  enviarFactura(factura: Factura, configuracion: Configuracion): Promise<ResultadoEnvio>;
  verificarConexion(configuracion: Configuracion): Promise<ResultadoConexion>;
}
