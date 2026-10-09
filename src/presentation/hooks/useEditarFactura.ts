import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { container } from '@core/di/container';
import { Factura } from '@domain/entities/Factura';
import { FacturaGuardada } from '@domain/entities/FacturaGuardada';
import { ResumenFactura } from '@domain/entities/ResumenFactura';

/** Factura que se quiere guardar con datos de un comprobante que ya existe en otra fila. */
export interface AvisoDuplicadoEdicion {
  existente: ResumenFactura;
  nueva: Factura;
}

/** Carga una factura guardada y guarda sus cambios. Avisa si la edición la deja igual a otra ya guardada. */
export function useEditarFactura(id: number) {
  const router = useRouter();
  const [guardada, setGuardada] = useState<FacturaGuardada | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [duplicado, setDuplicado] = useState<AvisoDuplicadoEdicion | null>(null);
  const enCursoRef = useRef(false);

  useEffect(() => {
    let activo = true;
    container.obtenerFacturaGuardada
      .ejecutar(id)
      .then((resultado) => activo && setGuardada(resultado))
      .catch(() => undefined)
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [id]);

  async function persistir(factura: Factura) {
    try {
      await container.actualizarFactura.ejecutar(id, factura);
      router.back();
    } catch (error) {
      Alert.alert('No se pudo guardar', error instanceof Error ? error.message : 'Probá de nuevo.');
    }
  }

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

  /** Busca otro comprobante igual (sin contar esta misma factura); si no hay, guarda. */
  const solicitarGuardado = (factura: Factura) =>
    exclusivo(async () => {
      const existente = await container.buscarFacturaDuplicada.ejecutar(factura, id).catch(() => null);
      if (existente) {
        setDuplicado({ existente, nueva: factura });
        return;
      }
      await persistir(factura);
    });

  const guardarIgual = () => {
    if (!duplicado) return Promise.resolve();
    const { nueva } = duplicado;
    setDuplicado(null);
    return exclusivo(() => persistir(nueva));
  };

  return {
    guardada,
    cargando,
    guardando,
    duplicado,
    solicitarGuardado,
    guardarIgual,
    cerrarAviso: () => setDuplicado(null),
  };
}
