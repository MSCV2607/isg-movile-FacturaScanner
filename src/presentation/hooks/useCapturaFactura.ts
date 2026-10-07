import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { container } from '@core/di/container';
import { ErrorExtraccion } from '@core/errors/ErrorExtraccion';
import { DatosQrArca } from '@domain/entities/DatosQrArca';
import { ImagenFactura } from '@domain/entities/ImagenFactura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';

import { ModoEscaneo } from './modoEscaneo';

// Calidad intermedia: el texto se lee bien y varias fotos juntas siguen siendo livianas.
const CALIDAD_FOTO = 0.5;
// Cada cuánto se saca una foto en modo automático (da tiempo a bajar un tramo del ticket).
const PAUSA_ENTRE_FOTOS_MS = 1200;
export const MAXIMO_FOTOS = 10;

const esperar = (milisegundos: number) => new Promise<void>((resolver) => setTimeout(resolver, milisegundos));

/**
 * Saca una o varias fotos de la factura (un ticket largo se recorre de a tramos) y, mientras tanto,
 * detecta el QR de ARCA. Las fotos se mandan a leer juntas, se combinan con el QR y se pasa a la revisión.
 */
export function useCapturaFactura() {
  const router = useRouter();
  const { iniciarRevision } = useFacturaEnCurso();
  const [permiso, pedirPermiso] = useCameraPermissions();
  const camaraRef = useRef<CameraView>(null);
  const [linterna, setLinterna] = useState(false);
  const [modo, setModo] = useState<ModoEscaneo>('automatico');
  const [cantidadFotos, setCantidadFotos] = useState(0);
  const [automaticoActivo, setAutomaticoActivo] = useState(false);
  const [analizando, setAnalizando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [qrDetectado, setQrDetectado] = useState(false);

  // Las fotos viven en una referencia: el ciclo automático las agrega sin esperar a un nuevo render.
  const fotosRef = useRef<ImagenFactura[]>([]);
  // QR de ARCA detectado mientras la cámara está abierta (si se ve más de uno, queda el último).
  const qrRef = useRef<DatosQrArca | null>(null);
  const automaticoRef = useRef(false);
  const fotoEnCursoRef = useRef<Promise<void>>(Promise.resolve());
  const analizandoRef = useRef(false);
  // Cambia al reiniciar: una foto que estaba en camino de la captura anterior se descarta.
  const capturaRef = useRef(0);

  function detenerAutomatico() {
    automaticoRef.current = false;
    setAutomaticoActivo(false);
  }

  async function sacarFoto() {
    if (!camaraRef.current) return;
    const captura = capturaRef.current;
    const foto = await camaraRef.current.takePictureAsync({
      base64: true,
      quality: CALIDAD_FOTO,
      shutterSound: false,
    });
    if (captura !== capturaRef.current) return;
    if (!foto.base64) throw new ErrorExtraccion('No se pudo sacar la foto. Probá de nuevo.');
    fotosRef.current.push({ base64: foto.base64, tipoMime: 'image/jpeg' });
    setCantidadFotos(fotosRef.current.length);
  }

  /** Saca una foto y la espera; si falla, deja el mensaje de error en pantalla. */
  async function sacarFotoSegura(): Promise<boolean> {
    const pendiente = sacarFoto();
    fotoEnCursoRef.current = pendiente.catch(() => undefined);
    try {
      await pendiente;
      return true;
    } catch (error) {
      detenerAutomatico();
      setMensajeError(error instanceof ErrorExtraccion ? error.message : 'No se pudo sacar la foto.');
      return false;
    }
  }

  /** La cámara avisa cada vez que ve un QR: se queda con el de una factura de ARCA. */
  function alLeerCodigo(resultado: BarcodeScanningResult) {
    if (analizandoRef.current) return;
    const qr = container.leerQrFactura.ejecutar(resultado.data);
    if (!qr) return;

    const anterior = qrRef.current;
    const esIgual = anterior?.cuit === qr.cuit && anterior.puntoVenta === qr.puntoVenta && anterior.numero === qr.numero;
    if (esIgual) return;
    qrRef.current = qr;
    setQrDetectado(true);
  }

  async function analizar() {
    analizandoRef.current = true;
    setMensajeError(null);
    setAnalizando(true);

    try {
      const lectura = await container.leerFactura.ejecutar(fotosRef.current, qrRef.current);
      iniciarRevision(lectura, [...fotosRef.current]);
      router.replace('/revision');
    } catch (error) {
      setMensajeError(
        error instanceof ErrorExtraccion ? error.message : 'No se pudo analizar la factura. Probá de nuevo.',
      );
      analizandoRef.current = false;
      setAnalizando(false);
    }
  }

  /** Cierra la captura (espera la foto que esté en curso) y manda a leer todas las fotos. */
  async function terminar() {
    if (analizandoRef.current) return;
    detenerAutomatico();
    await fotoEnCursoRef.current;
    if (fotosRef.current.length === 0 || analizandoRef.current) return;
    await analizar();
  }

  /** Modo manual: agrega una foto; al llegar al máximo, termina sola. */
  async function sacarFotoManual() {
    if (analizando || automaticoRef.current) return;
    setMensajeError(null);
    const salioBien = await sacarFotoSegura();
    if (salioBien && fotosRef.current.length >= MAXIMO_FOTOS) await terminar();
  }

  /** Modo automático: saca fotos solas, una cada tanto, hasta que se toca Terminar. */
  async function iniciarAutomatico() {
    if (analizando || automaticoRef.current) return;
    setMensajeError(null);
    automaticoRef.current = true;
    setAutomaticoActivo(true);

    while (automaticoRef.current && fotosRef.current.length < MAXIMO_FOTOS) {
      if (!(await sacarFotoSegura())) return;
      await esperar(PAUSA_ENTRE_FOTOS_MS);
    }

    // Si el ciclo terminó por llegar al máximo (y no porque se tocó Terminar), se analiza igual.
    if (automaticoRef.current) await terminar();
  }

  /** Descarta las fotos sacadas y vuelve al estado inicial. */
  function reiniciar() {
    detenerAutomatico();
    capturaRef.current += 1;
    fotosRef.current = [];
    qrRef.current = null;
    setQrDetectado(false);
    setCantidadFotos(0);
    setMensajeError(null);
  }

  return {
    camaraRef,
    permiso,
    pedirPermiso,
    linterna,
    alternarLinterna: () => setLinterna((actual) => !actual),
    modo,
    cambiarModo: setModo,
    cantidadFotos,
    automaticoActivo,
    analizando,
    mensajeError,
    qrDetectado,
    alLeerCodigo,
    sacarFotoManual,
    iniciarAutomatico,
    terminar,
    reiniciar,
  };
}
