import { DatosQrArca } from './DatosQrArca';
import { ImagenFactura } from './ImagenFactura';

/** Lo que se captura de una factura: sus páginas y, si tenía, los datos exactos del QR de ARCA. */
export interface CapturaFactura {
  imagenes: ImagenFactura[];
  qr: DatosQrArca | null;
}
