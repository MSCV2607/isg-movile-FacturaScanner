import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE = '@isg-facturascanner/instalacion-id';

export class InstalacionStorageDataSource {
  leerId(): Promise<string | null> {
    return AsyncStorage.getItem(CLAVE);
  }

  guardarId(id: string): Promise<void> {
    return AsyncStorage.setItem(CLAVE, id);
  }
}
