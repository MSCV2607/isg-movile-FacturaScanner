import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Alert } from 'react-native';

import { guardarTema, Tema } from '@core/utils/preferenciaTema';
import { tema as temaActual } from '@presentation/theme';

/** Claro u oscuro. Los colores se fijan al abrir la app, así que cambiar de tema la reinicia. */
export function useApariencia() {
  const [tema, setTema] = useState<Tema>(temaActual);

  async function elegir(nuevo: Tema) {
    if (nuevo === tema) return;
    setTema(nuevo);
    try {
      guardarTema(nuevo);
      await Updates.reloadAsync();
    } catch {
      // Sin poder reiniciar sola (por ejemplo, en desarrollo), queda guardado para la próxima vez que se abra.
      Alert.alert('Tema guardado', 'Cerrá y volvé a abrir la app para ver el cambio.');
    }
  }

  return { tema, elegir };
}
