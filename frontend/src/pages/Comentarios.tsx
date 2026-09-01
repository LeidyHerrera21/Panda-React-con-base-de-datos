import React, { useEffect, useState } from 'react';

interface Comentario {
  id: number;
  cliente_id: number;
  texto: string;
  estado: string;
}

export const Comentarios: React.FC = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
    fetch('/api/comentarios/')
      .then((res) => res.json())
      .then((data) => setComentarios(data))
      .catch(console.error);
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Comentarios y Feedback</h2>
      <div className="widgets-grid">
        {comentarios.map((item) => (
          <div key={item.id} className="widget-card">
            <span className="category-percent" style={{ marginBottom: '8px', display: 'inline-block' }}>
              Estado: {item.estado}
            </span>
            <p className="category-name" style={{ fontSize: '1rem', marginTop: '8px' }}>
              "{item.texto}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};