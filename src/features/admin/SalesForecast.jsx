import React, { useState } from 'react';
import './AdminStyles.css';

export default function SalesForecast() {
  const [forecastData, setForecastData] = useState({
    season: '',
    event: '',
    startDate: '',
    endDate: '',
    category: ''
  });

  const [recommendations, setRecommendations] = useState(null);

  const seasons = ['Verano', 'Otoño', 'Invierno', 'Primavera'];
  const events = [
    'Navidad',
    'Año Nuevo',
    'San Valentín',
    'Día de la Madre',
    'Fiestas Patrias',
    'Black Friday',
    'Otro'
  ];
  const categories = ['Ropa Casual', 'Ropa Formal', 'Deportiva', 'Accesorios'];

  const generateForecast = () => {
    // Aquí iría la llamada al servicio de IA para generar pronósticos
    const mockRecommendations = {
      predictedSales: 1500,
      topProducts: [
        {
          name: 'Vestidos de fiesta',
          quantity: 50,
          confidence: 0.85
        },
        {
          name: 'Blusas formales',
          quantity: 30,
          confidence: 0.75
        }
      ],
      marketTrends: [
        'Alta demanda en colores metálicos',
        'Preferencia por telas sostenibles',
        'Tendencia en diseños minimalistas'
      ],
      stockRecommendations: [
        'Mantener 60% del inventario en tallas M',
        'Priorizar colores neutros',
        'Incluir opciones plus size'
      ]
    };
    setRecommendations(mockRecommendations);
  };

  return (
    <div className="admin-section">
      <h2>Pronóstico de Ventas</h2>
      
      <div className="forecast-form">
        <div className="form-row">
          <div className="form-group">
            <label>Temporada</label>
            <select
              value={forecastData.season}
              onChange={(e) => setForecastData({...forecastData, season: e.target.value})}
            >
              <option value="">Seleccionar temporada</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Evento/Ocasión</label>
            <select
              value={forecastData.event}
              onChange={(e) => setForecastData({...forecastData, event: e.target.value})}
            >
              <option value="">Seleccionar evento</option>
              {events.map(event => (
                <option key={event} value={event}>{event}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha de Inicio</label>
            <input
              type="date"
              value={forecastData.startDate}
              onChange={(e) => setForecastData({...forecastData, startDate: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Fecha de Fin</label>
            <input
              type="date"
              value={forecastData.endDate}
              onChange={(e) => setForecastData({...forecastData, endDate: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Categoría de Productos</label>
          <select
            value={forecastData.category}
            onChange={(e) => setForecastData({...forecastData, category: e.target.value})}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <button 
          className="generate-button"
          onClick={generateForecast}
        >
          Generar Pronóstico
        </button>
      </div>

      {recommendations && (
        <div className="forecast-results">
          <h3>Resultados del Pronóstico</h3>
          
          <div className="forecast-card">
            <h4>Ventas Estimadas</h4>
            <div className="forecast-value">{recommendations.predictedSales} unidades</div>
          </div>

          <div className="forecast-section">
            <h4>Productos Recomendados</h4>
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Confianza</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.topProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{(product.confidence * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="forecast-section">
            <h4>Tendencias del Mercado</h4>
            <ul className="trend-list">
              {recommendations.marketTrends.map((trend, index) => (
                <li key={index}>{trend}</li>
              ))}
            </ul>
          </div>

          <div className="forecast-section">
            <h4>Recomendaciones de Stock</h4>
            <ul className="recommendation-list">
              {recommendations.stockRecommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}