const PESOS_CUIT = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

/** Un CUIT tiene 11 dígitos y el último es un verificador que se calcula con los otros diez. */
export function esCuitValido(cuit: string): boolean {
  if (!/^\d{11}$/.test(cuit)) return false;
  const suma = PESOS_CUIT.reduce((total, peso, i) => total + peso * Number(cuit[i]), 0);
  const resto = suma % 11;
  const verificador = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;
  return verificador === Number(cuit[10]);
}
