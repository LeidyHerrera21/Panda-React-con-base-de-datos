import React from 'react';

export const Metricas: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Métricas Generales</h2>
      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-title">Disponibilidad Sistema</p>
          <p className="kpi-value">99.9%</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-title">Peticiones / min</p>
          <p className="kpi-value">1,420</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-title">Tiempo de Respuesta</p>
          <p className="kpi-value">45ms</p>
        </div>
      </div>
    </div>
  );
};