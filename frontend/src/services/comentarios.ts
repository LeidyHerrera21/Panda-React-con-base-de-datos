import { api } from './api';

export interface Comentario {
  id?: number;
  cliente_id: number;
  texto: str;
  estado?: string;
}

export const getComentarios = async (): Promise<Comentario[]> => {
  const response = await api.get<Comentario[]>('/comentarios/');
  return response.data;
};

export const crearComentario = async (comentario: Omit<Comentario, 'id' | 'estado'>): Promise<Comentario> => {
  const response = await api.post<Comentario>('/comentarios/', comentario);
  return response.data;
};