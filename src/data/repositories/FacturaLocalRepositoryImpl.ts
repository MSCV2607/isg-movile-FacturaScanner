import { facturaGuardadaMapper } from '@data/mappers/facturaGuardadaMapper';
import { EmisorConocido } from '@domain/entities/EmisorConocido';
import { Factura } from '@domain/entities/Factura';
import { FacturaGuardada } from '@domain/entities/FacturaGuardada';
import { ImagenFactura } from '@domain/entities/ImagenFactura';
import { RangoFechas } from '@domain/entities/RangoFechas';
import { ResumenFactura } from '@domain/entities/ResumenFactura';
import { FacturaLocalRepository } from '@domain/repositories/FacturaLocalRepository';

import { FacturasLocalesDataSource } from '../datasources/FacturasLocalesDataSource';
import { FotosLocalesDataSource } from '../datasources/FotosLocalesDataSource';

export class FacturaLocalRepositoryImpl implements FacturaLocalRepository {
  constructor(
    private readonly baseDeDatos: FacturasLocalesDataSource,
    private readonly fotos: FotosLocalesDataSource,
  ) {}

  async guardar(factura: Factura, imagenes: ImagenFactura[]): Promise<FacturaGuardada> {
    const creadaEn = new Date();
    const id = await this.baseDeDatos.insertar(facturaGuardadaMapper.toNuevaDto(factura, creadaEn));

    // Los datos y las fotos son dos medios distintos (base y archivos): si las fotos fallan se deshace todo.
    try {
      const rutas = this.fotos.guardar(id, imagenes);
      await this.baseDeDatos.agregarFotos(id, rutas);
      return {
        id,
        creadaEn,
        factura,
        fotos: rutas.map((ruta) => this.fotos.resolverUri(ruta)),
      };
    } catch (error) {
      this.fotos.eliminar(id);
      await this.baseDeDatos.eliminar(id);
      throw error;
    }
  }

  async obtenerUltimas(cantidad: number): Promise<ResumenFactura[]> {
    const filas = await this.baseDeDatos.obtenerUltimas(cantidad);
    return filas.map(facturaGuardadaMapper.toResumen);
  }

  async obtenerTodas(rango: RangoFechas): Promise<ResumenFactura[]> {
    const filas = await this.baseDeDatos.obtenerTodas(rango.desde, rango.hasta);
    return filas.map(facturaGuardadaMapper.toResumen);
  }

  async buscarPorComprobante(cuit: string, puntoVenta: number, numero: number): Promise<ResumenFactura[]> {
    const filas = await this.baseDeDatos.buscarPorComprobante(cuit, puntoVenta, numero);
    return filas.map(facturaGuardadaMapper.toResumen);
  }

  async buscarUltimoEmisor(cuit: string): Promise<EmisorConocido | null> {
    const fila = await this.baseDeDatos.obtenerUltimaDeEmisor(cuit);
    return fila ? facturaGuardadaMapper.toEmisorConocido(fila) : null;
  }

  async obtener(id: number): Promise<FacturaGuardada | null> {
    const completa = await this.baseDeDatos.obtener(id);
    if (!completa) return null;

    const uris = completa.fotos.map((foto) => this.fotos.resolverUri(foto.ruta));
    return facturaGuardadaMapper.toEntity(completa.fila, completa.items, uris);
  }
}
