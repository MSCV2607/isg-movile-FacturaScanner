import { ResultadoLogin } from '../entities/ResultadoLogin';
import { ResultadoRegistro } from '../entities/ResultadoRegistro';

export interface DatosLogin {
  urlAuth: string;
  usuario: string;
  password: string;
  instalacionId: string;
  plataforma: string;
}

export interface DatosRegistro {
  urlAuth: string;
  nombre: string;
  usuario: string;
  email: string;
  password: string;
}

export interface AuthRepository {
  iniciarSesion(datos: DatosLogin): Promise<ResultadoLogin>;
  /** Alta de un usuario nuevo: queda pendiente hasta que un administrador lo autorice. */
  registrar(datos: DatosRegistro): Promise<ResultadoRegistro>;
}
