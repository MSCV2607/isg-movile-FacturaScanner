import { EnvioDto } from '@data/dtos/EnvioDto';
import { Envio, EstadoEnvio, LetraComprobante } from '@domain/entities/Envio';

// Se arma la fecha con sus partes para que quede en hora local
// (new Date('2026-10-02') la interpreta en UTC y puede mostrar el día anterior).
function parsearFecha(fechaIso: string): Date {
  const [anio, mes, dia] = fechaIso.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export const envioMapper = {
  toEntity(dto: EnvioDto): Envio {
    return {
      id: dto.id,
      letra: dto.letra as LetraComprobante,
      puntoVenta: dto.punto_venta,
      numero: dto.numero,
      cuitEmisor: dto.cuit_emisor,
      fecha: parsearFecha(dto.fecha),
      importe: dto.importe,
      estado: dto.estado as EstadoEnvio,
    };
  },
};
