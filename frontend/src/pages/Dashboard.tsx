import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricData {
  kpis: { title: string; value: string }[];
  categorias_nlp: { nombre: string; porcentaje: string }[];
  palabras_frecuentes: string[];
  tiempos_grafico?: { ticket: string; minutos: number }[];
}

interface ReporteGuardado {
  id: string;
  nombre: string;
  fecha: string;
  formato: 'PDF' | 'CSV' | 'EXCEL';
  registros: number;
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<MetricData | null>(null);
  const [reportes, setReportes] = useState<ReporteGuardado[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [formatoSeleccionado, setFormatoSeleccionado] = useState<'PDF' | 'CSV' | 'EXCEL'>('PDF');

  // Estados para Filtros
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

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

    const reportesAlmacenados = localStorage.getItem('reportes_guardados');
    if (reportesAlmacenados) {
      setReportes(JSON.parse(reportesAlmacenados));
    } else {
      const iniciales: ReporteGuardado[] = [
        { id: '1', nombre: 'Informe Semanal NLP', fecha: '2026-03-28', formato: 'PDF', registros: 124 },
        { id: '2', nombre: 'Métricas de Atención Marzo', fecha: '2026-03-30', formato: 'CSV', registros: 450 },
      ];
      setReportes(iniciales);
      localStorage.setItem('reportes_guardados', JSON.stringify(iniciales));
    }
  }, []);

  const guardarReporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const nuevo: ReporteGuardado = {
      id: Date.now().toString(),
      nombre: nuevoNombre,
      fecha: new Date().toISOString().split('T')[0],
      formato: formatoSeleccionado,
      registros: Math.floor(Math.random() * 200) + 10,
    };

    const listaActualizada = [nuevo, ...reportes];
    setReportes(listaActualizada);
    localStorage.setItem('reportes_guardados', JSON.stringify(listaActualizada));
    setNuevoNombre('');
  };

  const eliminarReporte = (id: string) => {
    const listaActualizada = reportes.filter((r) => r.id !== id);
    setReportes(listaActualizada);
    localStorage.setItem('reportes_guardados', JSON.stringify(listaActualizada));
  };

  // Filtrado dinámico
  const reportesFiltrados = reportes.filter((rep) => {
    const coincideTexto = rep.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideFecha = filtroFecha ? rep.fecha === filtroFecha : true;
    return coincideTexto && coincideFecha;
  });

  const graficoData = data?.tiempos_grafico || tiemposAtencionMock;

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
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
      <div className="widgets-grid" style={{ marginBottom: '24px' }}>
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

      <div className="widget-card" style={{ marginBottom: '24px' }}>
        <h3 className="widget-title">PALABRAS FRECUENTES</h3>
        <div className="words-container">
          {(data?.palabras_frecuentes || ['servicio', 'atención', 'rápido', 'producto', 'soporte']).map((word, i) => (
            <span key={i} className="word-chip">{word}</span>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE REPORTES CON FILTROS */}
      <div className="widget-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
        <h3 className="widget-title" style={{ marginBottom: '16px', color: '#1e293b' }}>
          HISTORIAL DE REPORTES
        </h3>

        {/* Formulario para agregar */}
        <form onSubmit={guardarReporte} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Nuevo reporte (ej. Resumen Ventas)"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1, minWidth: '200px' }}
            required
          />
          <select
            value={formatoSeleccionado}
            onChange={(e) => setFormatoSeleccionado(e.target.value as 'PDF' | 'CSV' | 'EXCEL')}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
          >
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="EXCEL">EXCEL</option>
          </select>
          <button
            type="submit"
            style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            Guardar en Historial
          </button>
        </form>

        {/* Barra de Filtros */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '6px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1, minWidth: '180px' }}
          />
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
          />
          {(filtroTexto || filtroFecha) && (
            <button
              onClick={() => { setFiltroTexto(''); setFiltroFecha(''); }}
              style={{ padding: '8px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {/* Tabla */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px' }}>NOMBRE DEL REPORTE</th>
                <th style={{ padding: '12px' }}>FECHA</th>
                <th style={{ padding: '12px' }}>FORMATO</th>
                <th style={{ padding: '12px' }}>REGISTROS</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                    No se encontraron reportes que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                reportesFiltrados.map((rep) => (
                  <tr key={rep.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{rep.nombre}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{rep.fecha}</td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background:
                            rep.formato === 'PDF'
                              ? '#fee2e2'
                              : rep.formato === 'CSV'
                              ? '#d1fae5'
                              : '#e0f2fe',
                          color:
                            rep.formato === 'PDF'
                              ? '#dc2626'
                              : rep.formato === 'CSV'
                              ? '#059669'
                              : '#0284c7',
                        }}
                      >
                        {rep.formato}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{rep.registros} filas</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => eliminarReporte(rep.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};