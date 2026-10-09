import { Directory, File } from 'expo-file-system';

import { ARCHIVO_RESPALDO, CARPETA_FOTOS_RESPALDO, FORMATO_RESPALDO, RespaldoDto, VERSION_RESPALDO } from '@data/dtos/RespaldoDto';
import { Ajustes } from '@domain/entities/Ajustes';
import { ImagenFactura } from '@domain/entities/ImagenFactura';
import { ResultadoRespaldo, ResultadoRestauracion } from '@domain/entities/Respaldo';
import { AjustesRepository } from '@domain/repositories/AjustesRepository';
import { RespaldoRepository } from '@domain/repositories/RespaldoRepository';
import { mismoComprobante } from '@domain/rules/comprobante';

import { ArchivosDataSource } from '../datasources/ArchivosDataSource';
import { FacturasLocalesDataSource } from '../datasources/FacturasLocalesDataSource';
import { FotosLocalesDataSource } from '../datasources/FotosLocalesDataSource';
import { ajustesMapper } from '../mappers/ajustesMapper';
import { facturaGuardadaMapper } from '../mappers/facturaGuardadaMapper';
import { respaldoMapper } from '../mappers/respaldoMapper';

const dosDigitos = (n: number) => String(n).padStart(2, '0');

function nombreDeCarpeta(ahora: Date): string {
  const fecha = `${ahora.getFullYear()}-${dosDigitos(ahora.getMonth() + 1)}-${dosDigitos(ahora.getDate())}`;
  return `Respaldo_Facturas_${fecha}_${dosDigitos(ahora.getHours())}${dosDigitos(ahora.getMinutes())}`;
}

const esPng = (nombre: string) => nombre.toLowerCase().endsWith('.png');

/**
 * El respaldo es una carpeta: `facturas.json` con los datos y las preferencias, y una subcarpeta `fotos`
 * con las imágenes originales. Va en carpeta (y no en un solo archivo) para no cargar todas las fotos en memoria a la vez.
 */
export class RespaldoRepositoryImpl implements RespaldoRepository {
  constructor(
    private readonly baseDeDatos: FacturasLocalesDataSource,
    private readonly fotos: FotosLocalesDataSource,
    private readonly archivos: ArchivosDataSource,
    private readonly ajustes: AjustesRepository,
  ) {}

  async crear(): Promise<ResultadoRespaldo | null> {
    const destino = await this.archivos.elegirCarpeta();
    if (!destino) return null;

    const ahora = new Date();
    const carpeta = this.archivos.crearSubcarpeta(destino, nombreDeCarpeta(ahora));
    const carpetaFotos = this.archivos.crearSubcarpeta(carpeta, CARPETA_FOTOS_RESPALDO);

    const completas = await this.baseDeDatos.obtenerTodasCompletas();
    const facturas: RespaldoDto['facturas'] = [];
    let totalFotos = 0;

    for (const completa of completas) {
      const guardada = facturaGuardadaMapper.toEntity(
        completa.fila,
        completa.items,
        completa.fotos.map((foto) => this.fotos.resolverUri(foto.ruta)),
      );

      const nombres: string[] = [];
      for (const [indice, uri] of guardada.fotos.entries()) {
        const nombre = `${guardada.id}_${indice + 1}.${esPng(uri) ? 'png' : 'jpg'}`;
        await this.archivos.copiarACarpeta(carpetaFotos, uri, nombre, esPng(uri) ? 'image/png' : 'image/jpeg');
        nombres.push(nombre);
        totalFotos += 1;
      }
      facturas.push(respaldoMapper.toDto(guardada.factura, guardada.creadaEn, nombres));
    }

    const contenido: RespaldoDto = {
      formato: FORMATO_RESPALDO,
      version: VERSION_RESPALDO,
      creadoEn: ahora.toISOString(),
      facturas,
      ajustes: ajustesMapper.toDto(await this.ajustes.obtener()),
    };
    this.archivos.guardarTextoEnCarpeta(carpeta, ARCHIVO_RESPALDO, 'application/json', JSON.stringify(contenido));

    return { facturas: facturas.length, fotos: totalFotos };
  }

  async restaurar(): Promise<ResultadoRestauracion | null> {
    const carpeta = await this.archivos.elegirCarpeta();
    if (!carpeta) return null;

    const contenido = await this.leerRespaldo(carpeta);
    const carpetaFotos = this.archivos.buscarEnCarpeta(carpeta, CARPETA_FOTOS_RESPALDO);

    let restauradas = 0;
    let repetidas = 0;
    let omitidas = 0;

    for (const crudo of contenido.facturas) {
      const entrada = respaldoMapper.toEntity(crudo);
      if (!entrada) {
        omitidas += 1;
        continue;
      }
      if (await this.yaExiste(entrada.factura)) {
        repetidas += 1;
        continue;
      }
      await this.insertar(entrada, carpetaFotos instanceof Directory ? carpetaFotos : null);
      restauradas += 1;
    }

    await this.unirAjustes(contenido.ajustes);
    return { restauradas, repetidas, omitidas };
  }

  /** Lee y valida el archivo de datos. Falla con un mensaje para el usuario si la carpeta no es un respaldo. */
  private async leerRespaldo(carpeta: Directory): Promise<{ facturas: unknown[]; ajustes: RespaldoDto['ajustes'] }> {
    const archivo = this.archivos.buscarEnCarpeta(carpeta, ARCHIVO_RESPALDO);
    if (!(archivo instanceof File)) {
      throw new Error(`Esa carpeta no tiene un respaldo (falta el archivo ${ARCHIVO_RESPALDO}). Elegí la carpeta "Respaldo_Facturas_…".`);
    }

    let crudo: unknown;
    try {
      crudo = JSON.parse(await this.archivos.leerTexto(archivo));
    } catch {
      throw new Error('El archivo del respaldo está dañado y no se pudo leer.');
    }

    const datos = crudo as Partial<RespaldoDto> | null;
    if (!datos || datos.formato !== FORMATO_RESPALDO || !Array.isArray(datos.facturas)) {
      throw new Error('Esa carpeta no es un respaldo de ISG-FacturaScanner.');
    }
    if (typeof datos.version === 'number' && datos.version > VERSION_RESPALDO) {
      throw new Error('Ese respaldo es de una versión más nueva de la app. Actualizá la app y probá de nuevo.');
    }
    return { facturas: datos.facturas, ajustes: datos.ajustes ?? {} };
  }

  /** Ya está si hay una factura con el mismo comprobante, fecha e importe. */
  private async yaExiste(factura: Parameters<typeof facturaGuardadaMapper.toNuevaDto>[0]): Promise<boolean> {
    const parecidas = await this.baseDeDatos.buscarPorComprobante(factura.emisor.cuit, factura.puntoVenta, factura.numero);
    return parecidas.some(
      (fila) =>
        fila.fecha_emision === factura.fecha &&
        Math.abs(fila.importe_total - factura.importeTotal) < 0.01 &&
        mismoComprobante(
          { cuit: factura.emisor.cuit, tipoComprobante: factura.tipoComprobante, letra: factura.letra, puntoVenta: factura.puntoVenta, numero: factura.numero },
          { cuit: fila.emisor_cuit, tipoComprobante: fila.tipo_comprobante, letra: fila.letra, puntoVenta: fila.punto_venta, numero: fila.numero },
        ),
    );
  }

  private async insertar(
    entrada: NonNullable<ReturnType<typeof respaldoMapper.toEntity>>,
    carpetaFotos: Directory | null,
  ): Promise<void> {
    const id = await this.baseDeDatos.insertar(facturaGuardadaMapper.toNuevaDto(entrada.factura, entrada.creadaEn));

    try {
      const imagenes: ImagenFactura[] = [];
      for (const nombre of entrada.fotos) {
        const archivo = carpetaFotos ? this.archivos.buscarEnCarpeta(carpetaFotos, nombre) : null;
        // Una foto que falta en la carpeta no impide restaurar la factura.
        if (!(archivo instanceof File)) continue;
        imagenes.push({ base64: await this.archivos.leerBase64(archivo), tipoMime: esPng(nombre) ? 'image/png' : 'image/jpeg' });
      }
      if (imagenes.length > 0) {
        await this.baseDeDatos.agregarFotos(id, this.fotos.guardar(id, imagenes));
      }
    } catch (error) {
      this.fotos.eliminar(id);
      await this.baseDeDatos.eliminar(id);
      throw error;
    }
  }

  /** Suma las categorías del respaldo a las que ya hay, y los topes de las que no tenían. Nada se pisa. */
  private async unirAjustes(delRespaldo: RespaldoDto['ajustes']): Promise<void> {
    const respaldado: Ajustes = ajustesMapper.toEntity(delRespaldo);
    const actuales = await this.ajustes.obtener();

    await this.ajustes.guardar({
      categorias: [...new Set([...actuales.categorias, ...respaldado.categorias])],
      topes: { ...respaldado.topes, ...actuales.topes },
    });
  }
}
