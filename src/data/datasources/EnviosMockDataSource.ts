import { EnvioDto } from '@data/dtos/EnvioDto';

import { EnviosDataSource } from './EnviosDataSource';

// Datos de ejemplo. Se reemplaza por la fuente real (almacenamiento local o API)
// sin tocar el dominio ni la presentación.
const ENVIOS_DE_EJEMPLO: EnvioDto[] = [
  {
    id: '1',
    letra: 'C',
    punto_venta: 4,
    numero: 1234,
    cuit_emisor: '20123456786',
    fecha: '2026-10-02',
    importe: 48500,
    estado: 'enviada',
  },
  {
    id: '2',
    letra: 'B',
    punto_venta: 2,
    numero: 5871,
    cuit_emisor: '30987654321',
    fecha: '2026-10-01',
    importe: 12300.5,
    estado: 'enviada',
  },
  {
    id: '3',
    letra: 'A',
    punto_venta: 1,
    numero: 987,
    cuit_emisor: '33555555559',
    fecha: '2026-09-30',
    importe: 205000,
    estado: 'error',
  },
];

export class EnviosMockDataSource implements EnviosDataSource {
  async obtenerUltimos(cantidad: number): Promise<EnvioDto[]> {
    return ENVIOS_DE_EJEMPLO.slice(0, cantidad);
  }
}
