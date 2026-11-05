/** Empresa tal como la devuelve GET /api/Empresas de la api de empresas. */
export interface EmpresaDto {
  id: number;
  nombre: string;
  urlAuth: string;
  activa?: boolean;
}
