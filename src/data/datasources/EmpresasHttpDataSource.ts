import { EmpresaDto } from '../dtos/EmpresaDto';
import { EmpresasDataSource } from './EmpresasDataSource';

const TIEMPO_MAXIMO_MS = 15000;

/** Lee las empresas de la api centralizada (GET /api/Empresas, pública). */
export class EmpresasHttpDataSource implements EmpresasDataSource {
  constructor(private readonly urlBase: string) {}

  async obtener(): Promise<EmpresaDto[]> {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);
    try {
      const respuesta = await fetch(`${this.urlBase.replace(/\/+$/, '')}/api/Empresas`, {
        signal: control.signal,
        headers: { Accept: 'application/json' },
      });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      const datos: unknown = await respuesta.json();
      if (!Array.isArray(datos)) throw new Error('Respuesta inválida');
      return datos as EmpresaDto[];
    } finally {
      clearTimeout(temporizador);
    }
  }
}
