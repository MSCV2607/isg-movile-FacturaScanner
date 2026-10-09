import { useEffect, useMemo, useState } from 'react';

import { container } from '@core/di/container';
import { FormatoReporte, TipoReporte } from '@domain/entities/ReportePeriodo';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { Periodo } from '@domain/rules/periodos';

type Resultado = { tipo: 'ok' | 'error'; mensaje: string } | null;

/** Elegir período, formato y fotos para exportar las facturas guardadas, y generar el archivo. */
export function useExportarPeriodo(periodoInicial: Periodo = 'mes') {
  const [periodo, setPeriodo] = useState<Periodo>(periodoInicial);
  const [formato, setFormato] = useState<FormatoReporte>('xlsx');
  const [tipo, setTipo] = useState<TipoReporte>('listado');
  const [conFotos, setConFotos] = useState(false);
  const [facturas, setFacturas] = useState<ResumenFactura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [resultado, setResultado] = useState<Resultado>(null);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setResultado(null);

    container.obtenerFacturasDelPeriodo
      .ejecutar(periodo)
      .then((lista) => isActive && setFacturas(lista))
      .catch(() => isActive && setResultado({ tipo: 'error', mensaje: 'No se pudieron cargar las facturas.' }))
      .finally(() => isActive && setIsLoading(false));

    return () => {
      isActive = false;
    };
  }, [periodo]);

  const resumen = useMemo(() => container.resumirPeriodo.ejecutar(facturas), [facturas]);

  async function correr(paso: () => Promise<string | null>) {
    if (exportando) return;
    setExportando(true);
    setResultado(null);
    try {
      const mensaje = await paso();
      if (mensaje) setResultado({ tipo: 'ok', mensaje });
    } catch (error) {
      setResultado({
        tipo: 'error',
        mensaje: error instanceof Error ? error.message : 'No se pudo generar el archivo.',
      });
    } finally {
      setExportando(false);
    }
  }

  const reporte = () => container.exportarPeriodo.armarReporte(periodo, facturas, tipo);

  /** Abre el menú del sistema para mandar el archivo por WhatsApp, correo, Drive, etc. */
  const compartir = () =>
    correr(async () => {
      await container.exportarPeriodo.compartir(await reporte(), formato);
      return null;
    });

  /** Pide una carpeta y guarda ahí el archivo (y las fotos, si se eligieron). */
  const guardarEnCarpeta = () =>
    correr(async () => {
      const { guardado, fotosCopiadas } = await container.exportarPeriodo.guardar(await reporte(), formato, conFotos);
      if (!guardado) return null;
      return conFotos
        ? `Listado guardado con ${fotosCopiadas} ${fotosCopiadas === 1 ? 'foto' : 'fotos'} en la carpeta Fotos.`
        : 'Listado guardado en la carpeta que elegiste.';
    });

  return {
    periodo,
    setPeriodo,
    formato,
    setFormato,
    tipo,
    // El Libro IVA no existe en PDF: si estaba elegido, se pasa a Excel.
    setTipo: (nuevo: TipoReporte) => {
      setTipo(nuevo);
      if (nuevo === 'libroIva' && formato === 'pdf') setFormato('xlsx');
    },
    conFotos,
    setConFotos,
    cantidad: facturas.length,
    resumen,
    isLoading,
    exportando,
    resultado,
    compartir,
    guardarEnCarpeta,
  };
}
