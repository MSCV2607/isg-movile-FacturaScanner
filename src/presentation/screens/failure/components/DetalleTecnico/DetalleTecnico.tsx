import { Text, View } from 'react-native';

import { ResultadoEnvio } from '@domain/entities/ResultadoEnvio';

import { styles } from './DetalleTecnico.styles';

type DetalleTecnicoProps = {
  resultado: ResultadoEnvio;
};

export function DetalleTecnico({ resultado }: DetalleTecnicoProps) {
  const respuesta = `${resultado.codigoHttp ?? ''} ${resultado.textoHttp}`.trim();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Detalle técnico</Text>
      <Text style={styles.line}>{`POST ${resultado.ruta}`}</Text>
      <Text style={styles.response}>{respuesta}</Text>
    </View>
  );
}
