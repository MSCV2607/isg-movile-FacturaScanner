import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { container } from '@core/di/container';
import { ErrorEscaner } from '@core/errors/ErrorEscaner';
import { ErrorExtraccion } from '@core/errors/ErrorExtraccion';
import { CapturaFactura } from '@domain/entities/CapturaFactura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';

import { EstadoCaptura } from './estadoCaptura';

/**
 * Abre el escáner de documentos apenas se entra a la pantalla, manda las páginas escaneadas a leer
 * (junto con el QR de ARCA, si lo tenían) y pasa a la revisión. Si el usuario cierra el escáner sin
 * escanear nada, vuelve a la pantalla anterior.
 */
export function useCapturaFactura() {
  const router = useRouter();
  const { iniciarRevision } = useFacturaEnCurso();
  const [estado, setEstado] = useState<EstadoCaptura>('abriendo');
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [cantidadPaginas, setCantidadPaginas] = useState(0);
  const [qrDetectado, setQrDetectado] = useState(false);

  // Lo escaneado se guarda para poder reintentar la lectura sin volver a escanear.
  const capturaRef = useRef<CapturaFactura | null>(null);
  const ocupadoRef = useRef(false);

  async function analizar(captura: CapturaFactura) {
    setEstado('analizando');
    const lectura = await container.leerFactura.ejecutar(captura.imagenes, captura.qr);
    iniciarRevision(lectura, captura.imagenes);
    router.replace('/revision');
  }

  async function escanear() {
    setEstado('abriendo');
    const captura = await container.escanearDocumento.ejecutar();
    if (!captura) {
      router.back();
      return;
    }

    capturaRef.current = captura;
    setCantidadPaginas(captura.imagenes.length);
    setQrDetectado(captura.qr !== null);
    await analizar(captura);
  }

  /** Corre un paso evitando que dos se pisen y dejando el error en pantalla si algo falla. */
  async function correr(paso: () => Promise<void>) {
    if (ocupadoRef.current) return;
    ocupadoRef.current = true;
    setMensajeError(null);
    try {
      await paso();
    } catch (error) {
      const esConocido = error instanceof ErrorEscaner || error instanceof ErrorExtraccion;
      setMensajeError(esConocido ? error.message : 'No se pudo leer la factura. Probá de nuevo.');
      setEstado('error');
    } finally {
      ocupadoRef.current = false;
    }
  }

  /** Vuelve a leer las mismas páginas (sirve cuando falló la IA o la conexión). */
  function reintentar() {
    const captura = capturaRef.current;
    if (!captura) return escanearDeNuevo();
    return correr(() => analizar(captura));
  }

  /** Descarta lo escaneado y abre el escáner otra vez. */
  function escanearDeNuevo() {
    capturaRef.current = null;
    setCantidadPaginas(0);
    setQrDetectado(false);
    return correr(escanear);
  }

  useEffect(() => {
    correr(escanear);
    // Se abre una sola vez al entrar a la pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    estado,
    mensajeError,
    cantidadPaginas,
    qrDetectado,
    reintentar,
    escanearDeNuevo,
  };
}
