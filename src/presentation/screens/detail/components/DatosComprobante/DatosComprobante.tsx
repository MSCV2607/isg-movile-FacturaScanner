import { completarNumero, completarPuntoVenta, formatearFechaIso } from '@core/utils/formatters';
import { Factura } from '@domain/entities/Factura';
import { DetalleFila } from '@presentation/components/DetalleFila';

import { DetailCard } from '../DetailCard';

type DatosComprobanteProps = {
  factura: Factura;
};

export function DatosComprobante({ factura }: DatosComprobanteProps) {
  const tipo = `${factura.tipoComprobante} ${factura.letra}`.trim();

  return (
    <DetailCard>
      <DetalleFila
        etiqueta="Comprobante"
        valor={`${tipo} ${completarPuntoVenta(factura.puntoVenta)}-${completarNumero(factura.numero)}`}
      />
      <DetalleFila etiqueta="Fecha de emisión" valor={formatearFechaIso(factura.fecha)} />
      <DetalleFila etiqueta="Moneda" valor={factura.moneda} />
      {factura.categoria ? <DetalleFila etiqueta="Categoría" valor={factura.categoria} /> : null}
      {factura.medioPago ? <DetalleFila etiqueta="Medio de pago" valor={factura.medioPago} /> : null}
      {factura.notas ? <DetalleFila etiqueta="Notas" valor={factura.notas} /> : null}
    </DetailCard>
  );
}
