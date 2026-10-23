import { useState } from 'react';

import { EMPRESAS_PROVISORIAS } from '@core/config/empresasProvisorias';
import { normalizarTexto } from '@domain/rules/texto';

/** Estado del formulario de ingreso. Por ahora solo se valida que la empresa sea una de la lista. */
export function useLogin() {
  const [empresa, setEmpresa] = useState('');
  const [errorEmpresa, setErrorEmpresa] = useState('');

  function cambiarEmpresa(texto: string) {
    setEmpresa(texto);
    setErrorEmpresa('');
  }

  /** Devuelve `true` si se puede continuar. */
  function validar(): boolean {
    const buscada = normalizarTexto(empresa);
    const empresaElegida = EMPRESAS_PROVISORIAS.find((nombre) => normalizarTexto(nombre) === buscada);

    if (!empresaElegida) {
      setErrorEmpresa(buscada === '' ? 'Elegí tu empresa' : 'Elegí una empresa de la lista');
      return false;
    }
    setEmpresa(empresaElegida);
    return true;
  }

  return { empresa, cambiarEmpresa, errorEmpresa, empresas: EMPRESAS_PROVISORIAS, validar };
}
