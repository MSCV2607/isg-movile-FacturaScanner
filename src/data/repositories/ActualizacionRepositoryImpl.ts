import { ActualizacionDisponible } from '@domain/entities/ActualizacionDisponible';
import { ActualizacionRepository } from '@domain/repositories/ActualizacionRepository';

import { ActualizacionesDataSource } from '../datasources/ActualizacionesDataSource';

export class ActualizacionRepositoryImpl implements ActualizacionRepository {
  constructor(private readonly dataSource: ActualizacionesDataSource) {}

  async buscar(): Promise<ActualizacionDisponible | null> {
    const consulta = await this.dataSource.consultar();
    return consulta.hayNueva ? { id: consulta.id, publicadaEn: consulta.publicadaEn } : null;
  }

  instalar(): Promise<void> {
    return this.dataSource.descargarYReiniciar();
  }
}
