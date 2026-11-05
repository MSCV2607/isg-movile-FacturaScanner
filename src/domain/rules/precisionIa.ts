import { CampoFactura } from '../entities/Factura';
import { LecturaIaGuardada, ResumenPrecisionIa } from '../entities/RegistroLectura';

/** Cuántos campos se informan como "los que más se corrigen". */
const CAMPOS_A_MOSTRAR = 3;

/** Resume cuánto acierta la lectura con IA: cuántas facturas se guardaron sin tocar nada y qué se corrige más. */
export function resumirPrecisionIa(lecturas: LecturaIaGuardada[]): ResumenPrecisionIa {
  const vecesPorCampo = new Map<CampoFactura, number>();
  let sinCorrecciones = 0;
  let conSegundaPasada = 0;

  for (const lectura of lecturas) {
    if (lectura.camposCorregidos.length === 0) sinCorrecciones += 1;
    if (lectura.segundaPasada) conSegundaPasada += 1;
    for (const campo of lectura.camposCorregidos) {
      vecesPorCampo.set(campo, (vecesPorCampo.get(campo) ?? 0) + 1);
    }
  }

  const camposMasCorregidos = [...vecesPorCampo.entries()]
    .map(([campo, veces]) => ({ campo, veces }))
    .sort((a, b) => b.veces - a.veces)
    .slice(0, CAMPOS_A_MOSTRAR);

  return { lecturas: lecturas.length, sinCorrecciones, conSegundaPasada, camposMasCorregidos };
}
