import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { Factura } from '@domain/entities/Factura';
import { ResultadoEnvio } from '@domain/entities/ResultadoEnvio';

type FacturaEnCursoValue = {
  /** Factura que se está escaneando / revisando / enviando. */
  factura: Factura | null;
  /** Resultado del último intento de envío. */
  resultado: ResultadoEnvio | null;
  guardarFactura: (factura: Factura) => void;
  guardarResultado: (resultado: ResultadoEnvio) => void;
  limpiar: () => void;
};

const FacturaEnCursoContext = createContext<FacturaEnCursoValue | null>(null);

// Lleva la factura de pantalla en pantalla (escáner → revisión → resultado).
export function FacturaEnCursoProvider({ children }: { children: ReactNode }) {
  const [factura, setFactura] = useState<Factura | null>(null);
  const [resultado, setResultado] = useState<ResultadoEnvio | null>(null);

  const limpiar = useCallback(() => {
    setFactura(null);
    setResultado(null);
  }, []);

  const value = useMemo<FacturaEnCursoValue>(
    () => ({ factura, resultado, guardarFactura: setFactura, guardarResultado: setResultado, limpiar }),
    [factura, resultado, limpiar],
  );

  return <FacturaEnCursoContext.Provider value={value}>{children}</FacturaEnCursoContext.Provider>;
}

export function useFacturaEnCurso(): FacturaEnCursoValue {
  const contexto = useContext(FacturaEnCursoContext);
  if (!contexto) throw new Error('useFacturaEnCurso debe usarse dentro de FacturaEnCursoProvider');
  return contexto;
}
