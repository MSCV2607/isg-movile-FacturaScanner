/** No se pudieron leer los datos de la foto. El mensaje es apto para mostrar al usuario. */
export class ErrorExtraccion extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErrorExtraccion';
    Object.setPrototypeOf(this, ErrorExtraccion.prototype);
  }
}
