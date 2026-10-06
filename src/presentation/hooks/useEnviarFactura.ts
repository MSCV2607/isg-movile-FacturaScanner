import { useRouter } from 'expo-router';
import { useState } from 'react';

import { container } from '@core/di/container';
import { Factura } from '@domain/entities/Factura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';

/** Envía la factura y navega a la pantalla de resultado que corresponda. */
export function useEnviarFactura() {
  const router = useRouter();
  const { guardarFactura, guardarResultado } = useFacturaEnCurso();
  const [enviando, setEnviando] = useState(false);

  async function enviar(factura: Factura) {
    setEnviando(true);
    const resultado = await container.enviarFactura.ejecutar(factura);
    guardarFactura(factura);
    guardarResultado(resultado);
    setEnviando(false);
    router.replace(resultado.exito ? '/envio-exitoso' : '/envio-error');
  }

  return { enviando, enviar };
}
