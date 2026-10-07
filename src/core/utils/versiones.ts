/**
 * Compara dos versiones del tipo "1.2.0" número por número ("1.10.0" es mayor que "1.9.0").
 * Devuelve un número positivo si `a` es más nueva, negativo si lo es `b`, y 0 si son iguales.
 */
export function compararVersiones(a: string, b: string): number {
  const partesA = a.split('.').map(Number);
  const partesB = b.split('.').map(Number);
  const largo = Math.max(partesA.length, partesB.length);

  for (let i = 0; i < largo; i++) {
    const diferencia = (partesA[i] ?? 0) - (partesB[i] ?? 0);
    if (diferencia !== 0) return diferencia;
  }
  return 0;
}
