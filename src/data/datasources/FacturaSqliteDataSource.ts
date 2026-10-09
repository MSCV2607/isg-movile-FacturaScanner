import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

import { FacturaFilaDto, FotoFilaDto, ItemFilaDto, NuevaFacturaDto } from '../dtos/FacturaGuardadaDto';
import { FacturaCompletaDto, FacturasLocalesDataSource } from './FacturasLocalesDataSource';

const NOMBRE_BASE = 'facturas.db';

// Cada elemento es una versión del esquema. Para cambiar la base se AGREGA una migración al final:
// nunca se edita una anterior, así las instalaciones existentes se actualizan sin perder datos.
const MIGRACIONES: string[] = [
  `
  CREATE TABLE facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creada_en TEXT NOT NULL,
    emisor_razon_social TEXT NOT NULL,
    emisor_cuit TEXT NOT NULL,
    emisor_condicion_fiscal TEXT NOT NULL,
    tipo_comprobante TEXT NOT NULL,
    letra TEXT NOT NULL,
    punto_venta INTEGER NOT NULL,
    numero INTEGER NOT NULL,
    fecha_emision TEXT NOT NULL,
    moneda TEXT NOT NULL,
    importe_neto REAL NOT NULL,
    importe_iva REAL NOT NULL,
    importe_total REAL NOT NULL
  );
  CREATE TABLE factura_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    factura_id INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    orden INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad REAL NOT NULL,
    precio_unitario REAL NOT NULL,
    alicuota_iva REAL,
    subtotal REAL NOT NULL
  );
  CREATE TABLE factura_fotos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    factura_id INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    orden INTEGER NOT NULL,
    ruta TEXT NOT NULL
  );
  CREATE INDEX idx_factura_items_factura ON factura_items(factura_id);
  CREATE INDEX idx_factura_fotos_factura ON factura_fotos(factura_id);
  `,
  // Versión 2: rubro del gasto, y índices para buscar duplicados, emisores conocidos y períodos.
  `
  ALTER TABLE facturas ADD COLUMN categoria TEXT NOT NULL DEFAULT '';
  CREATE INDEX idx_facturas_comprobante ON facturas(emisor_cuit, punto_venta, numero);
  CREATE INDEX idx_facturas_fecha ON facturas(fecha_emision);
  `,
];

async function migrar(base: SQLiteDatabase): Promise<void> {
  const fila = await base.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const versionActual = fila?.user_version ?? 0;

  for (let version = versionActual; version < MIGRACIONES.length; version++) {
    await base.withTransactionAsync(async () => {
      await base.execAsync(MIGRACIONES[version]);
      await base.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
  }
}

/** Guarda las facturas en una base SQLite dentro del celular. */
export class FacturaSqliteDataSource implements FacturasLocalesDataSource {
  private base: Promise<SQLiteDatabase> | null = null;

  /** Abre la base y la actualiza la primera vez que se la necesita. Si falla, el próximo pedido reintenta. */
  private abrir(): Promise<SQLiteDatabase> {
    if (!this.base) {
      this.base = this.inicializar().catch((error) => {
        this.base = null;
        throw error;
      });
    }
    return this.base;
  }

  private async inicializar(): Promise<SQLiteDatabase> {
    const base = await openDatabaseAsync(NOMBRE_BASE);
    await base.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    await migrar(base);
    return base;
  }

  async insertar({ fila, items }: NuevaFacturaDto): Promise<number> {
    const base = await this.abrir();
    let facturaId = 0;

    await base.withTransactionAsync(async () => {
      const resultado = await base.runAsync(
        `INSERT INTO facturas (
          creada_en, emisor_razon_social, emisor_cuit, emisor_condicion_fiscal, tipo_comprobante, letra,
          punto_venta, numero, fecha_emision, moneda, importe_neto, importe_iva, importe_total, categoria
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fila.creada_en,
          fila.emisor_razon_social,
          fila.emisor_cuit,
          fila.emisor_condicion_fiscal,
          fila.tipo_comprobante,
          fila.letra,
          fila.punto_venta,
          fila.numero,
          fila.fecha_emision,
          fila.moneda,
          fila.importe_neto,
          fila.importe_iva,
          fila.importe_total,
          fila.categoria,
        ],
      );
      facturaId = resultado.lastInsertRowId;

      for (const [orden, item] of items.entries()) {
        await base.runAsync(
          `INSERT INTO factura_items (factura_id, orden, descripcion, cantidad, precio_unitario, alicuota_iva, subtotal)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [facturaId, orden, item.descripcion, item.cantidad, item.precio_unitario, item.alicuota_iva, item.subtotal],
        );
      }
    });

    return facturaId;
  }

  async agregarFotos(facturaId: number, rutas: string[]): Promise<void> {
    const base = await this.abrir();
    await base.withTransactionAsync(async () => {
      for (const [orden, ruta] of rutas.entries()) {
        await base.runAsync('INSERT INTO factura_fotos (factura_id, orden, ruta) VALUES (?, ?, ?)', [
          facturaId,
          orden,
          ruta,
        ]);
      }
    });
  }

  async eliminar(facturaId: number): Promise<void> {
    const base = await this.abrir();
    await base.runAsync('DELETE FROM facturas WHERE id = ?', [facturaId]);
  }

  async obtenerUltimas(cantidad: number): Promise<FacturaFilaDto[]> {
    const base = await this.abrir();
    return base.getAllAsync<FacturaFilaDto>('SELECT * FROM facturas ORDER BY id DESC LIMIT ?', [cantidad]);
  }

  async obtenerTodas(desde: string | null, hasta: string | null): Promise<FacturaFilaDto[]> {
    const base = await this.abrir();
    return base.getAllAsync<FacturaFilaDto>(
      `SELECT * FROM facturas
       WHERE (? IS NULL OR fecha_emision >= ?) AND (? IS NULL OR fecha_emision <= ?)
       ORDER BY fecha_emision DESC, id DESC`,
      [desde, desde, hasta, hasta],
    );
  }

  async buscarPorComprobante(cuit: string, puntoVenta: number, numero: number): Promise<FacturaFilaDto[]> {
    const base = await this.abrir();
    return base.getAllAsync<FacturaFilaDto>(
      'SELECT * FROM facturas WHERE emisor_cuit = ? AND punto_venta = ? AND numero = ? ORDER BY id DESC',
      [cuit, puntoVenta, numero],
    );
  }

  async obtenerUltimaDeEmisor(cuit: string): Promise<FacturaFilaDto | null> {
    const base = await this.abrir();
    return base.getFirstAsync<FacturaFilaDto>('SELECT * FROM facturas WHERE emisor_cuit = ? ORDER BY id DESC LIMIT 1', [
      cuit,
    ]);
  }

  async obtener(facturaId: number): Promise<FacturaCompletaDto | null> {
    const base = await this.abrir();
    const fila = await base.getFirstAsync<FacturaFilaDto>('SELECT * FROM facturas WHERE id = ?', [facturaId]);
    if (!fila) return null;

    const items = await base.getAllAsync<ItemFilaDto>(
      `SELECT descripcion, cantidad, precio_unitario, alicuota_iva, subtotal
       FROM factura_items WHERE factura_id = ? ORDER BY orden`,
      [facturaId],
    );
    const fotos = await base.getAllAsync<FotoFilaDto>(
      'SELECT ruta FROM factura_fotos WHERE factura_id = ? ORDER BY orden',
      [facturaId],
    );
    return { fila, items, fotos };
  }
}
