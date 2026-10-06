import { useEffect, useState } from 'react';

import { container } from '@core/di/container';
import { ErroresConfiguracion } from '@domain/entities/Configuracion';

export type EstadoConexion =
  | { tipo: 'sin-probar' }
  | { tipo: 'probando' }
  | { tipo: 'correcta'; mensaje: string }
  | { tipo: 'fallida'; mensaje: string };

export function useConfiguracion() {
  const [endpointUrl, setEndpointUrl] = useState('');
  const [token, setToken] = useState('');
  const [apiKeyIa, setApiKeyIa] = useState('');
  const [errores, setErrores] = useState<ErroresConfiguracion>({});
  const [conexion, setConexion] = useState<EstadoConexion>({ tipo: 'sin-probar' });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    container.obtenerConfiguracion.ejecutar().then((configuracion) => {
      if (!activo) return;
      setEndpointUrl(configuracion.endpointUrl);
      setToken(configuracion.token);
      setApiKeyIa(configuracion.apiKeyIa);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  // Cambiar un dato invalida la prueba de conexión anterior.
  const cambiarEndpoint = (texto: string) => {
    setEndpointUrl(texto);
    setErrores({});
    setConexion({ tipo: 'sin-probar' });
  };
  const cambiarToken = (texto: string) => {
    setToken(texto);
    setConexion({ tipo: 'sin-probar' });
  };

  const cambiarApiKey = (texto: string) => setApiKeyIa(texto);

  async function probarConexion() {
    setConexion({ tipo: 'probando' });
    const resultado = await container.probarConexion.ejecutar({ endpointUrl, token, apiKeyIa });
    setConexion({ tipo: resultado.exito ? 'correcta' : 'fallida', mensaje: resultado.mensaje });
  }

  /** Devuelve true si se guardó. */
  async function guardar(): Promise<boolean> {
    const erroresDeValidacion = await container.guardarConfiguracion.ejecutar({ endpointUrl, token, apiKeyIa });
    setErrores(erroresDeValidacion);
    return Object.keys(erroresDeValidacion).length === 0;
  }

  return {
    cargando,
    endpointUrl,
    token,
    apiKeyIa,
    errores,
    conexion,
    cambiarEndpoint,
    cambiarToken,
    cambiarApiKey,
    probarConexion,
    guardar,
  };
}
