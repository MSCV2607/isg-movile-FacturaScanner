import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatearImporte } from '@core/utils/formatters';
import { CampoFactura, Factura, ItemFactura } from '@domain/entities/Factura';
import { DuplicadoDialog } from '@presentation/components/DuplicadoDialog';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { TextField } from '@presentation/components/TextField';
import { useFormularioFactura } from '@presentation/hooks/useFormularioFactura';
import { useGuardarFactura } from '@presentation/hooks/useGuardarFactura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';
import { colors } from '@presentation/theme';

import { AvisoLectura } from '../AvisoLectura';
import { CategoriaSelector } from '../CategoriaSelector';
import { ItemEditorSheet } from '../ItemEditorSheet';
import { ItemsFactura } from '../ItemsFactura';
import { styles } from './ReviewForm.styles';
import { TEXTOS_REVISION } from './ReviewForm.textos';

type ReviewFormProps = {
  factura: Factura;
};

export function ReviewForm({ factura }: ReviewFormProps) {
  const router = useRouter();
  const { limpiar, discrepancias, avisoLectura } = useFacturaEnCurso();
  const { guardando, duplicado, solicitarGuardado, guardarIgual, cerrarAviso } = useGuardarFactura();
  const formulario = useFormularioFactura(factura);
  const { valores, errores, items, categoria, cuitValido, delHistorial, diferenciaDeTotal, cambiar, validar } = formulario;
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

  const alGuardar = () => {
    const facturaValida = validar();
    if (facturaValida) solicitarGuardado(facturaValida);
  };

  const alDescartar = () => {
    limpiar();
    router.replace('/home');
  };

  const alVerGuardada = () => {
    if (!duplicado) return;
    const { id } = duplicado.existente;
    cerrarAviso();
    router.push({ pathname: '/detalle/[id]', params: { id: String(id) } });
  };

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
      </ScrollView>

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <View style={styles.footerRow}>
          <View style={styles.footerSecondary}>
            <SecondaryButton label="Descartar" onPress={alDescartar} />
          </View>
          <View style={styles.footerPrimary}>
            <PrimaryButton
              label="Guardar factura"
              onPress={alGuardar}
              loading={guardando}
              rightIcon={<Ionicons name="checkmark" size={18} color={colors.onPrimary} />}
            />
          </View>
        </View>
      </SafeAreaView>

      <ItemEditorSheet
        visible={itemEnEdicion !== null}
        item={itemEnEdicion !== null && itemEnEdicion >= 0 ? (items[itemEnEdicion] ?? null) : null}
        onGuardar={alGuardarItem}
        onEliminar={alEliminarItem}
        onCerrar={() => setItemEnEdicion(null)}
      />

      <DuplicadoDialog
        visible={duplicado !== null}
        nueva={duplicado?.nueva ?? null}
        existente={duplicado?.existente ?? null}
        onVerGuardada={alVerGuardada}
        onGuardarIgual={guardarIgual}
        onVolver={cerrarAviso}
      />
    </>
  );
}
