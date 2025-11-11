import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import './OrderTracking.css';

export default function OrderTracking({ user, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      alert('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const tracking = await orderService.trackOrder(order.id);
      setTrackingInfo(tracking);
      setSelectedOrder(order);
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
      alert('Error al obtener detalles del pedido');
    }
  };

  const handleRetryPayment = async (orderId) => {
    if (!confirm('¿Deseas intentar procesar el pago nuevamente?')) return;
    
    try {
      const result = await orderService.processPayment(orderId);
      if (result.success) {
        alert(`✅ ${result.message}`);
        loadOrders();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al procesar el pago');
    }
  };

  const getStatusBadge = (estado) => {
    const statusMap = {
      'BORRADOR': { label: '⏳ Pendiente de Pago', class: 'status-pending' },
      'PAGADA': { label: '✅ Pagado', class: 'status-paid' },
      'ENVIADA': { label: '🚚 Enviado', class: 'status-shipped' },
      'ANULADA': { label: '❌ Cancelado', class: 'status-cancelled' }
    };
    
    const status = statusMap[estado] || { label: estado, class: 'status-unknown' };
    return <span className={`status-badge ${status.class}`}>{status.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-tracking-overlay">
        <div className="order-tracking-modal">
          <div className="loading-spinner">⏳ Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="order-tracking-modal">
        <div className="order-tracking-header">
          <h2>📦 Mis Pedidos</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="order-tracking-content">
          {orders.length === 0 ? (
            <div className="no-orders">
              <p>🛍️ No tienes pedidos aún</p>
              <p className="no-orders-subtitle">¡Empieza a comprar ahora!</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <h3>Pedido #{order.codigo}</h3>
                      <p className="order-date">📅 {formatDate(order.creado_en)}</p>
                    </div>
                    {getStatusBadge(order.estado)}
                  </div>

                  <div className="order-card-body">
                    <div className="order-summary">
                      <p><strong>Total:</strong> ${parseFloat(order.total).toFixed(2)}</p>
                      <p><strong>Productos:</strong> {order.items?.length || 0} item(s)</p>
                      {order.payment_info && (
                        <p><strong>Método de pago:</strong> {order.payment_info.method}</p>
                      )}
                    </div>

                    <div className="order-actions">
                      <button 
                        className="btn-view-details"
                        onClick={() => handleViewDetails(order)}
                      >
                        👁️ Ver Detalles
                      </button>
                      
                      {order.estado === 'BORRADOR' && (
                        <button 
                          className="btn-retry-payment"
                          onClick={() => handleRetryPayment(order.id)}
                        >
                          💳 Pagar Ahora
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de detalles del pedido */}
        {selectedOrder && trackingInfo && (
          <div className="order-detail-overlay" onClick={() => {
            setSelectedOrder(null);
            setTrackingInfo(null);
          }}>
            <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="order-detail-header">
                <h3>Detalle del Pedido #{selectedOrder.codigo}</h3>
                <button 
                  className="close-btn" 
                  onClick={() => {
                    setSelectedOrder(null);
                    setTrackingInfo(null);
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="order-detail-content">
                {/* Timeline de seguimiento */}
                <div className="tracking-timeline">
                  <h4>📍 Seguimiento del Pedido</h4>
                  <div className="timeline">
                    {trackingInfo.timeline.map((step, index) => (
                      <div 
                        key={index} 
                        className={`timeline-step ${step.completed ? 'completed' : 'pending'}`}
                      >
                        <div className="timeline-marker">
                          {step.completed ? '✓' : '○'}
                        </div>
                        <div className="timeline-content">
                          <h5>{step.label}</h5>
                          {step.date && <p>{formatDate(step.date)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items del pedido */}
                <div className="order-items-detail">
                  <h4>🛍️ Productos</h4>
                  <div className="items-list">
                    {trackingInfo.order.items.map((item, index) => (
                      <div key={index} className="item-row">
                        <div className="item-info">
                          <strong>{item.product_name}</strong>
                          <p>Cantidad: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          ${parseFloat(item.subtotal).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-total-detail">
                    <strong>Total:</strong> ${parseFloat(trackingInfo.order.total).toFixed(2)}
                  </div>
                </div>

                {/* Información de pago */}
                {trackingInfo.order.payment_info && (
                  <div className="payment-info-detail">
                    <h4>💳 Información de Pago</h4>
                    <p><strong>Método:</strong> {trackingInfo.order.payment_info.method}</p>
                    <p><strong>Estado:</strong> {trackingInfo.order.payment_info.status}</p>
                    <p><strong>Monto:</strong> ${parseFloat(trackingInfo.order.payment_info.amount).toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
