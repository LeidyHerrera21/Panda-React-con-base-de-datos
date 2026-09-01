import { api } from './api';

export interface AnalisisNLPResponse {
  tokens_totales: number;
  tokens_filtrados: number;
  frecuencias: Record<string, number>;
  palabras_clave: string[];
}

export const analizarTexto = async (texto: string): Promise<AnalisisNLPResponse> => {
  const response = await api.post<AnalisisNLPResponse>('/nltk/analizar', { texto });
  return response.data;
};