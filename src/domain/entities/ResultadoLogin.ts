import { Sesion } from './Sesion';

/** Respuesta de la api auth. Nunca se lanza una excepción: los fallos vuelven con un mensaje para mostrar. */
export type ResultadoLogin =
  | { exito: true; token: string; validoHasta: string }
  | {
      exito: false;
      mensaje: string;
      /** Código del auth cuando el dispositivo no está autorizado (ej.: DISPOSITIVO_NO_APROBADO). */
      codigo?: string;
    };

/** Resultado del ingreso completo (login + guardado de la sesión). */
export type ResultadoIngreso = { exito: true; sesion: Sesion | null } | { exito: false; mensaje: string; codigo?: string };
