import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Factura } from '@domain/entities/Factura';
import { DuplicadoDialog } from '@presentation/components/DuplicadoDialog';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { SecondaryButton } from '@presentation/components/SecondaryButton';
import { useCategorias } from '@presentation/hooks/useCategorias';
import { useEditarFactura } from '@presentation/hooks/useEditarFactura';
import { useFormularioFactura } from '@presentation/hooks/useFormularioFactura';
import { colors } from '@presentation/theme';

import { CamposFactura } from '../review/components/CamposFactura';
import { styles } from './EditScreen.styles';

type FormularioEdicionProps = {
  factura: Factura;
  editar: ReturnType<typeof useEditarFactura>;
};

function FormularioEdicion({ factura, editar }: FormularioEdicionProps) {
  const router = useRouter();
  const formulario = useFormularioFactura(factura, { autocompletar: false });
  const { categorias } = useCategorias();

  const alGuardar = () => {
    const valida = formulario.validar();
    if (valida) editar.solicitarGuardado(valida);
  };

  const alVerGuardada = () => {
    if (!editar.duplicado) return;
    const { id } = editar.duplicado.existente;
    editar.cerrarAviso();
    router.push({ pathname: '/detalle/[id]', params: { id: String(id) } });
  };

  return (
    <>
      <CamposFactura factura={factura} formulario={formulario} categoriasDisponibles={categorias} />

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <View style={styles.footerRow}>
          <View style={styles.footerSecondary}>
            <SecondaryButton label="Cancelar" onPress={() => router.back()} />
          </View>
          <View style={styles.footerPrimary}>
            <PrimaryButton
              label="Guardar cambios"
              onPress={alGuardar}
              loading={editar.guardando}
              rightIcon={<Ionicons name="checkmark" size={18} color={colors.onPrimary} />}
            />
          </View>
        </View>
      </SafeAreaView>

      <DuplicadoDialog
        visible={editar.duplicado !== null}
        nueva={editar.duplicado?.nueva ?? null}
        existente={editar.duplicado?.existente ?? null}
        onVerGuardada={alVerGuardada}
        onGuardarIgual={editar.guardarIgual}
        onVolver={editar.cerrarAviso}
      />
    </>
  );
}

/** Corrige una factura ya guardada (datos, ítems, rubro, medio de pago y notas). Las fotos no cambian. */
export function EditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const editar = useEditarFactura(Number(id));

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader title="Editar factura" subtitle="Corregí lo que haga falta" showDot onBackPress={() => router.back()} />
      </SafeAreaView>

      {editar.cargando ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : !editar.guardada ? (
        <View style={styles.centered}>
          <Text style={styles.message}>No se pudo cargar la factura.</Text>
          <SecondaryButton label="Volver" onPress={() => router.back()} />
        </View>
      ) : (
        <FormularioEdicion factura={editar.guardada.factura} editar={editar} />
      )}
    </View>
  );
}
