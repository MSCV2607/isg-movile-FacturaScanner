import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { container } from '@core/di/container';
import { Factura } from '@domain/entities/Factura';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';

/** Factura que ya estaba guardada y la que se quiso guardar encima, a la espera de lo que decida el usuario. */
export interface AvisoDuplicado {
  existente: ResumenFactura;
  nueva: Factura;
}

/**
 * Guarda la factura (datos y fotos) en el celular y navega a la pantalla de resultado.
 * Si el comprobante ya estaba guardado, primero deja que el usuario decida.
 */
export function useGuardarFactura() {
  const router = useRouter();
  const { fotos, actualizarFactura, registrarGuardada, registrarError } = useFacturaEnCurso();
  const [guardando, setGuardando] = useState(false);
  const [duplicado, setDuplicado] = useState<AvisoDuplicado | null>(null);
  const enCursoRef = useRef(false);

  /** Corre un paso evitando que dos se pisen (por ejemplo, un doble toque en "Guardar"). */
  async function exclusivo(paso: () => Promise<void>) {
    if (enCursoRef.current) return;
    enCursoRef.current = true;
    setGuardando(true);
    try {
      await paso();
    } finally {
      enCursoRef.current = false;
      setGuardando(false);
    }
  }

  async function persistir(factura: Factura) {
    actualizarFactura(factura);
    try {
      const guardada = await container.guardarFactura.ejecutar(factura, fotos);
      registrarGuardada(guardada);
      router.replace('/envio-exitoso');
    } catch (error) {
      registrarError(error instanceof Error ? error.message : 'Error desconocido.');
      router.replace('/envio-error');
    }
  }

  /** Guarda sin buscar duplicados (para reintentar un guardado que falló). */
  function guardar(factura: Factura) {
    return exclusivo(() => persistir(factura));
  }

  /** Busca un comprobante igual ya guardado; si no hay, guarda. Si la búsqueda falla, guarda igual. */
  function solicitarGuardado(factura: Factura) {
    return exclusivo(async () => {
      const existente = await container.buscarFacturaDuplicada.ejecutar(factura).catch(() => null);
      if (existente) {
        setDuplicado({ existente, nueva: factura });
        return;
      }
      await persistir(factura);
    });
  }

  /** El usuario confirmó que quiere guardarla aunque ya exista. */
  function guardarIgual() {
    if (!duplicado) return Promise.resolve();
    const { nueva } = duplicado;
    setDuplicado(null);
    return exclusivo(() => persistir(nueva));
  }

  function cerrarAviso() {
    setDuplicado(null);
  }

  return { guardando, duplicado, guardar, solicitarGuardado, guardarIgual, cerrarAviso };
}
