import { Empresa } from '../entities/Empresa';
import { ResultadoRegistro } from '../entities/ResultadoRegistro';
import { AuthRepository } from '../repositories/AuthRepository';

interface DatosAlta {
  empresa: Empresa;
  nombre: string;
  usuario: string;
  email: string;
  password: string;
}

/**
 * Pide el alta de un usuario en la api auth de la empresa elegida.
 * El usuario no puede ingresar hasta que un administrador lo autorice.
 */
export class RegistrarUsuarioUseCase {
  constructor(private readonly auth: AuthRepository) {}

  async ejecutar({ empresa, nombre, usuario, email, password }: DatosAlta): Promise<ResultadoRegistro> {
    const urlAuth = empresa.urlAuth.trim().replace(/\/+$/, '');
    if (urlAuth === '') {
      return { exito: false, mensaje: 'No hay un servidor de autenticación configurado para esta empresa.' };
    }
    return this.auth.registrar({ urlAuth, nombre, usuario, email, password });
  }
}
