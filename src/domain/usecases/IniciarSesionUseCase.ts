import { Empresa } from '../entities/Empresa';
import { ResultadoIngreso } from '../entities/ResultadoLogin';
import { AuthRepository } from '../repositories/AuthRepository';
import { InstalacionRepository } from '../repositories/InstalacionRepository';
import { SesionRepository } from '../repositories/SesionRepository';

interface DatosIngreso {
  empresa: Empresa;
  usuario: string;
  password: string;
}

/**
 * Ingresa contra la api auth de la empresa elegida, identificando este dispositivo.
 * Sin dirección de auth no se ingresa: nunca se deja pasar sin validar las credenciales.
 */
export class IniciarSesionUseCase {
  constructor(
    private readonly auth: AuthRepository,
    private readonly instalacion: InstalacionRepository,
    private readonly sesion: SesionRepository,
  ) {}

  async ejecutar({ empresa, usuario, password }: DatosIngreso): Promise<ResultadoIngreso> {
    const urlAuth = empresa.urlAuth.trim().replace(/\/+$/, '');
    if (urlAuth === '') {
      return { exito: false, mensaje: 'No hay un servidor de autenticación configurado para esta empresa.' };
    }

    let instalacion;
    try {
      instalacion = await this.instalacion.obtener();
    } catch {
      return { exito: false, mensaje: 'No se pudo identificar este dispositivo. Probá de nuevo.' };
    }

    const resultado = await this.auth.iniciarSesion({
      urlAuth,
      usuario,
      password,
      instalacionId: instalacion.id,
      plataforma: instalacion.plataforma,
    });
    if (!resultado.exito) return resultado;

    const sesion = {
      token: resultado.token,
      validoHasta: resultado.validoHasta,
      empresa: empresa.nombre,
      urlAuth,
      usuario,
    };
    try {
      await this.sesion.guardar(sesion);
    } catch {
      // La sesión sigue siendo válida aunque no se pueda recordar en el celular.
    }
    return { exito: true, sesion };
  }
}
