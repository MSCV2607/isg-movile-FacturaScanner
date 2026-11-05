import { Sesion } from '../entities/Sesion';

export interface SesionRepository {
  guardar(sesion: Sesion): Promise<void>;
}
