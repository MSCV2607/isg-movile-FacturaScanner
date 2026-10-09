import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { formatearImporte } from '@core/utils/formatters';
import { CampoFactura, Factura, ItemFactura } from '@domain/entities/Factura';
import { Discrepancia } from '@domain/entities/LecturaFactura';
import { TextField } from '@presentation/components/TextField';
import { useFormularioFactura } from '@presentation/hooks/useFormularioFactura';

import { AvisoLectura } from '../AvisoLectura';
import { CategoriaSelector } from '../CategoriaSelector';
import { ItemEditorSheet } from '../ItemEditorSheet';
import { ItemsFactura } from '../ItemsFactura';
import { MedioPagoSelector } from '../MedioPagoSelector';
import { TEXTOS_REVISION } from '../ReviewForm/ReviewForm.textos';
import { styles } from './CamposFactura.styles';

type CamposFacturaProps = {
  factura: Factura;
  formulario: ReturnType<typeof useFormularioFactura>;
  categoriasDisponibles: string[];
  /** Avisos de la lectura automática; en edición no hay. */
  discrepancias?: Discrepancia[];
  avisoLectura?: string | null;
};

/** Todos los campos editables de una factura. Los comparten la revisión (factura nueva) y la edición (ya guardada). */
export function CamposFactura({
  factura,
  formulario,
  categoriasDisponibles,
  discrepancias = [],
  avisoLectura = null,
}: CamposFacturaProps) {
  const { valores, errores, items, categoria, medioPago, notas, cuitValido, delHistorial, diferenciaDeTotal, cambiar } =
    formulario;
  // null = hoja cerrada; indice = ítem que se edita; -1 = ítem nuevo.
  const [itemEnEdicion, setItemEnEdicion] = useState<number | null>(null);

  /** Si la IA había leído otro valor que el QR, se avisa debajo del campo (se usó el del QR). */
  const notaDe = (campo: CampoFactura): string | undefined => {
    const discrepancia = discrepancias.find((item) => item.campo === campo);
    return discrepancia ? `La IA había leído "${discrepancia.valorIa}". Se usó el dato del QR de ARCA.` : undefined;
  };

  const notaHistorial = (campo: 'razonSocial' | 'condicionFiscal' | 'categoria'): string | undefined =>
    delHistorial.includes(campo) ? TEXTOS_REVISION.deTuHistorial : undefined;

  const avisoTotal = diferenciaDeTotal
    ? TEXTOS_REVISION.totalNoCierra(formatearImporte(diferenciaDeTotal.sumaNetoIva), formatearImporte(diferenciaDeTotal.total))
    : undefined;

  const descripcionComprobante = `${factura.tipoComprobante} ${factura.letra}`.trim();

  const alGuardarItem = (item: ItemFactura) => {
    if (itemEnEdicion === null || itemEnEdicion < 0) formulario.agregarItem(item);
    else formulario.reemplazarItem(itemEnEdicion, item);
    setItemEnEdicion(null);
  };

  const alEliminarItem = () => {
    if (itemEnEdicion !== null && itemEnEdicion >= 0) formulario.quitarItem(itemEnEdicion);
    setItemEnEdicion(null);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {avisoLectura ? <AvisoLectura mensaje={avisoLectura} /> : null}

        <View style={styles.card}>
          <TextField
            label="Razón social"
            value={valores.razonSocial}
            onChangeText={(texto) => cambiar('razonSocial', texto)}
            errorMessage={errores.razonSocial}
            noteMessage={notaHistorial('razonSocial')}
            autoCapitalize="words"
          />
          <TextField
            label="CUIT del emisor"
            value={valores.cuitEmisor}
            onChangeText={(texto) => cambiar('cuitEmisor', texto)}
            errorMessage={errores.cuitEmisor}
            noteMessage={notaDe('cuitEmisor')}
            okMessage={cuitValido ? TEXTOS_REVISION.cuitValido : undefined}
            keyboardType="number-pad"
          />
          <TextField
            label="Condición fiscal"
            value={valores.condicionFiscal}
            onChangeText={(texto) => cambiar('condicionFiscal', texto)}
            errorMessage={errores.condicionFiscal}
            noteMessage={notaHistorial('condicionFiscal')}
          />
          <CategoriaSelector
            categoria={categoria}
            opciones={categoriasDisponibles}
            nota={notaHistorial('categoria')}
            onCambiar={formulario.cambiarCategoria}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.cellWide}>
              <TextField label="Tipo" value={descripcionComprobante} editable={false} />
            </View>
            <View style={styles.cellNarrow}>
              <TextField label="Moneda" value={factura.moneda} editable={false} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.cellNarrow}>
              <TextField
                label="Punto de venta"
                value={valores.puntoVenta}
                onChangeText={(texto) => cambiar('puntoVenta', texto)}
                errorMessage={errores.puntoVenta}
                noteMessage={notaDe('puntoVenta')}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.cellWide}>
              <TextField
                label="Número"
                value={valores.numero}
                onChangeText={(texto) => cambiar('numero', texto)}
                errorMessage={errores.numero}
                noteMessage={notaDe('numero')}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TextField
            label="Fecha de emisión"
            value={valores.fecha}
            onChangeText={(texto) => cambiar('fecha', texto)}
            errorMessage={errores.fecha}
            noteMessage={notaDe('fecha')}
            placeholder="DD/MM/AAAA"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View style={styles.card}>
          <ItemsFactura items={items} onEditar={setItemEnEdicion} onAgregar={() => setItemEnEdicion(-1)} />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <TextField
                label="Neto"
                value={valores.importeNeto}
                onChangeText={(texto) => cambiar('importeNeto', texto)}
                errorMessage={errores.importeNeto}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.cell}>
              <TextField
                label="IVA"
                value={valores.importeIva}
                onChangeText={(texto) => cambiar('importeIva', texto)}
                errorMessage={errores.importeIva}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <TextField
            label="Total"
            value={valores.importeTotal}
            onChangeText={(texto) => cambiar('importeTotal', texto)}
            errorMessage={errores.importeTotal}
            noteMessage={avisoTotal ?? notaDe('importeTotal')}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.card}>
          <MedioPagoSelector medioPago={medioPago} onCambiar={formulario.cambiarMedioPago} />
          <TextField
            label="Notas"
            value={notas}
            onChangeText={formulario.cambiarNotas}
            placeholder="Opcional: para qué fue, con quién, etc."
            multiline
            autoCapitalize="sentences"
          />
        </View>
      </ScrollView>
      <ItemEditorSheet
        visible={itemEnEdicion !== null}
        item={itemEnEdicion !== null && itemEnEdicion >= 0 ? (items[itemEnEdicion] ?? null) : null}
        onGuardar={alGuardarItem}
        onEliminar={alEliminarItem}
        onCerrar={() => setItemEnEdicion(null)}
      />
    </>
  );
}
