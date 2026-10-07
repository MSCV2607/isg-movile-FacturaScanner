import { PROVEEDOR_IA, USAR_EXTRACTOR_SIMULADO, USAR_SERVIDOR_SIMULADO } from '@core/config/env';
import { ConfiguracionStorageDataSource } from '@data/datasources/ConfiguracionStorageDataSource';
import { ActualizacionesExpoDataSource } from '@data/datasources/ActualizacionesExpoDataSource';
import { ArchivosDataSource } from '@data/datasources/ArchivosDataSource';
import { EscanerDocumentosMlKitDataSource } from '@data/datasources/EscanerDocumentosMlKitDataSource';
import { ExcelDataSource } from '@data/datasources/ExcelDataSource';
import { ExtractorAnthropicDataSource } from '@data/datasources/ExtractorAnthropicDataSource';
import { ExtractorGeminiDataSource } from '@data/datasources/ExtractorGeminiDataSource';
import { ExtractorSimuladoDataSource } from '@data/datasources/ExtractorSimuladoDataSource';
import { FacturaSqliteDataSource } from '@data/datasources/FacturaSqliteDataSource';
import { FotosLocalesDataSource } from '@data/datasources/FotosLocalesDataSource';
import { ServidorHttpDataSource } from '@data/datasources/ServidorHttpDataSource';
import { ServidorSimuladoDataSource } from '@data/datasources/ServidorSimuladoDataSource';
import { ActualizacionRepositoryImpl } from '@data/repositories/ActualizacionRepositoryImpl';
import { ConfiguracionRepositoryImpl } from '@data/repositories/ConfiguracionRepositoryImpl';
import { EscanerDocumentosRepositoryImpl } from '@data/repositories/EscanerDocumentosRepositoryImpl';
import { ExportadorFacturaRepositoryImpl } from '@data/repositories/ExportadorFacturaRepositoryImpl';
import { ExtractorFacturaRepositoryImpl } from '@data/repositories/ExtractorFacturaRepositoryImpl';
import { FacturaLocalRepositoryImpl } from '@data/repositories/FacturaLocalRepositoryImpl';
import { ServidorRepositoryImpl } from '@data/repositories/ServidorRepositoryImpl';
import { BuscarActualizacionUseCase } from '@domain/usecases/BuscarActualizacionUseCase';
import { EscanearDocumentoUseCase } from '@domain/usecases/EscanearDocumentoUseCase';
import { EnviarFacturaUseCase } from '@domain/usecases/EnviarFacturaUseCase';
import { ExportarFacturaUseCase } from '@domain/usecases/ExportarFacturaUseCase';
import { ExtraerFacturaUseCase } from '@domain/usecases/ExtraerFacturaUseCase';
import { GuardarConfiguracionUseCase } from '@domain/usecases/GuardarConfiguracionUseCase';
import { InstalarActualizacionUseCase } from '@domain/usecases/InstalarActualizacionUseCase';
import { LeerFacturaUseCase } from '@domain/usecases/LeerFacturaUseCase';
import { LeerQrFacturaUseCase } from '@domain/usecases/LeerQrFacturaUseCase';
import { ObtenerConfiguracionUseCase } from '@domain/usecases/ObtenerConfiguracionUseCase';
import { GuardarFacturaUseCase } from '@domain/usecases/GuardarFacturaUseCase';
import { ObtenerFacturaGuardadaUseCase } from '@domain/usecases/ObtenerFacturaGuardadaUseCase';
import { ObtenerUltimasFacturasUseCase } from '@domain/usecases/ObtenerUltimasFacturasUseCase';
import { ProbarConexionUseCase } from '@domain/usecases/ProbarConexionUseCase';
import { ValidarFacturaUseCase } from '@domain/usecases/ValidarFacturaUseCase';

// Raíz de composición: único lugar que decide qué implementación usa cada contrato.
// La presentación pide los casos de uso acá y nunca conoce la capa de datos.
const facturaLocalRepository = new FacturaLocalRepositoryImpl(new FacturaSqliteDataSource(), new FotosLocalesDataSource());
const exportadorRepository = new ExportadorFacturaRepositoryImpl(new ExcelDataSource(), new ArchivosDataSource());
const configuracionRepository = new ConfiguracionRepositoryImpl(new ConfiguracionStorageDataSource());
const actualizacionRepository = new ActualizacionRepositoryImpl(new ActualizacionesExpoDataSource());
const escanerRepository = new EscanerDocumentosRepositoryImpl(new EscanerDocumentosMlKitDataSource());
const servidorRepository = new ServidorRepositoryImpl(
  USAR_SERVIDOR_SIMULADO ? new ServidorSimuladoDataSource() : new ServidorHttpDataSource(),
);

const extractorDataSource = USAR_EXTRACTOR_SIMULADO
  ? new ExtractorSimuladoDataSource()
  : PROVEEDOR_IA === 'gemini'
    ? new ExtractorGeminiDataSource()
    : new ExtractorAnthropicDataSource();
const extractorRepository = new ExtractorFacturaRepositoryImpl(extractorDataSource);

const leerQrFacturaUseCase = new LeerQrFacturaUseCase();
const extraerFacturaUseCase = new ExtraerFacturaUseCase(extractorRepository, configuracionRepository);

export const container = {
  buscarActualizacion: new BuscarActualizacionUseCase(actualizacionRepository),
  instalarActualizacion: new InstalarActualizacionUseCase(actualizacionRepository),
  guardarFactura: new GuardarFacturaUseCase(facturaLocalRepository),
  obtenerUltimasFacturas: new ObtenerUltimasFacturasUseCase(facturaLocalRepository),
  obtenerFacturaGuardada: new ObtenerFacturaGuardadaUseCase(facturaLocalRepository),
  exportarFactura: new ExportarFacturaUseCase(exportadorRepository),
  extraerFactura: extraerFacturaUseCase,
  leerQrFactura: leerQrFacturaUseCase,
  escanearDocumento: new EscanearDocumentoUseCase(escanerRepository, leerQrFacturaUseCase),
  leerFactura: new LeerFacturaUseCase(extraerFacturaUseCase),
  validarFactura: new ValidarFacturaUseCase(),
  // Envío al servidor: pendiente de conectar (la app hoy guarda en el celular). Ver docs/ARQUITECTURA.md.
  enviarFactura: new EnviarFacturaUseCase(servidorRepository, configuracionRepository),
  obtenerConfiguracion: new ObtenerConfiguracionUseCase(configuracionRepository),
  guardarConfiguracion: new GuardarConfiguracionUseCase(configuracionRepository),
  probarConexion: new ProbarConexionUseCase(servidorRepository),
};
