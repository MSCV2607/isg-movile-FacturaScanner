const SIN_ACENTO: Record<string, string> = {
  á: 'a', à: 'a', ä: 'a', â: 'a',
  é: 'e', è: 'e', ë: 'e', ê: 'e',
  í: 'i', ì: 'i', ï: 'i', î: 'i',
  ó: 'o', ò: 'o', ö: 'o', ô: 'o',
  ú: 'u', ù: 'u', ü: 'u', û: 'u',
  ñ: 'n',
};

/** "Ferretería Ñandú" → "ferreteria nandu": para comparar y buscar sin importar mayúsculas ni tildes. */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .replace(/[áàäâéèëêíìïîóòöôúùüûñ]/g, (letra) => SIN_ACENTO[letra] ?? letra)
    .trim();
}
