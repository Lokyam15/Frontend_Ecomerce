import React, { useState } from 'react';
import './AdminStyles.css';

export default function AIReports() {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [report, setReport] = useState(null);
  const [showReportView, setShowReportView] = useState(false);

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Tu navegador no soporta entrada por voz');
    }
  };

  const generateReport = () => {
    // Aquí iría la llamada a la API de IA
    const mockReport = {
      title: "Reporte de Análisis",
      content: "Este es un reporte de ejemplo basado en el prompt: " + prompt,
      date: new Date().toLocaleDateString()
    };
    setReport(mockReport);
    setShowReportView(true);
  };

  const downloadReport = (format) => {
    // Aquí iría la lógica de descarga según el formato
    console.log(`Descargando en formato ${format}`);
  };

  if (showReportView && report) {
    return (
      <div className="admin-section">
        <div className="report-view">
          <button 
            className="back-button"
            onClick={() => setShowReportView(false)}
          >
            ← Volver
          </button>
          
          <h2>{report.title}</h2>
          <div className="report-meta">
            Generado el: {report.date}
          </div>
          
          <div className="report-content">
            {report.content}
          </div>
          
          <div className="download-options">
            <h3>Descargar como:</h3>
            <div className="download-buttons">
              <button onClick={() => downloadReport('pdf')}>PDF</button>
              <button onClick={() => downloadReport('excel')}>Excel</button>
              <button onClick={() => downloadReport('word')}>Word</button>
              <button onClick={() => downloadReport('csv')}>CSV</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h2>Generador de Reportes con IA</h2>
      
      <div className="report-generator">
        <div className="input-container">
          <textarea
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe el reporte que necesitas..."
            rows={4}
          />
          <div className="input-controls">
            <button
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              title="Entrada por voz"
            >
              🎤
            </button>
            <button
              className="generate-button"
              onClick={generateReport}
              disabled={!prompt.trim()}
            >
              Generar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}