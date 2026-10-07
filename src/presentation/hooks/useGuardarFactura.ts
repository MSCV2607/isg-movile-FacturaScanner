import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { container } from '@core/di/container';
import { Factura } from '@domain/entities/Factura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';

/** Guarda la factura (datos y fotos) en el celular y navega a la pantalla de resultado. */
export function useGuardarFactura() {
  const router = useRouter();
  const { fotos, actualizarFactura, registrarGuardada, registrarError } = useFacturaEnCurso();
  const [guardando, setGuardando] = useState(false);
  const enCursoRef = useRef(false);

  async function guardar(factura: Factura) {
    if (enCursoRef.current) return;
    enCursoRef.current = true;
    setGuardando(true);
    actualizarFactura(factura);

    try {
      const guardada = await container.guardarFactura.ejecutar(factura, fotos);
      registrarGuardada(guardada);
      router.replace('/envio-exitoso');
    } catch (error) {
      registrarError(error instanceof Error ? error.message : 'Error desconocido.');
      router.replace('/envio-error');
    } finally {
      enCursoRef.current = false;
      setGuardando(false);
    }
  }

  return { guardando, guardar };
}
