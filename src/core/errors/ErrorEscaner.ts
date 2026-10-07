/** No se pudo abrir o completar el escáner de documentos. El mensaje es apto para mostrar al usuario. */
export class ErrorEscaner extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErrorEscaner';
    Object.setPrototypeOf(this, ErrorEscaner.prototype);
  }
}
