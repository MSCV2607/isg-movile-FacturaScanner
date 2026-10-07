import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Factura } from '@domain/entities/Factura';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { TextField } from '@presentation/components/TextField';
import { useFormularioFactura } from '@presentation/hooks/useFormularioFactura';
import { useGuardarFactura } from '@presentation/hooks/useGuardarFactura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';
import { colors } from '@presentation/theme';

import { ItemsFactura } from '../ItemsFactura';
import { styles } from './ReviewForm.styles';

type ReviewFormProps = {
  factura: Factura;
};

export function ReviewForm({ factura }: ReviewFormProps) {
  const router = useRouter();
  const { limpiar } = useFacturaEnCurso();
  const { guardando, guardar } = useGuardarFactura();
  const { valores, errores, cambiar, validar } = useFormularioFactura(factura);

  const descripcionComprobante = `${factura.tipoComprobante} ${factura.letra}`.trim();

  const alGuardar = () => {
    const facturaValida = validar();
    if (facturaValida) guardar(facturaValida);
  };

  const alDescartar = () => {
    limpiar();
    router.replace('/home');
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.card}>
          <TextField
            label="Razón social"
            value={valores.razonSocial}
            onChangeText={(texto) => cambiar('razonSocial', texto)}
            errorMessage={errores.razonSocial}
            autoCapitalize="words"
          />
          <TextField
            label="CUIT del emisor"
            value={valores.cuitEmisor}
            onChangeText={(texto) => cambiar('cuitEmisor', texto)}
            errorMessage={errores.cuitEmisor}
            keyboardType="number-pad"
          />
          <TextField
            label="Condición fiscal"
            value={valores.condicionFiscal}
            onChangeText={(texto) => cambiar('condicionFiscal', texto)}
            errorMessage={errores.condicionFiscal}
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
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.cellWide}>
              <TextField
                label="Número"
                value={valores.numero}
                onChangeText={(texto) => cambiar('numero', texto)}
                errorMessage={errores.numero}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TextField
            label="Fecha de emisión"
            value={valores.fecha}
            onChangeText={(texto) => cambiar('fecha', texto)}
            errorMessage={errores.fecha}
            placeholder="DD/MM/AAAA"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View style={styles.card}>
          <ItemsFactura items={factura.items} />
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
    </>
  );
}
