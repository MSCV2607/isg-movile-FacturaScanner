import { FacturaDto } from '../dtos/FacturaDto';

export interface RespuestaHttp {
  codigoHttp: number;
  textoHttp: string;
}

/** Lanza un error si no hay respuesta (sin red, tiempo agotado). */
export interface ServidorDataSource {
  enviarFactura(url: string, token: string, cuerpo: FacturaDto): Promise<RespuestaHttp>;
  verificar(url: string, token: string): Promise<RespuestaHttp>;
}
