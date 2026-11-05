import { ResultadoLogin } from '@domain/entities/ResultadoLogin';
import { ResultadoRegistro } from '@domain/entities/ResultadoRegistro';
import { AuthRepository, DatosLogin, DatosRegistro } from '@domain/repositories/AuthRepository';

import { AuthHttpDataSource } from '../datasources/AuthHttpDataSource';

type Json = Record<string, unknown>;

/** El auth responde en camelCase o PascalCase según el caso (éxito o error). */
function leer(cuerpo: unknown, ...claves: string[]): unknown {
  if (typeof cuerpo !== 'object' || cuerpo === null) return undefined;
  const objeto = cuerpo as Json;
  for (const clave of claves) if (objeto[clave] !== undefined) return objeto[clave];
  return undefined;
}

function codigoDelDetalle(detalle: unknown): string | undefined {
  if (typeof detalle !== 'string') return undefined;
  try {
    const codigo = leer(JSON.parse(detalle), 'codigo', 'Codigo', 'code', 'Code');
    return typeof codigo === 'string' ? codigo : undefined;
  } catch {
    return undefined;
  }
}

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: AuthHttpDataSource) {}

  async iniciarSesion(datos: DatosLogin): Promise<ResultadoLogin> {
    let respuesta;
    try {
      respuesta = await this.dataSource.login(datos.urlAuth, {
        usuario: datos.usuario,
        password: datos.password,
        instalacionId: datos.instalacionId,
        plataforma: datos.plataforma,
      });
    } catch {
      return { exito: false, mensaje: 'No se pudo conectar con el servidor de tu empresa. Revisá tu conexión.' };
    }

    if (respuesta.codigoHttp >= 200 && respuesta.codigoHttp < 300) {
      const token = leer(respuesta.cuerpo, 'token', 'Token');
      const validoHasta = leer(respuesta.cuerpo, 'validTo', 'ValidTo');
      if (typeof token === 'string' && token !== '') {
        return { exito: true, token, validoHasta: typeof validoHasta === 'string' ? validoHasta : '' };
      }
      return { exito: false, mensaje: 'El servidor respondió algo inesperado. Probá de nuevo.' };
    }

    const mensaje = leer(respuesta.cuerpo, 'mensaje', 'Mensaje');
    const codigo = codigoDelDetalle(leer(respuesta.cuerpo, 'details', 'Details'));
    return {
      exito: false,
      mensaje: typeof mensaje === 'string' && mensaje !== '' ? mensaje : mensajePorEstado(respuesta.codigoHttp),
      codigo,
    };
  }

  async registrar(datos: DatosRegistro): Promise<ResultadoRegistro> {
    let respuesta;
    try {
      respuesta = await this.dataSource.registrar(datos.urlAuth, {
        userName: datos.usuario,
        nombre: datos.nombre,
        email: datos.email,
        password: datos.password,
        confirmPassword: datos.password,
      });
    } catch {
      return { exito: false, mensaje: 'No se pudo conectar con el servidor de tu empresa. Revisá tu conexión.' };
    }

    if (respuesta.codigoHttp >= 200 && respuesta.codigoHttp < 300) {
      const texto = typeof respuesta.cuerpo === 'string' && respuesta.cuerpo !== '' ? respuesta.cuerpo : '';
      return {
        exito: true,
        mensaje: texto || 'Registro recibido. Ingresá una vez con tu usuario: un administrador tiene que aprobar tu dispositivo antes de que puedas usar la app.',
      };
    }

    const mensaje = leer(respuesta.cuerpo, 'mensaje', 'Mensaje');
    return {
      exito: false,
      mensaje:
        typeof mensaje === 'string' && mensaje !== ''
          ? mensaje
          : respuesta.codigoHttp === 404
            ? 'No se encontró el servidor de tu empresa.'
            : `No se pudo registrar (error ${respuesta.codigoHttp}).`,
    };
  }
}

function mensajePorEstado(codigo: number): string {
  if (codigo === 401) return 'Usuario o contraseña incorrectos.';
  if (codigo === 403) return 'Este dispositivo no está autorizado para ingresar.';
  if (codigo === 404) return 'No se encontró el servidor de tu empresa.';
  return `No se pudo ingresar (error ${codigo}).`;
}
