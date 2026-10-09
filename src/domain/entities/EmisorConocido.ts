/** Lo que la app ya sabe de un emisor porque le guardó facturas antes (la más reciente manda). */
export interface EmisorConocido {
  razonSocial: string;
  condicionFiscal: string;
  categoria: string;
}
