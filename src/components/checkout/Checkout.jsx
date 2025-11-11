import React, { useState } from 'react';
import orderService from '../../services/orderService';
import './Checkout.css';

export default function Checkout({ cart, user, onClose, onConfirmOrder }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'credit_card', name: 'Tarjeta de Crédito', icon: '💳', description: 'Visa, Mastercard, American Express' },
    { id: 'debit_card', name: 'Tarjeta de Débito', icon: '💳', description: 'Pago con tarjeta de débito' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Pago seguro con PayPal' },
    { id: 'bank_transfer', name: 'Transferencia Bancaria', icon: '🏦', description: 'Depósito o transferencia' },
    { id: 'cash', name: 'Efectivo contra entrega', icon: '💵', description: 'Paga cuando recibas tu pedido' }
  ];

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = 5.00; // Costo fijo de envío
  const finalTotal = total + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
      alert('Por favor completa todos los campos de envío');
      return;
    }

    setLoading(true);

    // Preparar datos del pedido
    const orderData = {
      items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        color: item.selectedColor,
        size: item.selectedSize
      })),
      payment_method: selectedPaymentMethod,
      shipping_address: shippingInfo.address,
      city: shippingInfo.city,
      phone: shippingInfo.phone,
      notes: shippingInfo.notes,
      subtotal: total,
      shipping_cost: shipping,
      total: finalTotal
    };

    try {
      // Llamar al backend para crear el pedido
      const response = await onConfirmOrder(orderData);
      
      if (response && response.order) {
        // Intentar procesar el pago
        const paymentResult = await orderService.processPayment(response.order.id);
        
        if (paymentResult.success) {
          alert(`✅ ${paymentResult.message}\nCódigo del pedido: ${response.order.codigo}`);
          onClose();
        } else {
          alert(`❌ ${paymentResult.message}\nTu pedido fue creado pero el pago falló. Puedes intentar pagar nuevamente desde "Mis Pedidos".`);
          onClose();
        }
      } else {
        alert('⚠️ Hubo un problema al crear el pedido. Por favor verifica que el servidor backend esté corriendo.');
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      
      // Mensajes de error más específicos
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        alert('❌ No se pudo conectar con el servidor.\n\n' +
              'Por favor verifica que el backend de Django esté corriendo en:\n' +
              'http://127.0.0.1:8000\n\n' +
              'Ejecuta: cd boutique-main && python manage.py runserver');
      } else if (error.response?.status === 401) {
        alert('⚠️ Debes iniciar sesión para completar la compra.');
      } else if (error.response?.status === 400) {
        alert('❌ Datos del pedido inválidos. Por favor revisa la información ingresada.');
      } else {
        alert('❌ Error al procesar el pedido. Por favor intenta de nuevo.\n\n' +
              'Error: ' + (error.message || 'Desconocido'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>💳 Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="checkout-content">
          <div className="checkout-left">
            {/* Resumen del pedido */}
            <div className="order-summary-section">
              <h3>📦 Resumen del Pedido</h3>
              <div className="order-items">
                {cart.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.images?.[0] || '/placeholder.png'} alt={item.name} />
                    <div className="order-item-info">
                      <h4>{item.name}</h4>
                      <p>Color: {item.selectedColor} | Talla: {item.selectedSize}</p>
                      <p>Cantidad: {item.quantity || 1}</p>
                    </div>
                    <div className="order-item-price">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Envío:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Información de envío */}
            <div className="shipping-section">
              <h3>🚚 Información de Envío</h3>
              <form className="shipping-form">
                <div className="form-group">
                  <label>Dirección de Entrega *</label>
                  <input
                    type="text"
                    placeholder="Calle, número, apartamento"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    placeholder="Ciudad"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono de Contacto *</label>
                  <input
                    type="tel"
                    placeholder="+591 70000000"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Notas adicionales (opcional)</label>
                  <textarea
                    placeholder="Instrucciones especiales para la entrega"
                    value={shippingInfo.notes}
                    onChange={(e) => setShippingInfo({...shippingInfo, notes: e.target.value})}
                    rows="3"
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="checkout-right">
            {/* Métodos de pago */}
            <div className="payment-section">
              <h3>💰 Método de Pago</h3>
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`payment-method ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="payment-icon">{method.icon}</div>
                    <div className="payment-info">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>
                    <div className="payment-radio">
                      {selectedPaymentMethod === method.id && <div className="radio-selected"></div>}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="confirm-order-btn"
                onClick={handleSubmit}
                disabled={loading || !selectedPaymentMethod}
              >
                {loading ? '⏳ Procesando...' : '✅ Confirmar Pedido'}
              </button>

              <p className="security-note">
                🔒 Tu información está protegida y segura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
