import { useState } from 'react';

import { container } from '@core/di/container';

type Resultado = { tipo: 'ok' | 'error'; mensaje: string } | null;

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** Crear un respaldo en una carpeta o restaurar uno que se guardó antes (en este u otro celular). */
export function useRespaldo() {
  const [enCurso, setEnCurso] = useState<'crear' | 'restaurar' | null>(null);
  const [resultado, setResultado] = useState<Resultado>(null);

  async function correr(accion: 'crear' | 'restaurar', paso: () => Promise<string | null>) {
    if (enCurso) return;
    setEnCurso(accion);
    setResultado(null);
    try {
      const mensaje = await paso();
      if (mensaje) setResultado({ tipo: 'ok', mensaje });
    } catch (error) {
      setResultado({ tipo: 'error', mensaje: error instanceof Error ? error.message : 'No se pudo completar la operación.' });
    } finally {
      setEnCurso(null);
    }
  }

  const crear = () =>
    correr('crear', async () => {
      const hecho = await container.crearRespaldo.ejecutar();
      if (!hecho) return null;
      return `Respaldo listo: ${plural(hecho.facturas, 'factura', 'facturas')} y ${plural(hecho.fotos, 'foto', 'fotos')} en una carpeta nueva dentro de la que elegiste.`;
    });

  const restaurar = () =>
    correr('restaurar', async () => {
      const hecho = await container.restaurarRespaldo.ejecutar();
      if (!hecho) return null;
      const partes = [`${plural(hecho.restauradas, 'factura restaurada', 'facturas restauradas')}`];
      if (hecho.repetidas > 0) partes.push(`${plural(hecho.repetidas, 'ya estaba', 'ya estaban')} guardada${hecho.repetidas === 1 ? '' : 's'}`);
      if (hecho.omitidas > 0) partes.push(`${plural(hecho.omitidas, 'se omitió', 'se omitieron')} por datos incompletos`);
      return `${partes.join(' · ')}.`;
    });

  return { enCurso, resultado, crear, restaurar };
}
