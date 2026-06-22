export function apiErrMsg(e: any): string {
  if (e?.status === 0)   return 'No se pudo conectar con el Gateway. Verifique http://localhost:7091';
  if (e?.status === 401) return 'Sesión vencida o no autorizada. Inicie sesión nuevamente.';
  if (e?.status === 403) return 'No tiene permisos para esta acción.';
  if (e?.status === 404) return 'Recurso no encontrado en el servidor.';
  if (e?.status === 500) return 'Error interno del servidor.';
  return e?.error?.message || e?.message || 'Error inesperado.';
}
