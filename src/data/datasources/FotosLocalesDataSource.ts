import { Directory, File, Paths } from 'expo-file-system';

import { ImagenFactura } from '@domain/entities/ImagenFactura';

const CARPETA_RAIZ = 'facturas';

/** Guarda las fotos originales como archivos dentro de la carpeta privada de la app. */
export class FotosLocalesDataSource {
  /** Escribe las fotos de la factura y devuelve sus rutas relativas (las que se guardan en la base). */
  guardar(facturaId: number, imagenes: ImagenFactura[]): string[] {
    const carpeta = new Directory(Paths.document, CARPETA_RAIZ, String(facturaId));
    carpeta.create({ intermediates: true, idempotent: true });

    return imagenes.map((imagen, indice) => {
      const nombre = `foto-${indice + 1}.${imagen.tipoMime === 'image/png' ? 'png' : 'jpg'}`;
      const archivo = new File(carpeta, nombre);
      archivo.create({ overwrite: true });
      archivo.write(imagen.base64, { encoding: 'base64' });
      return `${CARPETA_RAIZ}/${facturaId}/${nombre}`;
    });
  }

  /** Ruta lista para mostrar o copiar a partir de la ruta relativa guardada. */
  resolverUri(ruta: string): string {
    return new File(Paths.document, ruta).uri;
  }

  eliminar(facturaId: number): void {
    const carpeta = new Directory(Paths.document, CARPETA_RAIZ, String(facturaId));
    if (carpeta.exists) carpeta.delete();
  }
}
