import { Redirect } from 'expo-router';
// TODO: login deshabilitado temporalmente para poder entrar sin registrarse.
// import { LoginScreen } from '@presentation/screens/login';

export default function Index() {
  // return <LoginScreen />;
  return <Redirect href="/home" />;
}
