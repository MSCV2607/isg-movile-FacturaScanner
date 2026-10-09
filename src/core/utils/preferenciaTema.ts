import Storage from 'expo-sqlite/kv-store';

export type Tema = 'claro' | 'oscuro';

const CLAVE = '@isg-facturascanner/tema';

/**
 * Lectura síncrona: los colores se fijan cuando se carga la app (los estilos se crean una sola vez),
 * así que necesitan saber el tema antes de dibujar la primera pantalla. Si no se puede leer, se usa el claro.
 */
export function leerTema(): Tema {
  try {
    return Storage.getItemSync(CLAVE) === 'oscuro' ? 'oscuro' : 'claro';
  } catch {
    return 'claro';
  }
}

export function guardarTema(tema: Tema): void {
  Storage.setItemSync(CLAVE, tema);
}
