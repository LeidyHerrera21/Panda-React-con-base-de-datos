import React, { useState } from 'react';
import { obtenerEstadisticasAtencion } from '../services/scipy';
import { EstadisticasAtencion } from '../types';

export const Optimizacion: React.FC = () => {
  const [tiempos, setTiempos] = useState<string>('12.5, 14.8, 22.0, 10.2, 16.4, 12.5');
  const [stats, setStats] = useState<EstadisticasAtencion | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  // Cálculo estadístico manual (fallback si la API falla)
  const calcularEstadisticasLocales = (arr: number[]): EstadisticasAtencion => {
    const ordenados = [...arr].sort((a, b) => a - b);
    const n = ordenados.length;
    
    // Media
    const media = arr.reduce((acc, curr) => acc + curr, 0) / n;
    
    // Mediana
    const mitad = Math.floor(n / 2);
    const mediana = n % 2 !== 0 ? ordenados[mitad] : (ordenados[mitad - 1] + ordenados[mitad]) / 2;
    
    // Desviación estándar
    const varianza = arr.reduce((acc, curr) => acc + Math.pow(curr - media, 2), 0) / n;
    const desviacion = Math.sqrt(varianza);
    
    // Percentil 90
    const idxP90 = Math.ceil(0.9 * n) - 1;
    const percentil90 = ordenados[Math.min(idxP90, n - 1)];

    // Moda
    const freq: Record<number, number> = {};
    arr.forEach(num => freq[num] = (freq[num] || 0) + 1);
    const moda = parseFloat(Object.keys(freq).reduce((a, b) => freq[parseFloat(a)] > freq[parseFloat(b)] ? a : b));

    return {
      media: Number(media.toFixed(2)),
      mediana: Number(mediana.toFixed(2)),
      desviacion_estandar: Number(desviacion.toFixed(2)),
      percentil_90: Number(percentil90.toFixed(2)),
      moda: Number(moda.toFixed(2))
    };
  };

  const manejarCalculo = async () => {
    const listaTiempos = tiempos
      .split(',')
      .map((val) => parseFloat(val.trim()))
      .filter((n) => !isNaN(n));

    if (listaTiempos.length === 0) return;

    setCargando(true);
    try {
      const data = await obtenerEstadisticasAtencion(listaTiempos);
      setStats(data);
    } catch (err) {
      console.warn('Backend SciPy no disponible, procesando en cliente:', err);
      const resultadoLocal = calcularEstadisticasLocales(listaTiempos);
      setStats(resultadoLocal);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Optimización & Análisis (SciPy)</h2>
      
      <div className="widget-card">
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>
          Tiempos de Atención (separados por coma):
        </label>
        <input
          type="text"
          value={tiempos}
          onChange={(e) => setTiempos(e.target.value)}
          placeholder="Ej: 12.5, 14.8, 22.0..."
          style={{ 
            width: '100%', 
            padding: '10px 14px', 
            borderRadius: '6px', 
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem'
          }}
        />
        <button
          onClick={manejarCalculo}
          disabled={cargando}
          style={{ 
            marginTop: '12px', 
            padding: '10px 20px', 
            background: cargando ? '#94a3b8' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: cargando ? 'not-allowed' : 'pointer',
            fontWeight: 600 
          }}
        >
          {cargando ? 'Calculando...' : 'Calcular Métricas'}
        </button>
      </div>

      {stats && (
        <div className="kpi-grid" style={{ marginTop: '24px' }}>
          <div className="kpi-card">
            <p className="kpi-title">MEDIA</p>
            <p className="kpi-value">{stats.media}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-title">MEDIANA</p>
            <p className="kpi-value">{stats.mediana}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-title">DESVIACIÓN ESTÁNDAR</p>
            <p className="kpi-value">{stats.desviacion_estandar}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-title">PERCENTIL 90</p>
            <p className="kpi-value">{stats.percentil_90}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-title">MODA</p>
            <p className="kpi-value">{stats.moda}</p>
          </div>
        </div>
      )}
    </div>
  );
};