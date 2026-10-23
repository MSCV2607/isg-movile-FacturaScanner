import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_NAME, APP_VERSION } from '@core/config/appInfo';
import { AutocompleteField } from '@presentation/components/AutocompleteField';
import { PasswordField } from '@presentation/components/PasswordField';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { TextField } from '@presentation/components/TextField';
import { useLogin } from '@presentation/hooks/useLogin';
import { logos } from '@presentation/theme';

import { styles } from './LoginScreen.styles';

// Ingreso simulado: todavía no se validan las credenciales, solo se navega al inicio.
export function LoginScreen() {
  const router = useRouter();
  const login = useLogin();

  const ingresar = () => {
    if (login.validar()) router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Image
          source={logos.intersistemas}
          style={styles.companyLogo}
          resizeMode="contain"
          accessibilityLabel="Intersistemas"
        />

        <View style={styles.hero}>
          <Image
            source={logos.facturaScanner}
            style={styles.appLogo}
            resizeMode="contain"
            accessibilityLabel={APP_NAME}
          />
          <Text style={styles.tagline}>Escaneá, revisá y enviá tus facturas.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>
          <AutocompleteField
            label="Empresa"
            placeholder="Elegí o escribí tu empresa"
            value={login.empresa}
            options={login.empresas}
            onChangeText={login.cambiarEmpresa}
            onSelect={login.cambiarEmpresa}
            errorMessage={login.errorEmpresa}
            autoCorrect={false}
          />
          <TextField
            label="Usuario"
            placeholder="tu.usuario"
            autoCapitalize="none"
            autoComplete="username"
          />
          <PasswordField label="Contraseña" placeholder="Tu contraseña" />
          <PrimaryButton label="Ingresar" onPress={ingresar} />
        </View>

        <Text style={styles.version}>{`${APP_NAME} · versión ${APP_VERSION}`}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
