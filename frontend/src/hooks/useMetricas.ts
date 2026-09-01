import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useMetricas = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetricas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/metricas/dashboard');
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricas();
  }, []);

  return { data, loading, error, refetch: fetchMetricas };
};