/** UUID v4 para identificar la instalación de la app. No es criptográfico: solo tiene que ser único. */
export function generarUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (caracter) => {
    const azar = Math.floor(Math.random() * 16);
    const valor = caracter === 'x' ? azar : (azar & 0x3) | 0x8;
    return valor.toString(16);
  });
}
