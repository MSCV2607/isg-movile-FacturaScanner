import { Ajustes } from '../entities/Ajustes';
import { AjustesRepository } from '../repositories/AjustesRepository';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';
import { validarNombreCategoria, validarTope } from '../rules/categorias';

/**
 * Crear, renombrar y borrar rubros, y fijar su tope mensual. Los errores de validación llegan como
 * `Error` con un mensaje listo para mostrar al usuario.
 */
export class GestionarCategoriasUseCase {
  constructor(
    private readonly ajustes: AjustesRepository,
    private readonly facturas: FacturaLocalRepository,
  ) {}

  obtener(): Promise<Ajustes> {
    return this.ajustes.obtener();
  }

  async agregar(nombre: string, tope: number | null): Promise<Ajustes> {
    const actuales = await this.ajustes.obtener();
    const limpio = nombre.trim();
    this.validar(limpio, tope, actuales.categorias);

    return this.guardar({
      categorias: [...actuales.categorias, limpio],
      topes: this.conTope(actuales.topes, limpio, tope),
    });
  }

  /** Cambia el nombre y el tope de un rubro. Si cambia el nombre, también se corrige en las facturas que lo usan. */
  async modificar(anterior: string, nombre: string, tope: number | null): Promise<Ajustes> {
    const actuales = await this.ajustes.obtener();
    const limpio = nombre.trim();
    this.validar(limpio, tope, actuales.categorias, anterior);

    if (limpio !== anterior) await this.facturas.renombrarCategoria(anterior, limpio);

    const topes = { ...actuales.topes };
    delete topes[anterior];
    return this.guardar({
      categorias: actuales.categorias.map((categoria) => (categoria === anterior ? limpio : categoria)),
      topes: this.conTope(topes, limpio, tope),
    });
  }

  /** Quita el rubro de la lista y su tope. Las facturas que ya lo tienen conservan el nombre. */
  async eliminar(nombre: string): Promise<Ajustes> {
    const actuales = await this.ajustes.obtener();
    const topes = { ...actuales.topes };
    delete topes[nombre];
    return this.guardar({ categorias: actuales.categorias.filter((categoria) => categoria !== nombre), topes });
  }

  private validar(nombre: string, tope: number | null, existentes: string[], actual?: string): void {
    const error = validarNombreCategoria(nombre, existentes, actual) ?? validarTope(tope);
    if (error) throw new Error(error);
  }

  private conTope(topes: Record<string, number>, nombre: string, tope: number | null): Record<string, number> {
    const siguiente = { ...topes };
    if (tope === null) delete siguiente[nombre];
    else siguiente[nombre] = tope;
    return siguiente;
  }

  private async guardar(ajustes: Ajustes): Promise<Ajustes> {
    await this.ajustes.guardar(ajustes);
    return ajustes;
  }
}
