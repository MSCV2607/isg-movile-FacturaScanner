import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { container } from '@core/di/container';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { nombreDelMes } from '@domain/rules/periodos';

/** Gasto de un mes (por categoría y por proveedor), con navegación al mes anterior y siguiente. */
export function useResumenMensual() {
  const [hoy] = useState(() => new Date());
  const [mesActual, setMesActual] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() });
  const [facturas, setFacturas] = useState<ResumenFactura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setIsLoading(true);

      container.obtenerFacturasDelPeriodo
        .delMes(mesActual.anio, mesActual.mes)
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
    }, [mesActual]),
  );

  const resumen = useMemo(() => container.resumirPeriodo.ejecutar(facturas), [facturas]);

  const esMesActual = mesActual.anio === hoy.getFullYear() && mesActual.mes === hoy.getMonth();

  const moverMes = (delta: -1 | 1) => {
    const destino = new Date(mesActual.anio, mesActual.mes + delta, 1);
    setMesActual({ anio: destino.getFullYear(), mes: destino.getMonth() });
  };

  return {
    nombreMes: nombreDelMes(mesActual.anio, mesActual.mes),
    resumen,
    isLoading,
    hasError,
    puedeAvanzar: !esMesActual,
    irAlMesAnterior: () => moverMes(-1),
    irAlMesSiguiente: () => moverMes(1),
  };
}
