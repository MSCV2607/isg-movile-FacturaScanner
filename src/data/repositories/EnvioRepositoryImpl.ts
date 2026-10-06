import { EnviosDataSource } from '@data/datasources/EnviosDataSource';
import { envioMapper } from '@data/mappers/envioMapper';
import { Envio } from '@domain/entities/Envio';
import { EnvioRepository } from '@domain/repositories/EnvioRepository';

export class EnvioRepositoryImpl implements EnvioRepository {
  constructor(private readonly dataSource: EnviosDataSource) {}

  async obtenerUltimos(cantidad: number): Promise<Envio[]> {
    const dtos = await this.dataSource.obtenerUltimos(cantidad);
    return dtos.map(envioMapper.toEntity);
  }
}
