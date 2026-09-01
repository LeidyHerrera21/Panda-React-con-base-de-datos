import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MainLayout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'nlp', label: 'Análisis NLP' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'comentarios', label: 'Comentarios' },
    { id: 'optimizacion', label: 'Optimización' },
    { id: 'reportes', label: 'Reportes' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar de navegación */}
      <aside style={{ width: '240px', background: '#0f172a', padding: '24px 16px', color: '#fff' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '32px', color: '#3b82f6' }}>
          ANALYTICS HUB
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === item.id ? '#2563eb' : 'transparent',
                color: activeTab === item.id ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};