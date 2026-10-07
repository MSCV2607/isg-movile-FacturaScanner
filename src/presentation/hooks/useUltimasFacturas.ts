import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { container } from '@core/di/container';
import { ResumenFactura } from '@domain/entities/ResumenFactura';

/** Las últimas facturas guardadas. Se vuelve a leer cada vez que la pantalla se muestra. */
export function useUltimasFacturas() {
  const [facturas, setFacturas] = useState<ResumenFactura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      container.obtenerUltimasFacturas
        .ejecutar()
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
    }, []),
  );

  return { facturas, isLoading, hasError };
}
