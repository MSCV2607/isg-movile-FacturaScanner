import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatearImporte } from '@core/utils/formatters';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { useGestionCategorias } from '@presentation/hooks/useGestionCategorias';
import { colors } from '@presentation/theme';

import { CategoriaEditorSheet } from './components/CategoriaEditorSheet';
import { styles } from './CategoriesScreen.styles';

/** Rubros de las facturas: crear, renombrar, borrar y fijar un tope mensual a cada uno. */
export function CategoriesScreen() {
  const router = useRouter();
  const gestion = useGestionCategorias();
  // undefined = hoja cerrada; null = categoría nueva; texto = la que se edita.
  const [enEdicion, setEnEdicion] = useState<string | null | undefined>(undefined);
  const { categorias, topes } = gestion.ajustes;

  const guardar = async (nombre: string, tope: number | null) => {
    const error =
      enEdicion === null || enEdicion === undefined
        ? await gestion.agregar(nombre, tope)
        : await gestion.modificar(enEdicion, nombre, tope);
    if (!error) setEnEdicion(undefined);
    return error;
  };

  const pedirEliminar = () => {
    if (!enEdicion) return;
    const nombre = enEdicion;
    Alert.alert(
      `¿Eliminar "${nombre}"?`,
      'Las facturas que ya tienen esta categoría la conservan. Solo deja de ofrecerse al cargar nuevas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const error = await gestion.eliminar(nombre);
            if (error) Alert.alert('No se pudo eliminar', error);
            else setEnEdicion(undefined);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader title="Categorías" subtitle="Rubros y topes mensuales" onBackPress={() => router.back()} />
      </SafeAreaView>

      {gestion.cargando ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {categorias.length === 0 ? (
            <Text style={styles.vacio}>Todavía no tenés categorías. Creá la primera.</Text>
          ) : (
            <View style={styles.lista}>
              {categorias.map((categoria) => (
                <Pressable
                  key={categoria}
                  style={({ pressed }) => [styles.fila, pressed && styles.filaPresionada]}
                  onPress={() => setEnEdicion(categoria)}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${categoria}`}
                >
                  <View style={styles.textos}>
                    <Text style={styles.nombre}>{categoria}</Text>
                    <Text style={styles.tope}>
                      {topes[categoria] ? `Tope: ${formatearImporte(topes[categoria])} por mes` : 'Sin tope'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <View style={styles.footerContent}>
          <PrimaryButton label="Nueva categoría" onPress={() => setEnEdicion(null)} />
        </View>
      </SafeAreaView>

      <CategoriaEditorSheet
        visible={enEdicion !== undefined}
        categoria={enEdicion ?? null}
        topeActual={enEdicion ? (topes[enEdicion] ?? null) : null}
        onGuardar={guardar}
        onEliminar={pedirEliminar}
        onCerrar={() => setEnEdicion(undefined)}
      />
    </View>
  );
}
