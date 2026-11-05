export type Tema = 'claro' | 'oscuro';

const CLAVE = '@isg-facturascanner/tema';

interface AlmacenSincrono {
  getItemSync(clave: string): string | null;
  setItemSync(clave: string, valor: string): void;
}

/**
 * El módulo nativo de SQLite se pide recién al usarlo y dentro de un try: si no existe
 * (por ejemplo en Expo Go) la app igual abre, con el tema claro.
 */
function almacen(): AlmacenSincrono {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('expo-sqlite/kv-store').default as AlmacenSincrono;
}

/**
 * Lectura síncrona: los colores se fijan cuando se carga la app (los estilos se crean una sola vez),
 * así que necesitan saber el tema antes de dibujar la primera pantalla. Si no se puede leer, se usa el claro.
 */
export function leerTema(): Tema {
  try {
    return almacen().getItemSync(CLAVE) === 'oscuro' ? 'oscuro' : 'claro';
  } catch {
    return 'claro';
  }
}

export function guardarTema(tema: Tema): void {
  try {
    almacen().setItemSync(CLAVE, tema);
  } catch {
    // Sin el módulo nativo no se puede recordar el tema; la app sigue funcionando.
  }
}
