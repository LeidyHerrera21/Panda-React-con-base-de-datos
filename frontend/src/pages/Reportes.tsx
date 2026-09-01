import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const Reportes: React.FC = () => {
  const [descargando, setDescargando] = useState<string | null>(null);
  const [datosTabla, setDatosTabla] = useState<Record<string, any>[]>([]);
  const [columnas, setColumnas] = useState<string[]>([]);
  const [nombreArchivo, setNombreArchivo] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guardar en el historial de localStorage
  const registrarEnHistorial = (nombre: string, cantidadFilas: number, formato: 'PDF' | 'CSV' | 'EXCEL') => {
    const reportesPrevios = JSON.parse(localStorage.getItem('reportes_guardados') || '[]');
    const nuevoReporte = {
      id: Date.now().toString(),
      nombre: `Excel: ${nombre}`,
      fecha: new Date().toISOString().split('T')[0],
      formato,
      registros: cantidadFilas,
    };
    const listaActualizada = [nuevoReporte, ...reportesPrevios];
    localStorage.setItem('reportes_guardados', JSON.stringify(listaActualizada));
  };

  const manejarSubidaExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNombreArchivo(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const bstr = event.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const primeraHoja = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[primeraHoja];
      
      const jsonDatos = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

      if (jsonDatos.length > 0) {
        setColumnas(Object.keys(jsonDatos[0]));
        setDatosTabla(jsonDatos);
        
        // Auto-guardar entrada en el Dashboard
        registrarEnHistorial(file.name, jsonDatos.length, 'EXCEL');
      }
    };

    reader.readAsBinaryString(file);
  };

  const exportarCSV = () => {
    if (datosTabla.length === 0) return;
    setDescargando('csv');

    setTimeout(() => {
      const headers = columnas.join(',') + '\n';
      const rows = datosTabla.map((row) =>
        columnas.map((col) => `"${row[col] ?? ''}"`).join(',')
      );

      const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exportacion_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      registrarEnHistorial(nombreArchivo || 'Exportación', datosTabla.length, 'CSV');
      setDescargando(null);
    }, 300);
  };

  const exportarPDF = () => {
    if (datosTabla.length === 0) return;
    setDescargando('pdf');

    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('REPORTE GENERADO', 14, 16);

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(10);
      doc.text(`Origen: ${nombreArchivo || 'Datos del Sistema'} | Fecha: ${new Date().toLocaleDateString()}`, 14, 33);

      let y = 45;
      doc.setFontSize(9);
      let x = 14;
      const anchoCol = Math.min(180 / columnas.length, 40);

      doc.setFillColor(241, 245, 249);
      doc.rect(14, y - 4, 180, 7, 'F');
      doc.setTextColor(15, 23, 42);
      
      columnas.slice(0, 5).forEach((col) => {
        doc.text(String(col).substring(0, 12), x, y);
        x += anchoCol;
      });

      y += 8;
      datosTabla.slice(0, 25).forEach((row) => {
        x = 14;
        columnas.slice(0, 5).forEach((col) => {
          doc.text(String(row[col] ?? '').substring(0, 12), x, y);
          x += anchoCol;
        });
        y += 7;
      });

      doc.save(`reporte_${new Date().toISOString().slice(0, 10)}.pdf`);
      registrarEnHistorial(nombreArchivo || 'Exportación', datosTabla.length, 'PDF');
      setDescargando(null);
    }, 300);
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h2 className="dashboard-title">Generación de Reportes</h2>
      
      <div className="widget-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
        <h3 className="widget-title" style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#1e293b' }}>
          Cargar y Exportar Archivos
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
          Los archivos subidos se sincronizan automáticamente con el Panel de Control.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={fileInputRef}
            onChange={manejarSubidaExcel}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '10px 20px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Subir Excel
          </button>

          <button
            onClick={exportarCSV}
            disabled={datosTabla.length === 0 || descargando !== null}
            style={{ padding: '10px 20px', background: datosTabla.length === 0 ? '#94a3b8' : '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: datosTabla.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 600 }}
          >
            {descargando === 'csv' ? 'Exportando...' : 'Exportar CSV'}
          </button>

          <button
            onClick={exportarPDF}
            disabled={datosTabla.length === 0 || descargando !== null}
            style={{ padding: '10px 20px', background: datosTabla.length === 0 ? '#94a3b8' : '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: datosTabla.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 600 }}
          >
            {descargando === 'pdf' ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>

        {nombreArchivo && (
          <p style={{ marginTop: '12px', color: '#0284c7', fontSize: '0.85rem', fontWeight: 600 }}>
            ✓ Archivo cargado y registrado en el Panel: {nombreArchivo} ({datosTabla.length} registros)
          </p>
        )}
      </div>

      {datosTabla.length > 0 && (
        <div className="widget-card" style={{ marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
          <h3 className="widget-title" style={{ marginBottom: '16px', color: '#1e293b' }}>VISTA PREVIA DEL EXCEL</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                {columnas.map((col, i) => (
                  <th key={i} style={{ padding: '12px', textTransform: 'uppercase' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosTabla.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                  {columnas.map((col, i) => (
                    <td key={i} style={{ padding: '12px' }}>{String(row[col] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};