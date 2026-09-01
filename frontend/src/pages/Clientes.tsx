import React, { useEffect, useState } from 'react';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  empresa: string;
}

export const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    fetch('/api/clientes/')
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(console.error);
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Gestión de Clientes</h2>
      <div className="widget-card">
        <ul className="categories-list">
          {clientes.map((c) => (
            <li key={c.id} className="category-item">
              <div>
                <strong className="category-name">{c.nombre}</strong> — <span style={{ color: '#64748b' }}>{c.empresa}</span>
              </div>
              <span className="category-percent">{c.email}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

