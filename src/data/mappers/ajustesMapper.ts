import { CATEGORIAS_FACTURA } from '@core/config/categorias';
import { AjustesGuardadosDto } from '@data/datasources/AjustesStorageDataSource';
import { Ajustes } from '@domain/entities/Ajustes';

/** Rubros de fábrica, para quien nunca tocó las categorías. */
export const categoriasDeFabrica = (): string[] => [...CATEGORIAS_FACTURA];

export const ajustesMapper = {
  /** Acepta lo guardado (o el archivo de un respaldo) y descarta lo que no tenga la forma esperada. */
  toEntity(dto: AjustesGuardadosDto | null | undefined): Ajustes {
    const categorias = Array.isArray(dto?.categorias)
      ? (dto.categorias as unknown[]).filter((c): c is string => typeof c === 'string' && c.trim() !== '')
      : categoriasDeFabrica();

    const topes: Record<string, number> = {};
    if (dto?.topes && typeof dto.topes === 'object') {
      for (const [categoria, valor] of Object.entries(dto.topes as Record<string, unknown>)) {
        if (typeof valor === 'number' && Number.isFinite(valor) && valor > 0) topes[categoria] = valor;
      }
    }
    return { categorias: [...new Set(categorias)], topes };
  },

  toDto(ajustes: Ajustes): AjustesGuardadosDto {
    return { categorias: ajustes.categorias, topes: ajustes.topes };
  },
};
