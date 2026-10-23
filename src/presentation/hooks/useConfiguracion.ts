import { useEffect, useRef, useState } from 'react';

import { container } from '@core/di/container';
import { Configuracion } from '@domain/entities/Configuracion';

export type EstadoConexion = 'inicial' | 'probando' | 'correcta' | 'fallida';

export function useConfiguracion() {
  const [apiKeyIa, setApiKeyIa] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [token, setToken] = useState('');
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>('inicial');
  const [mensajeConexion, setMensajeConexion] = useState('');
  const [cargando, setCargando] = useState(true);
  // Referencia a la configuración cargada, para conservar cualquier dato que esta pantalla no edite.
  const configuracionActual = useRef<Configuracion | null>(null);

  useEffect(() => {
    let activo = true;
    container.obtenerConfiguracion.ejecutar().then((configuracion) => {
      if (!activo) return;
      configuracionActual.current = configuracion;
      setApiKeyIa(configuracion.apiKeyIa);
      setEndpointUrl(configuracion.endpointUrl);
      setToken(configuracion.token);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  // Cambiar la URL o el token invalida el resultado de la última prueba.
  function cambiarEndpointUrl(texto: string) {
    setEndpointUrl(texto);
    setEstadoConexion('inicial');
  }

  function cambiarToken(texto: string) {
    setToken(texto);
    setEstadoConexion('inicial');
  }

  /** Prueba lo que está escrito en pantalla, aunque todavía no se haya guardado. */
  async function probarConexion(): Promise<void> {
    if (endpointUrl.trim() === '') {
      setEstadoConexion('fallida');
      setMensajeConexion('Escribí la URL de la API para probar la conexión');
      return;
    }

    setEstadoConexion('probando');
    const resultado = await container.probarConexion.ejecutar({
      endpointUrl: endpointUrl.trim(),
      token: token.trim(),
      apiKeyIa,
    });
    setMensajeConexion(resultado.mensaje);
    setEstadoConexion(resultado.exito ? 'correcta' : 'fallida');
  }

  async function guardar(): Promise<boolean> {
    if (!configuracionActual.current) return false;
    await container.guardarConfiguracion.ejecutar({
      ...configuracionActual.current,
      apiKeyIa,
      endpointUrl,
      token,
    });
    return true;
  }

  return {
    cargando,
    apiKeyIa,
    cambiarApiKey: setApiKeyIa,
    endpointUrl,
    cambiarEndpointUrl,
    token,
    cambiarToken,
    estadoConexion,
    mensajeConexion,
    probarConexion,
    guardar,
  };
}
