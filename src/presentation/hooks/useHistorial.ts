import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { container } from '@core/di/container';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { filtrarPorTexto } from '@domain/rules/busqueda';
import { Periodo } from '@domain/rules/periodos';

/** Historial completo de facturas guardadas, con búsqueda por texto y filtro por período. */
export function useHistorial(periodoInicial: Periodo = 'todo') {
  const [periodo, setPeriodo] = useState<Periodo>(periodoInicial);
  const [texto, setTexto] = useState('');
  const [facturas, setFacturas] = useState<ResumenFactura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Se vuelve a leer al cambiar de período y cada vez que la pantalla vuelve a mostrarse (por ejemplo, tras guardar una).
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      container.obtenerFacturasDelPeriodo
        .ejecutar(periodo)
        .then((resultado) => {
          if (!isActive) return;
          setFacturas(resultado);
          setHasError(false);
        })
        .catch(() => isActive && setHasError(true))
        .finally(() => isActive && setIsLoading(false));

      return () => {
        isActive = false;
      };
    }, [periodo]),
  );

  const visibles = useMemo(() => filtrarPorTexto(facturas, texto), [facturas, texto]);
  const resumen = useMemo(() => container.resumirPeriodo.ejecutar(visibles), [visibles]);

  const hayFiltros = texto.trim() !== '' || periodo !== 'todo';

  function limpiarFiltros() {
    setTexto('');
    setPeriodo('todo');
  }

  return { periodo, setPeriodo, texto, setTexto, visibles, resumen, isLoading, hasError, hayFiltros, limpiarFiltros };
}
