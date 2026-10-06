import { useState } from 'react';

import { container } from '@core/di/container';
import { CampoFactura, ErroresFactura, Factura } from '@domain/entities/Factura';
import {
  facturaAFormulario,
  formularioAFactura,
  FormularioFactura,
} from '@presentation/mappers/facturaFormulario';

export function useFormularioFactura(facturaInicial: Factura) {
  const [valores, setValores] = useState<FormularioFactura>(() => facturaAFormulario(facturaInicial));
  const [errores, setErrores] = useState<ErroresFactura>({});

  const cambiar = (campo: CampoFactura, texto: string) => {
    setValores((actuales) => ({ ...actuales, [campo]: texto }));
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
  };

  /** Valida lo escrito. Devuelve la factura lista para enviar, o null si hay errores. */
  const validar = (): Factura | null => {
    const factura = formularioAFactura(valores, facturaInicial);
    const erroresDeValidacion = container.validarFactura.ejecutar(factura);
    setErrores(erroresDeValidacion);
    return Object.keys(erroresDeValidacion).length === 0 ? factura : null;
  };

  return { valores, errores, cambiar, validar };
}
