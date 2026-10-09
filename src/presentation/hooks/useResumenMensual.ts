import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { container } from '@core/di/container';
import { TotalMensual } from '@domain/entities/TotalMensual';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { variacionPorcentual } from '@domain/rules/evolucion';
import { nombreDelMes } from '@domain/rules/periodos';

export const MESES_EVOLUCION = 6;

/** Gasto de un mes (por categoría y por proveedor), con navegación al mes anterior y siguiente. */
export function useResumenMensual() {
  const [hoy] = useState(() => new Date());
  const [mesActual, setMesActual] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() });
  const [facturas, setFacturas] = useState<ResumenFactura[]>([]);
  const [topes, setTopes] = useState<Record<string, number>>({});
  const [evolucion, setEvolucion] = useState<TotalMensual[]>([]);
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

      // Topes y evolución son un extra: si fallan, el resumen del mes se muestra igual.
      container.obtenerAjustes
        .ejecutar()
        .then((ajustes) => isActive && setTopes(ajustes.topes))
        .catch(() => undefined);
      container.obtenerEvolucionMensual
        .ejecutar(mesActual, MESES_EVOLUCION)
        .then((meses) => isActive && setEvolucion(meses))
        .catch(() => isActive && setEvolucion([]));

      return () => {
        isActive = false;
      };
    }, [mesActual]),
  );

  const resumen = useMemo(() => container.resumirPeriodo.ejecutar(facturas, topes), [facturas, topes]);

  // Cuánto cambió el mes elegido respecto del anterior (la evolución termina en el mes elegido).
  const variacion =
    evolucion.length >= 2 ? variacionPorcentual(evolucion[evolucion.length - 1].total, evolucion[evolucion.length - 2].total) : null;

  const esMesActual = mesActual.anio === hoy.getFullYear() && mesActual.mes === hoy.getMonth();

  const moverMes = (delta: -1 | 1) => {
    const destino = new Date(mesActual.anio, mesActual.mes + delta, 1);
    setMesActual({ anio: destino.getFullYear(), mes: destino.getMonth() });
  };

  return {
    nombreMes: nombreDelMes(mesActual.anio, mesActual.mes),
    resumen,
    evolucion,
    variacion,
    mesActual,
    isLoading,
    hasError,
    puedeAvanzar: !esMesActual,
    irAlMesAnterior: () => moverMes(-1),
    irAlMesSiguiente: () => moverMes(1),
  };
}
