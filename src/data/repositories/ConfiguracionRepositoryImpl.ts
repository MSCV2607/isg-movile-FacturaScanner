import { Configuracion } from '@domain/entities/Configuracion';
import { ConfiguracionRepository } from '@domain/repositories/ConfiguracionRepository';

import { ConfiguracionStorageDataSource } from '../datasources/ConfiguracionStorageDataSource';

const CONFIGURACION_INICIAL: Configuracion = {
  endpointUrl: 'https://api.empresa.com/facturas',
  token: '',
  apiKeyIa: '',
};

export class ConfiguracionRepositoryImpl implements ConfiguracionRepository {
  constructor(private readonly storage: ConfiguracionStorageDataSource) {}

  async obtener(): Promise<Configuracion> {
    try {
      const guardada = await this.storage.leer();
      return { ...CONFIGURACION_INICIAL, ...guardada };
    } catch {
      return CONFIGURACION_INICIAL;
    }
  }

  guardar(configuracion: Configuracion): Promise<void> {
    return this.storage.guardar(configuracion);
  }
}
