import { textoDeEstadoHttp } from '@core/utils/http';

import { FacturaDto } from '../dtos/FacturaDto';
import { RespuestaHttp, ServidorDataSource } from './ServidorDataSource';

const TIEMPO_MAXIMO_MS = 15000;

export class ServidorHttpDataSource implements ServidorDataSource {
  enviarFactura(url: string, token: string, cuerpo: FacturaDto): Promise<RespuestaHttp> {
    return this.pedir(url, token, { method: 'POST', body: JSON.stringify(cuerpo) });
  }

  verificar(url: string, token: string): Promise<RespuestaHttp> {
    return this.pedir(url, token, { method: 'GET' });
  }

  private async pedir(url: string, token: string, opciones: RequestInit): Promise<RespuestaHttp> {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);

    try {
      const respuesta = await fetch(url, {
        ...opciones,
        signal: control.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return {
        codigoHttp: respuesta.status,
        textoHttp: textoDeEstadoHttp(respuesta.status, respuesta.statusText),
      };
    } finally {
      clearTimeout(temporizador);
    }
  }
}
