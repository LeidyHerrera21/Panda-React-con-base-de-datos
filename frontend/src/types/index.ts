// Clientes
export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  empresa: string;
}

export type CrearClienteInput = Omit<Cliente, 'id'>;

// Comentarios
export interface Comentario {
  id: number;
  cliente_id: number;
  texto: string;
  estado: 'pendiente' | 'procesado';
}

export type CrearComentarioInput = Omit<Comentario, 'id' | 'estado'>;

// Análisis NLP
export interface ResultadoNLP {
  tokens_totales: number;
  tokens_filtrados: number;
  frecuencias: Record<string, number>;
  palabras_clave: string[];
}

// Estadísticas SciPy
export interface EstadisticasAtencion {
  media: number;
  mediana: number;
  desviacion_estandar: number;
  percentil_90: number;
  moda: number;
}