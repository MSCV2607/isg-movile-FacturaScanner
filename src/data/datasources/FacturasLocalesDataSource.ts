import { FacturaFilaDto, FotoFilaDto, ItemFilaDto, NuevaFacturaDto } from '../dtos/FacturaGuardadaDto';

export interface FacturaCompletaDto {
  fila: FacturaFilaDto;
  items: ItemFilaDto[];
  fotos: FotoFilaDto[];
}

/** Base de datos local de facturas. */
export interface FacturasLocalesDataSource {
  /** Inserta la factura con sus ítems y devuelve su id. */
  insertar(factura: NuevaFacturaDto): Promise<number>;
  agregarFotos(facturaId: number, rutas: string[]): Promise<void>;
  eliminar(facturaId: number): Promise<void>;
  obtenerUltimas(cantidad: number): Promise<FacturaFilaDto[]>;
  obtener(facturaId: number): Promise<FacturaCompletaDto | null>;
}
