import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { APP_VERSION } from '@core/config/appInfo';
import { MINUTOS_ENTRE_BUSQUEDAS } from '@core/config/env';
import { container } from '@core/di/container';
import { NovedadApp } from '@domain/entities/NovedadApp';
import { ActualizacionDialog, textosDelCartel } from '@presentation/components/ActualizacionDialog';

/** Resultado de una búsqueda pedida por el usuario desde Configuración. */
export type ResultadoBusqueda = { tipo: 'disponible' } | { tipo: 'al-dia' } | { tipo: 'error'; mensaje: string };

type ActualizacionValue = {
  /** Busca una versión nueva y, si hay, muestra el cartel. Para el botón de Configuración. */
  buscarManualmente: () => Promise<ResultadoBusqueda>;
};

const ActualizacionContext = createContext<ActualizacionValue | null>(null);

const MS_ENTRE_BUSQUEDAS = MINUTOS_ENTRE_BUSQUEDAS * 60 * 1000;

/** Identificador de la novedad, para recordar la que el usuario dejó para después. */
const idDeNovedad = (novedad: NovedadApp) =>
  novedad.tipo === 'apk' ? `apk-${novedad.version.version}` : novedad.actualizacion.id;

/**
 * Busca qué hay de nuevo. Primero un APK más nuevo (trae cambios nativos y el código nuevo no le llegaría
 * por aire) y, si no hay, una actualización de código. Los errores de la búsqueda de APK se ignoran:
 * si no hay conexión, la búsqueda de código lo avisa.
 */
async function buscarNovedad(): Promise<NovedadApp | null> {
  const apk = await container.buscarVersionApk.ejecutar().catch(() => null);
  if (apk) return { tipo: 'apk', version: apk };

  const actualizacion = await container.buscarActualizacion.ejecutar();
  return actualizacion ? { tipo: 'codigo', actualizacion } : null;
}

// Busca versiones nuevas sola (al abrir la app y al volver a ella) y muestra el cartel
// "¿Querés actualizar?" sobre cualquier pantalla.
export function ActualizacionProvider({ children }: { children: ReactNode }) {
  const [novedad, setNovedad] = useState<NovedadApp | null>(null);
  const [cartelVisible, setCartelVisible] = useState(false);
  const [instalando, setInstalando] = useState(false);
  const [errorAlInstalar, setErrorAlInstalar] = useState('');
  const ultimaBusquedaRef = useRef(0);
  // Versión que el usuario dejó para después: sola no se vuelve a ofrecer hasta la próxima apertura.
  const versionPostergadaRef = useRef<string | null>(null);

  const buscarSola = useCallback(async () => {
    if (Date.now() - ultimaBusquedaRef.current < MS_ENTRE_BUSQUEDAS) return;
    ultimaBusquedaRef.current = Date.now();

    try {
      const nueva = await buscarNovedad();
      if (nueva && idDeNovedad(nueva) !== versionPostergadaRef.current) {
        setNovedad(nueva);
        setCartelVisible(true);
      }
    } catch {
      // Sin internet o sin configurar: la búsqueda automática no molesta al usuario.
    }
  }, []);

  useEffect(() => {
    buscarSola();
    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') buscarSola();
    });
    return () => suscripcion.remove();
  }, [buscarSola]);

  const buscarManualmente = useCallback(async (): Promise<ResultadoBusqueda> => {
    try {
      const nueva = await buscarNovedad();
      ultimaBusquedaRef.current = Date.now();
      if (!nueva) return { tipo: 'al-dia' };
      setNovedad(nueva);
      setCartelVisible(true);
      return { tipo: 'disponible' };
    } catch (error) {
      return { tipo: 'error', mensaje: error instanceof Error ? error.message : 'No se pudo buscar actualizaciones.' };
    }
  }, []);

  const despues = useCallback(() => {
    versionPostergadaRef.current = novedad ? idDeNovedad(novedad) : null;
    setErrorAlInstalar('');
    setCartelVisible(false);
  }, [novedad]);

  const actualizar = useCallback(async () => {
    if (!novedad || instalando) return;
    setInstalando(true);
    setErrorAlInstalar('');
    try {
      if (novedad.tipo === 'apk') {
        // Descarga el APK y abre el instalador de Android; vuelve acá si el usuario no confirma.
        await container.instalarVersionApk.ejecutar(novedad.version);
      } else {
        // Descarga y reinicia la app: si todo sale bien, esta función no llega a terminar.
        await container.instalarActualizacion.ejecutar();
      }
    } catch (error) {
      setErrorAlInstalar(error instanceof Error ? error.message : 'No se pudo instalar la actualización.');
    } finally {
      setInstalando(false);
    }
  }, [novedad, instalando]);

  const value = useMemo<ActualizacionValue>(() => ({ buscarManualmente }), [buscarManualmente]);

  return (
    <ActualizacionContext.Provider value={value}>
      {children}
      <ActualizacionDialog
        visible={cartelVisible && novedad !== null}
        textos={textosDelCartel(novedad, APP_VERSION)}
        instalando={instalando}
        mensajeError={errorAlInstalar}
        onActualizar={actualizar}
        onDespues={despues}
      />
    </ActualizacionContext.Provider>
  );
}

export function useActualizacion(): ActualizacionValue {
  const contexto = useContext(ActualizacionContext);
  if (!contexto) throw new Error('useActualizacion debe usarse dentro de ActualizacionProvider');
  return contexto;
}
