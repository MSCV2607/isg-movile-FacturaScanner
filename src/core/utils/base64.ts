/** Decodifica base64 (también la variante URL: "-" y "_", con o sin relleno) a texto. */
export function decodificarBase64(texto: string): string {
  const normalizado = texto.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  const relleno = '='.repeat((4 - (normalizado.length % 4)) % 4);
  return atob(normalizado + relleno);
}

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Texto → bytes UTF-8 (sin depender de TextEncoder, que no está en todos los motores). */
export function textoABytesUtf8(texto: string): number[] {
  const bytes: number[] = [];
  for (const caracter of texto) {
    const codigo = caracter.codePointAt(0) as number;
    if (codigo < 0x80) {
      bytes.push(codigo);
    } else if (codigo < 0x800) {
      bytes.push(0xc0 | (codigo >> 6), 0x80 | (codigo & 0x3f));
    } else if (codigo < 0x10000) {
      bytes.push(0xe0 | (codigo >> 12), 0x80 | ((codigo >> 6) & 0x3f), 0x80 | (codigo & 0x3f));
    } else {
      bytes.push(
        0xf0 | (codigo >> 18),
        0x80 | ((codigo >> 12) & 0x3f),
        0x80 | ((codigo >> 6) & 0x3f),
        0x80 | (codigo & 0x3f),
      );
    }
  }
  return bytes;
}

/** Bytes → base64 estándar con relleno. */
export function codificarBase64(bytes: ArrayLike<number>): string {
  let resultado = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const [a, b, c] = [bytes[i], bytes[i + 1], bytes[i + 2]];
    const bloque = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    resultado += ALFABETO[(bloque >> 18) & 63] + ALFABETO[(bloque >> 12) & 63];
    resultado += b === undefined ? '=' : ALFABETO[(bloque >> 6) & 63];
    resultado += c === undefined ? '=' : ALFABETO[bloque & 63];
  }
  return resultado;
}
