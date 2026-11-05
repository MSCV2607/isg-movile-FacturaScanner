/** Respuesta del alta de usuario. Nunca se lanza una excepción: los fallos vuelven con un mensaje para mostrar. */
export type ResultadoRegistro = { exito: true; mensaje: string } | { exito: false; mensaje: string };
