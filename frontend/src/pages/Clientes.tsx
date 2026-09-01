import React, { useState } from 'react';
import { Cliente } from '../types';

const DATOS_INICIALES: Cliente[] = [
  { id: 1, nombre: 'Carlos Mendoza', email: 'carlos@techcorp.com', empresa: 'TechCorp' },
  { id: 2, nombre: 'Ana Torres', email: 'ana@globalnet.com', empresa: 'GlobalNet' },
  { id: 3, nombre: 'Luis Gómez', email: 'luis@logistica.pe', empresa: 'Logística PE' },
];

export const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(DATOS_INICIALES);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevaEmpresa, setNuevaEmpresa] = useState('');
  const [cargando, setCargando] = useState(false);

  const agregarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoEmail) return;

    setCargando(true);
    const nuevo: Cliente = {
      id: Date.now(),
      nombre: nuevoNombre,
      email: nuevoEmail,
      empresa: nuevaEmpresa || 'N/A',
    };

    setClientes((prev) => [...prev, nuevo]);
    setNuevoNombre('');
    setNuevoEmail('');
    setNuevaEmpresa('');
    setCargando(false);
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h2 className="dashboard-title">Gestión de Clientes</h2>

      <div className="widget-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>REGISTRAR CLIENTE</h3>
        <form onSubmit={agregarCliente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={nuevoEmail}
            onChange={(e) => setNuevoEmail(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
          <input
            type="text"
            placeholder="Empresa"
            value={nuevaEmpresa}
            onChange={(e) => setNuevaEmpresa(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
          <button
            type="submit"
            disabled={cargando}
            style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>

      <div className="widget-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>LISTADO DE CLIENTES</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>NOMBRE</th>
              <th style={{ padding: '12px' }}>EMAIL</th>
              <th style={{ padding: '12px' }}>EMPRESA</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>#{c.id}</td>
                <td style={{ padding: '12px' }}>{c.nombre}</td>
                <td style={{ padding: '12px', color: '#2563eb' }}>{c.email}</td>
                <td style={{ padding: '12px' }}>{c.empresa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};