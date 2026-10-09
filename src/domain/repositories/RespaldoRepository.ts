import { ResultadoRespaldo, ResultadoRestauracion } from '../entities/Respaldo';

/** Copia de seguridad de todas las facturas (datos, fotos y preferencias) en una carpeta que elige el usuario. */
export interface RespaldoRepository {
  /** Pide una carpeta y guarda ahí el respaldo. null si el usuario canceló. */
  crear(): Promise<ResultadoRespaldo | null>;
  /**
   * Pide la carpeta de un respaldo y suma lo que falte a este celular; lo que ya está no se toca ni se duplica.
   * null si el usuario canceló. Falla con un mensaje claro si la carpeta no es un respaldo válido.
   */
  restaurar(): Promise<ResultadoRestauracion | null>;
}
