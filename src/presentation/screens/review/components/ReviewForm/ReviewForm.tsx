import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Factura } from '@domain/entities/Factura';
import { DuplicadoDialog } from '@presentation/components/DuplicadoDialog';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useCategorias } from '@presentation/hooks/useCategorias';
import { useFormularioFactura } from '@presentation/hooks/useFormularioFactura';
import { useGuardarFactura } from '@presentation/hooks/useGuardarFactura';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';
import { colors } from '@presentation/theme';

import { CamposFactura } from '../CamposFactura';
import { styles } from './ReviewForm.styles';

type ReviewFormProps = {
  factura: Factura;
};

/** Revisión de una factura recién leída: se corrige y se guarda por primera vez. */
export function ReviewForm({ factura }: ReviewFormProps) {
  const router = useRouter();
  const { limpiar, discrepancias, avisoLectura } = useFacturaEnCurso();
  const { guardando, duplicado, solicitarGuardado, guardarIgual, cerrarAviso } = useGuardarFactura();
  const formulario = useFormularioFactura(factura);
  const { categorias } = useCategorias();

  const alGuardar = () => {
    const facturaValida = formulario.validar();
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

  return (
    <>
      <CamposFactura
        factura={factura}
        formulario={formulario}
        categoriasDisponibles={categorias}
        discrepancias={discrepancias}
        avisoLectura={avisoLectura}
      />

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
