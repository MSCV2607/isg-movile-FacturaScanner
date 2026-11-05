import AsyncStorage from '@react-native-async-storage/async-storage';

import { Sesion } from '@domain/entities/Sesion';

const CLAVE = '@isg-facturascanner/sesion';

export class SesionStorageDataSource {
  guardar(sesion: Sesion): Promise<void> {
    return AsyncStorage.setItem(CLAVE, JSON.stringify(sesion));
  }
}
