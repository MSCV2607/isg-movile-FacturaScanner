import { textoDeEstadoHttp } from '@core/utils/http';

import { FacturaDto } from '../dtos/FacturaDto';
import { RespuestaHttp, ServidorDataSource } from './ServidorDataSource';

const DEMORA_MS = 900;

function esperar(milisegundos: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

function responder(codigoHttp: number): RespuestaHttp {
  return { codigoHttp, textoHttp: textoDeEstadoHttp(codigoHttp) };
}

/** Servidor de mentira para probar la app sin endpoint. Ver `USAR_SERVIDOR_SIMULADO`. */
export class ServidorSimuladoDataSource implements ServidorDataSource {
  async enviarFactura(url: string, _token: string, _cuerpo: FacturaDto): Promise<RespuestaHttp> {
    await esperar(DEMORA_MS);
    return responder(url.includes('fallo') ? 503 : 201);
  }

  async verificar(url: string, _token: string): Promise<RespuestaHttp> {
    await esperar(DEMORA_MS);
    return responder(url.includes('fallo') ? 503 : 200);
  }
}
