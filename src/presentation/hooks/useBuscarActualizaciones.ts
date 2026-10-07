import { useCallback, useState } from 'react';

import { useActualizacion } from '@presentation/state/ActualizacionContext';

export type EstadoBusqueda = 'inicial' | 'buscando' | 'al-dia' | 'disponible' | 'error';

/** Botón "Buscar actualizaciones" de Configuración: busca y avisa el resultado. */
export function useBuscarActualizaciones() {
  const { buscarManualmente } = useActualizacion();
  const [estado, setEstado] = useState<EstadoBusqueda>('inicial');
  const [mensajeError, setMensajeError] = useState('');

  const buscar = useCallback(async () => {
    if (estado === 'buscando') return;
    setEstado('buscando');
    const resultado = await buscarManualmente();
    if (resultado.tipo === 'error') setMensajeError(resultado.mensaje);
    setEstado(resultado.tipo);
  }, [estado, buscarManualmente]);

  return { estado, mensajeError, buscar };
}
