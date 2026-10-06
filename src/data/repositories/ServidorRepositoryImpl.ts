import { extraerRuta } from '@core/utils/parsers';
import { Configuracion } from '@domain/entities/Configuracion';
import { Factura } from '@domain/entities/Factura';
import { ResultadoConexion, ResultadoEnvio } from '@domain/entities/ResultadoEnvio';
import { ServidorRepository } from '@domain/repositories/ServidorRepository';

import { ServidorDataSource } from '../datasources/ServidorDataSource';
import { facturaToDto } from '../mappers/facturaMapper';

const SIN_CONEXION = 'Sin conexión con el servidor';

function esCorrecto(codigoHttp: number): boolean {
  return codigoHttp >= 200 && codigoHttp < 300;
}

export class ServidorRepositoryImpl implements ServidorRepository {
  constructor(private readonly dataSource: ServidorDataSource) {}

  async enviarFactura(factura: Factura, configuracion: Configuracion): Promise<ResultadoEnvio> {
    const ruta = extraerRuta(configuracion.endpointUrl);

    try {
      const respuesta = await this.dataSource.enviarFactura(
        configuracion.endpointUrl,
        configuracion.token,
        facturaToDto(factura),
      );
      return {
        exito: esCorrecto(respuesta.codigoHttp),
        codigoHttp: respuesta.codigoHttp,
        textoHttp: respuesta.textoHttp,
        ruta,
      };
    } catch {
      return { exito: false, codigoHttp: null, textoHttp: SIN_CONEXION, ruta };
    }
  }

  async verificarConexion(configuracion: Configuracion): Promise<ResultadoConexion> {
    try {
      const { codigoHttp } = await this.dataSource.verificar(
        configuracion.endpointUrl,
        configuracion.token,
      );
      if (codigoHttp === 401 || codigoHttp === 403) {
        return { exito: false, mensaje: 'El servidor rechazó el token' };
      }
      if (codigoHttp >= 500) {
        return { exito: false, mensaje: `El servidor respondió con error ${codigoHttp}` };
      }
      return { exito: true, mensaje: 'Conexión correcta' };
    } catch {
      return { exito: false, mensaje: 'No se pudo conectar con el servidor' };
    }
  }
}
