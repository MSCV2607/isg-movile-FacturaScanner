import { scanFromURLAsync } from 'expo-camera';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'react-native';

import { CALIDAD_PAGINA, LADO_MAXIMO_PAGINA } from '@core/config/env';
import { ErrorEscaner } from '@core/errors/ErrorEscaner';
import { DocumentoEscaneado } from '@domain/entities/DocumentoEscaneado';
import { ImagenFactura } from '@domain/entities/ImagenFactura';

import { EscanerDocumentosDataSource } from './EscanerDocumentosDataSource';

type Medidas = { ancho: number; alto: number };

/** Parte de la página, en proporciones de 0 a 1, donde buscar un QR chico. */
type Zona = { x: number; y: number; ancho: number; alto: number };

// El QR de ARCA va casi siempre abajo. Si no aparece en la página entera (porque es chico), se mira por zonas.
const ZONAS_PARA_QR: Zona[] = [
  { x: 0, y: 0.5, ancho: 1, alto: 0.5 },
  { x: 0, y: 0.6, ancho: 0.5, alto: 0.4 },
  { x: 0.5, y: 0.6, ancho: 0.5, alto: 0.4 },
];

const SIN_SOPORTE = 'El escáner solo funciona en la app instalada (APK), no en Expo Go.';
const NO_ABRIO =
  'No se pudo abrir el escáner. Revisá que Google Play Services esté actualizado y, la primera vez, que haya internet.';
const NO_PREPARO = 'No se pudieron preparar las páginas escaneadas. Probá de nuevo.';

/**
 * Escáner de documentos de Google (ML Kit): detecta los bordes del papel, endereza, recorta,
 * ofrece filtros y permite varias páginas. Acá se le agrega la reducción de cada página y la
 * búsqueda de QR sobre las imágenes ya recortadas.
 */
export class EscanerDocumentosMlKitDataSource implements EscanerDocumentosDataSource {
  async escanear(maximoPaginas: number): Promise<DocumentoEscaneado | null> {
    const rutas = await this.abrirEscaner(maximoPaginas);
    if (!rutas) return null;

    try {
      const imagenes: ImagenFactura[] = [];
      const textosQr = new Set<string>();

      for (const ruta of rutas) {
        const medidas = await this.medir(ruta);
        imagenes.push(await this.prepararImagen(ruta, medidas));
        for (const texto of await this.leerQrs(ruta, medidas)) textosQr.add(texto);
      }

      return { imagenes, textosQr: [...textosQr] };
    } catch {
      throw new ErrorEscaner(NO_PREPARO);
    }
  }

  /** Abre el escáner y devuelve las rutas de las páginas, o null si el usuario lo cerró sin terminar. */
  private async abrirEscaner(maximoPaginas: number): Promise<string[] | null> {
    // Se carga recién acá: en Expo Go el módulo nativo no existe y no debe romper el resto de la app.
    let modulo: typeof import('react-native-document-scanner-plugin');
    try {
      modulo = await import('react-native-document-scanner-plugin');
    } catch {
      throw new ErrorEscaner(SIN_SOPORTE);
    }

    try {
      const { scannedImages, status } = await modulo.default.scanDocument({
        maxNumDocuments: maximoPaginas,
        responseType: modulo.ResponseType.ImageFilePath,
      });
      if (status === modulo.ScanDocumentResponseStatus.Cancel) return null;
      return scannedImages && scannedImages.length > 0 ? scannedImages : null;
    } catch {
      throw new ErrorEscaner(NO_ABRIO);
    }
  }

  private medir(ruta: string): Promise<Medidas> {
    return new Promise((resolver, rechazar) => {
      Image.getSize(ruta, (ancho, alto) => resolver({ ancho, alto }), rechazar);
    });
  }

  /** Reduce la página si es muy grande y la pasa a base64, que es lo que lee la IA. */
  private async prepararImagen(ruta: string, { ancho, alto }: Medidas): Promise<ImagenFactura> {
    let contexto = ImageManipulator.manipulate(ruta);
    if (Math.max(ancho, alto) > LADO_MAXIMO_PAGINA) {
      contexto = contexto.resize(alto >= ancho ? { height: LADO_MAXIMO_PAGINA } : { width: LADO_MAXIMO_PAGINA });
    }

    const imagen = await contexto.renderAsync();
    const guardada = await imagen.saveAsync({ format: SaveFormat.JPEG, compress: CALIDAD_PAGINA, base64: true });
    if (!guardada.base64) throw new Error('La imagen no devolvió datos.');
    return { base64: guardada.base64, tipoMime: 'image/jpeg' };
  }

  /** Busca QR en la página entera y, si no hay ninguno, en las zonas donde suele estar el de ARCA. */
  private async leerQrs(ruta: string, medidas: Medidas): Promise<string[]> {
    const enPagina = await this.buscarQr(ruta);
    if (enPagina.length > 0) return enPagina;

    for (const zona of ZONAS_PARA_QR) {
      const enZona = await this.buscarQrEnZona(ruta, medidas, zona);
      if (enZona.length > 0) return enZona;
    }
    return [];
  }

  private async buscarQrEnZona(ruta: string, { ancho, alto }: Medidas, zona: Zona): Promise<string[]> {
    try {
      const recorte = await ImageManipulator.manipulate(ruta)
        .crop({
          originX: Math.round(zona.x * ancho),
          originY: Math.round(zona.y * alto),
          width: Math.round(zona.ancho * ancho),
          height: Math.round(zona.alto * alto),
        })
        .renderAsync();
      const guardado = await recorte.saveAsync({ format: SaveFormat.JPEG, compress: 1 });
      return await this.buscarQr(guardado.uri);
    } catch {
      return [];
    }
  }

  /** Un QR que no se pueda leer no es un error: simplemente la factura sigue sin él. */
  private async buscarQr(ruta: string): Promise<string[]> {
    try {
      const resultados = await scanFromURLAsync(ruta, ['qr']);
      return resultados.map((resultado) => resultado.data);
    } catch {
      return [];
    }
  }
}
