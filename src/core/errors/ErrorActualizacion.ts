/** No se pudo consultar o abrir la actualización. El mensaje es apto para mostrar al usuario. */
export class ErrorActualizacion extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErrorActualizacion';
    Object.setPrototypeOf(this, ErrorActualizacion.prototype);
  }
}
