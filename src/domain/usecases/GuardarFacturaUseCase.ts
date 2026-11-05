import { Factura } from '../entities/Factura';
import { FacturaGuardada } from '../entities/FacturaGuardada';
import { ImagenFactura } from '../entities/ImagenFactura';
import { RegistroLectura } from '../entities/RegistroLectura';
import { FacturaLocalRepository } from '../repositories/FacturaLocalRepository';
import { correccionesDeLectura } from '../rules/correccionesLectura';

/**
 * Guarda en el celular la factura revisada por el usuario, junto con sus fotos.
 * Si se conoce cómo la leyó la IA, deja anotado qué datos corrigió el usuario (para medir la precisión).
 */
export class GuardarFacturaUseCase {
  constructor(private readonly facturas: FacturaLocalRepository) {}

  async ejecutar(factura: Factura, fotos: ImagenFactura[], lectura: RegistroLectura | null = null): Promise<FacturaGuardada> {
    const guardada = await this.facturas.guardar(factura, fotos);

    if (lectura) {
      // El registro es solo estadístico: si falla, la factura ya quedó guardada y el usuario no tiene por qué enterarse.
      await this.facturas
        .registrarLecturaIa(guardada.id, lectura, correccionesDeLectura(lectura.mostrada, factura))
        .catch(() => undefined);
    }

    return guardada;
  }
}
