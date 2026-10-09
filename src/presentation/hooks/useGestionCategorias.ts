import { useCallback, useEffect, useState } from 'react';

import { CATEGORIAS_FACTURA } from '@core/config/categorias';
import { container } from '@core/di/container';
import { Ajustes } from '@domain/entities/Ajustes';

const AJUSTES_INICIALES: Ajustes = { categorias: [...CATEGORIAS_FACTURA], topes: {} };

/** Crear, renombrar y borrar rubros, y fijar su tope mensual. Cada acción devuelve el error para mostrarlo, o null si salió bien. */
export function useGestionCategorias() {
  const [ajustes, setAjustes] = useState<Ajustes>(AJUSTES_INICIALES);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    container.gestionarCategorias
      .obtener()
      .then((leidos) => vigente && setAjustes(leidos))
      .catch(() => undefined)
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, []);

  const correr = useCallback(async (accion: () => Promise<Ajustes>): Promise<string | null> => {
    try {
      setAjustes(await accion());
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'No se pudo guardar el cambio.';
    }
  }, []);

  return {
    ajustes,
    cargando,
    agregar: (nombre: string, tope: number | null) => correr(() => container.gestionarCategorias.agregar(nombre, tope)),
    modificar: (anterior: string, nombre: string, tope: number | null) =>
      correr(() => container.gestionarCategorias.modificar(anterior, nombre, tope)),
    eliminar: (nombre: string) => correr(() => container.gestionarCategorias.eliminar(nombre)),
  };
}
