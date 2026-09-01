import { api } from './api';

export interface EstadisticasResponse {
  media: number;
  mediana: number;
  desviacion_estandar: number;
  percentil_90: number;
  moda: number;
}

export const obtenerEstadisticasAtencion = async (tiemposAtencion: number[]): Promise<EstadisticasResponse> => {
  const response = await api.post<EstadisticasResponse>('/scipy/estadisticas', {
    tiempos_atencion: tiemposAtencion,
  });
  return response.data;
};