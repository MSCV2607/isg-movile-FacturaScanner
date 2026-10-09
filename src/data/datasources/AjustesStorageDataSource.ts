import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE = '@isg-facturascanner/ajustes';

/** Lo que se guarda en el celular, sin interpretar: el repositorio valida y completa lo que falte. */
export interface AjustesGuardadosDto {
  categorias?: unknown;
  topes?: unknown;
}

export class AjustesStorageDataSource {
  async leer(): Promise<AjustesGuardadosDto | null> {
    const texto = await AsyncStorage.getItem(CLAVE);
    if (!texto) return null;
    try {
      return JSON.parse(texto) as AjustesGuardadosDto;
    } catch {
      // Un archivo dañado no debe impedir usar la app: se vuelve a los valores de fábrica.
      return null;
    }
  }

  async guardar(ajustes: AjustesGuardadosDto): Promise<void> {
    await AsyncStorage.setItem(CLAVE, JSON.stringify(ajustes));
  }
}
