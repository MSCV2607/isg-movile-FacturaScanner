import { Directory, File, Paths } from 'expo-file-system';
import { isAvailableAsync, shareAsync } from 'expo-sharing';

/** Escribir, copiar y compartir archivos del celular. */
export class ArchivosDataSource {
  /** Abre el selector del sistema para que el usuario elija una carpeta. null si cancela. */
  async elegirCarpeta(): Promise<Directory | null> {
    try {
      return await Directory.pickDirectoryAsync();
    } catch {
      return null;
    }
  }

  guardarBase64EnCarpeta(carpeta: Directory, nombre: string, tipoMime: string, base64: string): void {
    const archivo = carpeta.createFile(nombre, tipoMime);
    archivo.write(base64, { encoding: 'base64' });
  }

  /** Crea una subcarpeta dentro de la que eligió el usuario. */
  crearSubcarpeta(carpeta: Directory, nombre: string): Directory {
    return carpeta.createDirectory(nombre);
  }

  /** Escribe un texto (UTF-8) como archivo dentro de la carpeta. */
  guardarTextoEnCarpeta(carpeta: Directory, nombre: string, tipoMime: string, texto: string): void {
    const archivo = carpeta.createFile(nombre, tipoMime);
    archivo.write(texto);
  }

  /** El archivo o la subcarpeta con ese nombre, o null si no está. */
  buscarEnCarpeta(carpeta: Directory, nombre: string): File | Directory | null {
    return carpeta.list().find((entrada) => entrada.name === nombre) ?? null;
  }

  async leerTexto(archivo: File): Promise<string> {
    return archivo.text();
  }

  async leerBase64(archivo: File): Promise<string> {
    return archivo.base64();
  }

  async copiarACarpeta(carpeta: Directory, origenUri: string, nombre: string, tipoMime: string): Promise<void> {
    const base64 = await new File(origenUri).base64();
    this.guardarBase64EnCarpeta(carpeta, nombre, tipoMime, base64);
  }

  /** Guarda un archivo temporal (se borra cuando el sistema limpia la caché) y devuelve su ruta. */
  guardarTemporal(nombre: string, base64: string): string {
    const archivo = new File(Paths.cache, nombre);
    archivo.create({ overwrite: true });
    archivo.write(base64, { encoding: 'base64' });
    return archivo.uri;
  }

  async compartir(uri: string, tipoMime: string, titulo: string): Promise<void> {
    if (!(await isAvailableAsync())) throw new Error('Este dispositivo no permite compartir archivos.');
    await shareAsync(uri, { mimeType: tipoMime, dialogTitle: titulo });
  }
}
