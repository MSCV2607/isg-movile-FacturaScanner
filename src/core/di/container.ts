import { PROVEEDOR_IA, USAR_EXTRACTOR_SIMULADO, USAR_SERVIDOR_SIMULADO } from '@core/config/env';
import { ConfiguracionStorageDataSource } from '@data/datasources/ConfiguracionStorageDataSource';
import { EnviosMockDataSource } from '@data/datasources/EnviosMockDataSource';
import { ExtractorAnthropicDataSource } from '@data/datasources/ExtractorAnthropicDataSource';
import { ExtractorGeminiDataSource } from '@data/datasources/ExtractorGeminiDataSource';
import { ExtractorSimuladoDataSource } from '@data/datasources/ExtractorSimuladoDataSource';
import { ServidorHttpDataSource } from '@data/datasources/ServidorHttpDataSource';
import { ServidorSimuladoDataSource } from '@data/datasources/ServidorSimuladoDataSource';
import { ConfiguracionRepositoryImpl } from '@data/repositories/ConfiguracionRepositoryImpl';
import { EnvioRepositoryImpl } from '@data/repositories/EnvioRepositoryImpl';
import { ExtractorFacturaRepositoryImpl } from '@data/repositories/ExtractorFacturaRepositoryImpl';
import { ServidorRepositoryImpl } from '@data/repositories/ServidorRepositoryImpl';
import { EnviarFacturaUseCase } from '@domain/usecases/EnviarFacturaUseCase';
import { ExtraerFacturaUseCase } from '@domain/usecases/ExtraerFacturaUseCase';
import { GuardarConfiguracionUseCase } from '@domain/usecases/GuardarConfiguracionUseCase';
import { ObtenerConfiguracionUseCase } from '@domain/usecases/ObtenerConfiguracionUseCase';
import { ObtenerUltimosEnviosUseCase } from '@domain/usecases/ObtenerUltimosEnviosUseCase';
import { ProbarConexionUseCase } from '@domain/usecases/ProbarConexionUseCase';
import { ValidarFacturaUseCase } from '@domain/usecases/ValidarFacturaUseCase';

// Raíz de composición: único lugar que decide qué implementación usa cada contrato.
// La presentación pide los casos de uso acá y nunca conoce la capa de datos.
const envioRepository = new EnvioRepositoryImpl(new EnviosMockDataSource());
const configuracionRepository = new ConfiguracionRepositoryImpl(new ConfiguracionStorageDataSource());
const servidorRepository = new ServidorRepositoryImpl(
  USAR_SERVIDOR_SIMULADO ? new ServidorSimuladoDataSource() : new ServidorHttpDataSource(),
);

const extractorDataSource = USAR_EXTRACTOR_SIMULADO
  ? new ExtractorSimuladoDataSource()
  : PROVEEDOR_IA === 'gemini'
    ? new ExtractorGeminiDataSource()
    : new ExtractorAnthropicDataSource();
const extractorRepository = new ExtractorFacturaRepositoryImpl(extractorDataSource);

export const container = {
  obtenerUltimosEnvios: new ObtenerUltimosEnviosUseCase(envioRepository),
  extraerFactura: new ExtraerFacturaUseCase(extractorRepository, configuracionRepository),
  validarFactura: new ValidarFacturaUseCase(),
  enviarFactura: new EnviarFacturaUseCase(servidorRepository, configuracionRepository),
  obtenerConfiguracion: new ObtenerConfiguracionUseCase(configuracionRepository),
  guardarConfiguracion: new GuardarConfiguracionUseCase(configuracionRepository),
  probarConexion: new ProbarConexionUseCase(servidorRepository),
};
