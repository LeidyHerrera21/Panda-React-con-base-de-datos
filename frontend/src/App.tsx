import React, { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { AnalisisNPL } from './pages/AnalisisNPL';
import { Clientes } from './pages/Clientes';
import { Comentarios } from './pages/Comentarios';
import { Optimizacion } from './pages/Optimizacion';
import { Reportes } from './pages/Reportes';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'nlp':
        return <AnalisisNPL />;
      case 'clientes':
        return <Clientes />;
      case 'comentarios':
        return <Comentarios />;
      case 'optimizacion':
        return <Optimizacion />;
      case 'reportes':
        return <Reportes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
};

export default App;