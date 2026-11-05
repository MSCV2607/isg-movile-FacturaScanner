import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AutocompleteField } from '@presentation/components/AutocompleteField';
import { PasswordField } from '@presentation/components/PasswordField';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { TextField } from '@presentation/components/TextField';
import { useRegistro } from '@presentation/hooks/useRegistro';

import { styles } from './RegistroScreen.styles';

// Alta de usuario: para ingresar, un administrador de la empresa tiene que aprobar el dispositivo.
export function RegistroScreen() {
  const router = useRouter();
  const registro = useRegistro();

  const volver = () => router.replace('/');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crear cuenta</Text>

          {registro.mensajeExito !== '' ? (
            <>
              <Text style={styles.mensajeExito}>{registro.mensajeExito}</Text>
              <PrimaryButton label="Volver al inicio" onPress={volver} />
            </>
          ) : (
            <>
              <Text style={styles.ayuda}>
                Después de crear la cuenta, ingresá una vez: un administrador tiene que aprobar tu dispositivo antes de que puedas usar la app.
              </Text>
              <AutocompleteField
                label="Empresa"
                placeholder="Elegí o escribí tu empresa"
                value={registro.empresa}
                options={registro.empresas}
                onChangeText={registro.cambiarEmpresa}
                onSelect={registro.cambiarEmpresa}
                errorMessage={registro.errorEmpresa}
                autoCorrect={false}
              />
              <TextField
                label="Nombre y apellido"
                placeholder="Tu nombre"
                autoComplete="name"
                value={registro.nombre}
                onChangeText={registro.cambiarNombre}
                errorMessage={registro.errorNombre}
              />
              <TextField
                label="Usuario"
                placeholder="tu.usuario"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                value={registro.usuario}
                onChangeText={registro.cambiarUsuario}
                errorMessage={registro.errorUsuario}
              />
              <TextField
                label="Correo electrónico"
                placeholder="tu@correo.com"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                value={registro.email}
                onChangeText={registro.cambiarEmail}
                errorMessage={registro.errorEmail}
              />
              <PasswordField
                label="Contraseña"
                placeholder="Al menos 6 caracteres"
                value={registro.password}
                onChangeText={registro.cambiarPassword}
                errorMessage={registro.errorPassword}
              />
              <PasswordField
                label="Repetir contraseña"
                placeholder="Repetí la contraseña"
                value={registro.repetir}
                onChangeText={registro.cambiarRepetir}
                errorMessage={registro.errorRepetir}
              />
              {registro.errorGeneral !== '' ? <Text style={styles.errorGeneral}>{registro.errorGeneral}</Text> : null}
              <PrimaryButton label="Registrarme" onPress={registro.registrar} loading={registro.enviando} />
              <Pressable onPress={volver} style={styles.volver} accessibilityRole="button">
                <Text style={styles.volverTexto}>Ya tengo cuenta</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
