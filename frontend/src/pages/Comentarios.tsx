import React, { useState } from 'react';
import { Comentario } from '../types';

const DATOS_INICIALES: Comentario[] = [
  { id: 1, cliente_id: 1, texto: 'Excelente atención al cliente, resolvieron mi problema rápidamente.', estado: 'procesado' },
  { id: 2, cliente_id: 2, texto: 'El sistema presentó demoras en la respuesta durante el mediodía.', estado: 'pendiente' },
  { id: 3, cliente_id: 3, texto: 'Me gustaría una integración más directa con la plataforma de análisis.', estado: 'procesado' },
];

export const Comentarios: React.FC = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>(DATOS_INICIALES);
  const [clienteId, setClienteId] = useState<number>(1);
  const [texto, setTexto] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  const agregarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;

    setCargando(true);
    
    // Simulación de envío / Fallback local instantáneo
    const nuevoComentario: Comentario = {
      id: Date.now(),
      cliente_id: clienteId,
      texto,
      estado: 'pendiente',
    };

    setComentarios((prev) => [nuevoComentario, ...prev]);
    setTexto('');
    setCargando(false);
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h2 className="dashboard-title">Comentarios y Feedback</h2>

      <div className="widget-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>REGISTRAR NUEVO COMENTARIO</h3>
        <form onSubmit={agregarComentario} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>ID Cliente:</label>
            <input
              type="number"
              value={clienteId}
              onChange={(e) => setClienteId(Number(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100px' }}
              required
            />
          </div>
          <textarea
            rows={3}
            placeholder="Escribe el feedback del cliente..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
            required
          />
          <button
            type="submit"
            disabled={cargando}
            style={{
              alignSelf: 'flex-start',
              padding: '10px 24px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: cargando ? 'not-allowed' : 'pointer',
            }}
          >
            {cargando ? 'Enviando...' : 'Enviar Comentario'}
          </button>
        </form>
      </div>

      <div className="widget-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>LISTADO DE FEEDBACK</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>CLIENTE ID</th>
              <th style={{ padding: '12px' }}>COMENTARIO</th>
              <th style={{ padding: '12px' }}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {comentarios.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>#{c.id}</td>
                <td style={{ padding: '12px' }}>Cliente #{c.cliente_id}</td>
                <td style={{ padding: '12px', maxWidth: '400px' }}>{c.texto}</td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: c.estado === 'procesado' ? '#dcfce7' : '#fef3c7',
                      color: c.estado === 'procesado' ? '#15803d' : '#b45309',
                    }}
                  >
                    {c.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};