import { useEffect, useRef, useState } from 'react';

import { container } from '@core/di/container';
import { Configuracion } from '@domain/entities/Configuracion';

export function useConfiguracion() {
  const [apiKeyIa, setApiKeyIa] = useState('');
  const [cargando, setCargando] = useState(true);
  // Los datos de la configuración que esta pantalla no muestra (servidor) se conservan tal cual.
  const configuracionActual = useRef<Configuracion | null>(null);

  useEffect(() => {
    let activo = true;
    container.obtenerConfiguracion.ejecutar().then((configuracion) => {
      if (!activo) return;
      configuracionActual.current = configuracion;
      setApiKeyIa(configuracion.apiKeyIa);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  async function guardar(): Promise<boolean> {
    if (!configuracionActual.current) return false;
    await container.guardarConfiguracion.ejecutar({ ...configuracionActual.current, apiKeyIa });
    return true;
  }

  return { cargando, apiKeyIa, cambiarApiKey: setApiKeyIa, guardar };
}
