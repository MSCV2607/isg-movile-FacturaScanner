const TIEMPO_MAXIMO_MS = 15000;

export interface CuerpoLogin {
  usuario: string;
  password: string;
  instalacionId: string;
  plataforma: string;
}

export interface CuerpoRegistro {
  userName: string;
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RespuestaAuth {
  codigoHttp: number;
  /** JSON de la respuesta, o null si venía vacía o no era JSON. */
  cuerpo: unknown;
}

/** Llama al login de la api auth con apiMode "scanner" (valida el dispositivo). Lanza un error si no hay respuesta. */
export class AuthHttpDataSource {
  async login(urlAuth: string, cuerpo: CuerpoLogin): Promise<RespuestaAuth> {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);
    try {
      const respuesta = await fetch(`${urlAuth}/api/Auth/Login`, {
        method: 'POST',
        signal: control.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          apiMode: 'scanner',
        },
        body: JSON.stringify(cuerpo),
      });
      const texto = await respuesta.text();
      let json: unknown = null;
      try {
        json = texto ? JSON.parse(texto) : null;
      } catch {
        json = null;
      }
      return { codigoHttp: respuesta.status, cuerpo: json };
    } finally {
      clearTimeout(temporizador);
    }
  }

  /** Alta de un usuario por su cuenta. Lanza un error si no hay respuesta. */
  async registrar(urlAuth: string, cuerpo: CuerpoRegistro): Promise<RespuestaAuth> {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);
    try {
      const respuesta = await fetch(`${urlAuth}/api/Auth/Registrar`, {
        method: 'POST',
        signal: control.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          apiMode: 'scanner',
        },
        body: JSON.stringify(cuerpo),
      });
      const texto = await respuesta.text();
      let json: unknown = null;
      try {
        json = texto ? JSON.parse(texto) : null;
      } catch {
        json = texto || null;
      }
      return { codigoHttp: respuesta.status, cuerpo: json };
    } finally {
      clearTimeout(temporizador);
    }
  }
}
