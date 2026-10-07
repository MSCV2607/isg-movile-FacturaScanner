import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { Factura } from '@domain/entities/Factura';
import { FacturaGuardada } from '@domain/entities/FacturaGuardada';
import { ImagenFactura } from '@domain/entities/ImagenFactura';

type FacturaEnCursoValue = {
  /** Factura que se está revisando (los datos que leyó la IA, ya con las correcciones del usuario). */
  factura: Factura | null;
  /** Fotos originales de la factura, todavía sin guardar. */
  fotos: ImagenFactura[];
  /** Resultado de guardar: la factura guardada, o el motivo por el que no se pudo. */
  guardada: FacturaGuardada | null;
  errorAlGuardar: string | null;
  iniciarRevision: (factura: Factura, fotos: ImagenFactura[]) => void;
  actualizarFactura: (factura: Factura) => void;
  registrarGuardada: (guardada: FacturaGuardada) => void;
  registrarError: (mensaje: string) => void;
  limpiar: () => void;
};

const FacturaEnCursoContext = createContext<FacturaEnCursoValue | null>(null);

// Lleva la factura de pantalla en pantalla (escáner → revisión → resultado).
export function FacturaEnCursoProvider({ children }: { children: ReactNode }) {
  const [factura, setFactura] = useState<Factura | null>(null);
  const [fotos, setFotos] = useState<ImagenFactura[]>([]);
  const [guardada, setGuardada] = useState<FacturaGuardada | null>(null);
  const [errorAlGuardar, setErrorAlGuardar] = useState<string | null>(null);

  const limpiar = useCallback(() => {
    setFactura(null);
    setFotos([]);
    setGuardada(null);
    setErrorAlGuardar(null);
  }, []);

  const iniciarRevision = useCallback((nueva: Factura, fotosNuevas: ImagenFactura[]) => {
    setFactura(nueva);
    setFotos(fotosNuevas);
    setGuardada(null);
    setErrorAlGuardar(null);
  }, []);

  const registrarGuardada = useCallback((nueva: FacturaGuardada) => {
    setGuardada(nueva);
    setErrorAlGuardar(null);
    // Las fotos ya están guardadas en archivos: no hace falta seguir teniéndolas en memoria.
    setFotos([]);
  }, []);

  const value = useMemo<FacturaEnCursoValue>(
    () => ({
      factura,
      fotos,
      guardada,
      errorAlGuardar,
      iniciarRevision,
      actualizarFactura: setFactura,
      registrarGuardada,
      registrarError: setErrorAlGuardar,
      limpiar,
    }),
    [factura, fotos, guardada, errorAlGuardar, iniciarRevision, registrarGuardada, limpiar],
  );

  return <FacturaEnCursoContext.Provider value={value}>{children}</FacturaEnCursoContext.Provider>;
}

export function useFacturaEnCurso(): FacturaEnCursoValue {
  const contexto = useContext(FacturaEnCursoContext);
  if (!contexto) throw new Error('useFacturaEnCurso debe usarse dentro de FacturaEnCursoProvider');
  return contexto;
}
