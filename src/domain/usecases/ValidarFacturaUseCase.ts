import { CampoFactura, ErroresFactura, Factura } from '../entities/Factura';

const PESOS_CUIT = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

function cuitValido(cuit: string): boolean {
  if (!/^\d{11}$/.test(cuit)) return false;
  const suma = PESOS_CUIT.reduce((total, peso, i) => total + peso * Number(cuit[i]), 0);
  const resto = suma % 11;
  const verificador = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;
  return verificador === Number(cuit[10]);
}

function fechaValida(fechaIso: string): boolean {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaIso);
  if (!partes) return false;
  const [anio, mes, dia] = [Number(partes[1]), Number(partes[2]), Number(partes[3])];
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
}

const esImporte = (valor: number) => Number.isFinite(valor) && valor >= 0;

/** Revisa los datos de la factura (la IA puede equivocarse o dejar campos vacíos). Un error por campo. */
export class ValidarFacturaUseCase {
  ejecutar(factura: Factura): ErroresFactura {
    const errores: ErroresFactura = {};
    const marcar = (campo: CampoFactura, mensaje: string) => {
      errores[campo] = mensaje;
    };

    if (factura.emisor.razonSocial.trim() === '') marcar('razonSocial', 'Falta la razón social.');
    if (!cuitValido(factura.emisor.cuit)) marcar('cuitEmisor', 'El CUIT no es válido.');
    if (factura.emisor.condicionFiscal.trim() === '') marcar('condicionFiscal', 'Falta la condición fiscal.');

    if (!Number.isInteger(factura.puntoVenta) || factura.puntoVenta < 1 || factura.puntoVenta > 99999) {
      marcar('puntoVenta', 'Punto de venta inválido.');
    }
    if (!Number.isInteger(factura.numero) || factura.numero < 1) marcar('numero', 'Número inválido.');
    if (!fechaValida(factura.fecha)) marcar('fecha', 'Usá el formato DD/MM/AAAA.');

    if (!esImporte(factura.importeNeto)) marcar('importeNeto', 'Importe inválido.');
    if (!esImporte(factura.importeIva)) marcar('importeIva', 'Importe inválido.');
    if (!Number.isFinite(factura.importeTotal) || factura.importeTotal <= 0) {
      marcar('importeTotal', 'Ingresá un total mayor a cero.');
    }

    return errores;
  }
}
