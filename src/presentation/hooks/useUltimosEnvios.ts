import { useEffect, useState } from 'react';

import { container } from '@core/di/container';
import { Envio } from '@domain/entities/Envio';

export function useUltimosEnvios() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function cargar() {
      try {
        const resultado = await container.obtenerUltimosEnvios.ejecutar();
        if (isActive) setEnvios(resultado);
      } catch {
        if (isActive) setHasError(true);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    cargar();

    return () => {
      isActive = false;
    };
  }, []);

  return { envios, isLoading, hasError };
}
