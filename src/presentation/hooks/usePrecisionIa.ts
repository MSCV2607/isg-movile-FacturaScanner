import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { container } from '@core/di/container';
import { ResumenPrecisionIa } from '@domain/entities/RegistroLectura';

/** Cuánto acierta la lectura con IA según las facturas ya guardadas. null mientras carga o si no se pudo calcular. */
export function usePrecisionIa() {
  const [precision, setPrecision] = useState<ResumenPrecisionIa | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      // Es un dato extra de Configuración: si falla, simplemente no se muestra.
      container.obtenerPrecisionIa
        .ejecutar()
        .then((resumen) => isActive && setPrecision(resumen))
        .catch(() => isActive && setPrecision(null));
      return () => {
        isActive = false;
      };
    }, []),
  );

  return { precision };
}
