/** Decodifica base64 (también la variante URL: "-" y "_", con o sin relleno) a texto. */
export function decodificarBase64(texto: string): string {
  const normalizado = texto.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  const relleno = '='.repeat((4 - (normalizado.length % 4)) % 4);
  return atob(normalizado + relleno);
}
