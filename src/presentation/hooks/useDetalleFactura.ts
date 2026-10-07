import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { container } from '@core/di/container';
import { FacturaGuardada } from '@domain/entities/FacturaGuardada';

type Accion = 'excel' | 'fotos' | 'compartir';

/** Carga una factura guardada y expone las acciones del detalle (Excel, fotos, compartir). */
export function useDetalleFactura(id: number) {
  const [factura, setFactura] = useState<FacturaGuardada | null>(null);
  const [cargando, setCargando] = useState(true);
  const [hayError, setHayError] = useState(false);
  const [accionEnCurso, setAccionEnCurso] = useState<Accion | null>(null);
  const [verFotos, setVerFotos] = useState(false);

  useEffect(() => {
    let activo = true;

    container.obtenerFacturaGuardada
      .ejecutar(id)
      .then((resultado) => activo && setFactura(resultado))
      .catch(() => activo && setHayError(true))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [id]);

  async function ejecutar(accion: Accion, tarea: () => Promise<void>, falla: string) {
    if (accionEnCurso) return;
    setAccionEnCurso(accion);
    try {
      await tarea();
    } catch (error) {
      Alert.alert(falla, error instanceof Error ? error.message : 'Probá de nuevo.');
    } finally {
      setAccionEnCurso(null);
    }
  }

  const exportarExcel = () =>
    ejecutar(
      'excel',
      async () => {
        if (!factura) return;
        if (await container.exportarFactura.excel(factura)) {
          Alert.alert('Excel guardado', 'El archivo quedó en la carpeta que elegiste.');
        }
      },
      'No se pudo exportar',
    );

  const descargarFotos = () =>
    ejecutar(
      'fotos',
      async () => {
        if (!factura) return;
        const cantidad = await container.exportarFactura.fotos(factura);
        if (cantidad > 0) {
          Alert.alert('Fotos guardadas', `Se copiaron ${cantidad} ${cantidad === 1 ? 'foto' : 'fotos'} a la carpeta que elegiste.`);
        }
      },
      'No se pudieron descargar las fotos',
    );

  const compartir = () =>
    ejecutar(
      'compartir',
      async () => {
        if (factura) await container.exportarFactura.compartir(factura);
      },
      'No se pudo compartir',
    );

  // El envío automático por correo todavía no existe: por ahora solo se muestra el aviso.
  const avisarProximamente = () =>
    Alert.alert('Próximamente', 'El envío de la factura por correo va a estar disponible en una próxima versión.');

  return {
    factura,
    cargando,
    hayError,
    accionEnCurso,
    verFotos,
    abrirFotos: () => setVerFotos(true),
    cerrarFotos: () => setVerFotos(false),
    exportarExcel,
    descargarFotos,
    compartir,
    avisarProximamente,
  };
}
