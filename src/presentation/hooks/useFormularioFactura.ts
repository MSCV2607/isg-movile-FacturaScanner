import { useEffect, useMemo, useRef, useState } from 'react';

import { container } from '@core/di/container';
import { parsearImporte, soloDigitos } from '@core/utils/parsers';
import { DiferenciaDeTotal } from '@domain/entities/DiferenciaDeTotal';
import { CampoFactura, ErroresFactura, Factura, ItemFactura } from '@domain/entities/Factura';
import { esCuitValido } from '@domain/rules/cuit';
import {
  facturaAFormulario,
  formularioAFactura,
  FormularioFactura,
} from '@presentation/mappers/facturaFormulario';

/** Campos que se pueden completar con lo que se sabe del emisor. */
export type CampoDelHistorial = 'razonSocial' | 'condicionFiscal' | 'categoria';

export function useFormularioFactura(facturaInicial: Factura) {
  const [valores, setValores] = useState<FormularioFactura>(() => facturaAFormulario(facturaInicial));
  const [errores, setErrores] = useState<ErroresFactura>({});
  const [items, setItems] = useState<ItemFactura[]>(facturaInicial.items);
  const [categoria, setCategoria] = useState(facturaInicial.categoria);
  // Campos que se completaron solos con el historial y el usuario todavía no tocó.
  const [delHistorial, setDelHistorial] = useState<CampoDelHistorial[]>([]);

  // Lo último escrito, para que la consulta al historial (asíncrona) decida con valores al día.
  const valoresRef = useRef(valores);
  const categoriaRef = useRef(categoria);
  valoresRef.current = valores;
  categoriaRef.current = categoria;

  const cuit = soloDigitos(valores.cuitEmisor);
  const cuitValido = esCuitValido(cuit);

  // Al escribir un CUIT conocido se completan solo los campos que están vacíos: lo escrito a mano nunca se pisa.
  useEffect(() => {
    if (!cuitValido) return;
    let vigente = true;

    container.buscarEmisorConocido
      .ejecutar(cuit)
      .then((emisor) => {
        if (!vigente || !emisor) return;
        const actuales = valoresRef.current;
        const cambios: Partial<FormularioFactura> = {};
        const completados: CampoDelHistorial[] = [];

        if (actuales.razonSocial.trim() === '' && emisor.razonSocial !== '') {
          cambios.razonSocial = emisor.razonSocial;
          completados.push('razonSocial');
        }
        if (actuales.condicionFiscal.trim() === '' && emisor.condicionFiscal !== '') {
          cambios.condicionFiscal = emisor.condicionFiscal;
          completados.push('condicionFiscal');
        }
        if (categoriaRef.current === '' && emisor.categoria !== '') {
          setCategoria(emisor.categoria);
          completados.push('categoria');
        }

        if (Object.keys(cambios).length > 0) setValores((anteriores) => ({ ...anteriores, ...cambios }));
        if (completados.length > 0) setDelHistorial((anteriores) => [...new Set([...anteriores, ...completados])]);
      })
      // Si el historial no responde, el usuario simplemente completa los campos a mano.
      .catch(() => undefined);

    return () => {
      vigente = false;
    };
  }, [cuit, cuitValido]);

  const quitarMarca = (campo: CampoDelHistorial) => setDelHistorial((actual) => actual.filter((c) => c !== campo));

  const cambiar = (campo: CampoFactura, texto: string) => {
    setValores((actuales) => ({ ...actuales, [campo]: texto }));
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
    if (campo === 'razonSocial' || campo === 'condicionFiscal') quitarMarca(campo);
  };

  const cambiarCategoria = (nueva: string) => {
    setCategoria(nueva);
    quitarMarca('categoria');
  };

  const agregarItem = (item: ItemFactura) => setItems((actuales) => [...actuales, item]);
  const reemplazarItem = (indice: number, item: ItemFactura) =>
    setItems((actuales) => actuales.map((actual, i) => (i === indice ? item : actual)));
  const quitarItem = (indice: number) => setItems((actuales) => actuales.filter((_, i) => i !== indice));

  /** Neto + IVA no da el total: se avisa en el campo Total, sin impedir guardar. */
  const diferenciaDeTotal = useMemo<DiferenciaDeTotal | null>(
    () =>
      container.revisarCoherencia.diferenciaDeTotal({
        importeNeto: parsearImporte(valores.importeNeto),
        importeIva: parsearImporte(valores.importeIva),
        importeTotal: parsearImporte(valores.importeTotal),
      }),
    [valores.importeNeto, valores.importeIva, valores.importeTotal],
  );

  /** Valida lo escrito. Devuelve la factura lista para guardar, o null si hay errores. */
  const validar = (): Factura | null => {
    const factura = formularioAFactura(valores, { ...facturaInicial, items, categoria });
    const erroresDeValidacion = container.validarFactura.ejecutar(factura);
    setErrores(erroresDeValidacion);
    return Object.keys(erroresDeValidacion).length === 0 ? factura : null;
  };

  return {
    valores,
    errores,
    items,
    categoria,
    cuitValido,
    delHistorial,
    diferenciaDeTotal,
    cambiar,
    cambiarCategoria,
    agregarItem,
    reemplazarItem,
    quitarItem,
    validar,
  };
}
