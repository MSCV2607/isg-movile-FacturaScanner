import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_NAME, APP_VERSION } from '@core/config/appInfo';
import { USUARIO_PROVISORIO } from '@core/config/usuarioProvisorio';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { PurpleHeader } from '@presentation/components/PurpleHeader';
import { useBuscarActualizaciones } from '@presentation/hooks/useBuscarActualizaciones';
import { useApariencia } from '@presentation/hooks/useApariencia';
import { useConfiguracion } from '@presentation/hooks/useConfiguracion';
import { useFacturaEnCurso } from '@presentation/state/FacturaEnCursoContext';
import { logos } from '@presentation/theme';

import { AccountSection } from './components/AccountSection';
import { AiSection } from './components/AiSection';
import { AparienciaSection } from './components/AparienciaSection';
import { DatosSection } from './components/DatosSection';
import { UpdatesSection } from './components/UpdatesSection';
import { styles } from './SettingsScreen.styles';

export function SettingsScreen() {
  const router = useRouter();
  const { limpiar } = useFacturaEnCurso();
  const configuracion = useConfiguracion();
  const actualizaciones = useBuscarActualizaciones();
  const apariencia = useApariencia();

  const guardar = async () => {
    const seGuardo = await configuracion.guardar();
    if (seGuardo) router.back();
  };

  // Ingreso simulado: cerrar sesión vuelve a la pantalla de login.
  const cerrarSesion = () => {
    limpiar();
    router.dismissAll();
    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <PurpleHeader
          title="Configuración"
          subtitle="Lectura con IA y cuenta"
          onBackPress={() => router.back()}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AiSection apiKey={configuracion.apiKeyIa} onApiKeyChange={configuracion.cambiarApiKey} />
        <DatosSection onCategorias={() => router.push('/categorias')} onRespaldo={() => router.push('/respaldo')} />
        <AparienciaSection tema={apariencia.tema} onElegir={apariencia.elegir} />
        <UpdatesSection
          versionActual={APP_VERSION}
          estado={actualizaciones.estado}
          mensajeError={actualizaciones.mensajeError}
          onBuscarPress={actualizaciones.buscar}
        />
        <AccountSection userName={USUARIO_PROVISORIO.nombre} onLogoutPress={cerrarSesion} />

        <View style={styles.about}>
          <Image
            source={logos.intersistemas}
            style={styles.companyLogo}
            resizeMode="contain"
            accessibilityLabel="Intersistemas"
          />
          <Text style={styles.version}>{`${APP_NAME} · versión ${APP_VERSION}`}</Text>
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <View style={styles.footerContent}>
          <PrimaryButton label="Guardar cambios" onPress={guardar} />
        </View>
      </SafeAreaView>
    </View>
  );
}
