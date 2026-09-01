import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricData {
  kpis: { title: string; value: string }[];
  categorias_nlp: { nombre: string; porcentaje: string }[];
  palabras_frecuentes: string[];
  tiempos_grafico?: { ticket: string; minutos: number }[];
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<MetricData | null>(null);

  // Datos mock de respaldo si la API no entrega la serie temporal
  const tiemposAtencionMock = [
    { ticket: 'T-01', minutos: 12.5 },
    { ticket: 'T-02', minutos: 18.2 },
    { ticket: 'T-03', minutos: 9.4 },
    { ticket: 'T-04', minutos: 22.0 },
    { ticket: 'T-05', minutos: 14.8 },
    { ticket: 'T-06', minutos: 11.1 },
    { ticket: 'T-07', minutos: 16.4 },
  ];

  useEffect(() => {
    fetch('http://localhost:8000/api/metricas/dashboard')
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error('Error al cargar datos:', err));
  }, []);

  const graficoData = data?.tiempos_grafico || tiemposAtencionMock;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Panel de Control Inteligente</h2>

      {/* Grid de KPIs */}
      <div className="kpi-grid">
        {(data?.kpis || [
          { title: 'CLIENTES', value: '245' },
          { title: 'COMENTARIOS', value: '1,248' },
          { title: 'PROMEDIO ATENCIÓN', value: '16.4 min' },
          { title: 'PROCESADOS NLP', value: '94%' },
        ]).map((kpi, i) => (
          <div key={i} className="kpi-card">
            <p className="kpi-title">{kpi.title}</p>
            <p className="kpi-value">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Grid de Widgets */}
      <div className="widgets-grid">
        {/* Gráfico Recharts de Tiempos de Atención */}
        <div className="widget-card">
          <h3 className="widget-title">TIEMPOS DE ATENCIÓN (MINUTOS)</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graficoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="ticket" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="minutos" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorMin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorías NLP */}
        <div className="widget-card">
          <h3 className="widget-title">CATEGORÍAS NLP</h3>
          <ul className="categories-list">
            {(data?.categorias_nlp || [
              { nombre: 'Soporte', porcentaje: '42%' },
              { nombre: 'Ventas', porcentaje: '27%' },
              { nombre: 'Reclamos', porcentaje: '18%' },
            ]).map((cat, i) => (
              <li key={i} className="category-item">
                <span className="category-name">{cat.nombre}</span>
                <span className="category-percent">{cat.porcentaje}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Palabras Frecuentes */}
      <div className="widget-card">
        <h3 className="widget-title">PALABRAS FRECUENTES</h3>
        <div className="words-container">
          {(data?.palabras_frecuentes || ['servicio', 'atención', 'rápido', 'producto', 'soporte']).map((word, i) => (
            <span key={i} className="word-chip">{word}</span>
          ))}
        </div>
      </div>
    </div>
  );
};