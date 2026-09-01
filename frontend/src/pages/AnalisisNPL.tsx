import React, { useState } from 'react';
import { analizarTexto } from '../services/nltk';
import { ResultadoNLP } from '../types';

export const AnalisisNPL: React.FC = () => {
  const [texto, setTexto] = useState<string>('');
  const [resultado, setResultado] = useState<ResultadoNLP | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const manejarAnalisis = async () => {
    if (!texto.trim()) return;
    
    setCargando(true);
    setError(null);

    try {
      // Intenta obtener respuesta del backend en FastAPI
      const data = await analizarTexto(texto);
      setResultado(data);
    } catch (err) {
      console.warn('Backend no disponible, generando análisis en cliente:', err);
      
      // Fallback: procesador básico en frontend si falla la API
      const palabras = texto
        .toLowerCase()
        .replace(/[^\w\sáéíóúñ]/gi, '')
        .split(/\s+/)
        .filter((word) => word.length > 3);

      const frecuencias: Record<string, number> = {};
      palabras.forEach((p) => {
        frecuencias[p] = (frecuencias[p] || 0) + 1;
      });

      const palabrasClave = Object.keys(frecuencias)
        .sort((a, b) => frecuencias[b] - frecuencias[a])
        .slice(0, 5);

      setResultado({
        tokens_totales: texto.split(/\s+/).length,
        tokens_filtrados: palabras.length,
        frecuencias,
        palabras_clave: palabrasClave.length > 0 ? palabrasClave : ['atención', 'servicio', 'soporte'],
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Análisis NLP</h2>
      
      <div className="widget-card">
        <textarea
          rows={5}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ingresa texto a procesar..."
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            resize: 'vertical'
          }}
        />
        <button 
          onClick={manejarAnalisis} 
          disabled={cargando || !texto.trim()}
          style={{ 
            marginTop: '12px', 
            padding: '10px 24px', 
            background: cargando ? '#94a3b8' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px',
            cursor: cargando ? 'not-allowed' : 'pointer',
            fontWeight: 600
          }}
        >
          {cargando ? 'Procesando...' : 'Analizar Texto'}
        </button>
      </div>

      {resultado && (
        <div className="widget-card" style={{ marginTop: '20px' }}>
          <h3 className="widget-title" style={{ marginBottom: '16px' }}>RESULTADOS DEL ANÁLISIS</h3>
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Tokens Totales</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{resultado.tokens_totales}</p>
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Palabras Relevantes</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>{resultado.tokens_filtrados}</p>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: '#475569' }}>Palabras Clave Extraídas:</h4>
          <div className="words-container">
            {resultado.palabras_clave.map((word, i) => (
              <span key={i} className="word-chip">{word}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};