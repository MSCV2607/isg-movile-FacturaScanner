import AsyncStorage from '@react-native-async-storage/async-storage';

import { Configuracion } from '@domain/entities/Configuracion';

const CLAVE = '@isg-facturascanner/configuracion';

export class ConfiguracionStorageDataSource {
  async leer(): Promise<Partial<Configuracion> | null> {
    const texto = await AsyncStorage.getItem(CLAVE);
    return texto ? (JSON.parse(texto) as Partial<Configuracion>) : null;
  }

  async guardar(configuracion: Configuracion): Promise<void> {
    await AsyncStorage.setItem(CLAVE, JSON.stringify(configuracion));
  }
}
