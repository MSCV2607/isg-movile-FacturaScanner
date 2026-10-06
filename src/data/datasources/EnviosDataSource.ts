import { EnvioDto } from '@data/dtos/EnvioDto';

export interface EnviosDataSource {
  obtenerUltimos(cantidad: number): Promise<EnvioDto[]>;
}
