import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { CATEGORIAS_FACTURA } from '@core/config/categorias';
import { container } from '@core/di/container';
import { Ajustes } from '@domain/entities/Ajustes';

const AJUSTES_INICIALES: Ajustes = { categorias: [...CATEGORIAS_FACTURA], topes: {} };

/** Rubros y topes del usuario. Se vuelven a leer cada vez que la pantalla toma el foco. */
export function useCategorias() {
  const [ajustes, setAjustes] = useState<Ajustes>(AJUSTES_INICIALES);

  useFocusEffect(
    useCallback(() => {
      let vigente = true;
      container.obtenerAjustes
        .ejecutar()
        .then((leidos) => vigente && setAjustes(leidos))
        // Sin ajustes legibles, quedan los rubros de fábrica.
        .catch(() => undefined);
      return () => {
        vigente = false;
      };
    }, []),
  );

  return ajustes;
}
