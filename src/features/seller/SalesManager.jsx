import React, { useState } from 'react';
import '../admin/AdminStyles.css';
import './SalesManager.css';

export default function SalesManager() {
  const [saleItems, setSaleItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productCode: '',
    quantity: 1,
  });
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  // Simulación de productos
  const products = {
    'P001': { name: 'Camiseta Básica', price: 29.99 },
    'P002': { name: 'Pantalón Jean', price: 59.99 },
    'P003': { name: 'Chaqueta', price: 89.99 },
  };

  const handleAddItem = () => {
    const product = products[currentItem.productCode];
    if (!product) {
      alert('Producto no encontrado');
      return;
    }

    setSaleItems([
      ...saleItems,
      {
        ...currentItem,
        id: Date.now(),
        productName: product.name,
        price: product.price,
        subtotal: product.price * currentItem.quantity
      }
    ]);

    setCurrentItem({
      productCode: '',
      quantity: 1,
    });
  };

  const handleRemoveItem = (id) => {
    setSaleItems(saleItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handlePayment = (method) => {
    if (saleItems.length === 0) {
      alert('Agregue productos a la venta');
      return;
    }
    
    // Aquí iría la lógica de procesar el pago
    alert(`Venta procesada con ${method}`);
    setSaleItems([]);
    setShowPaymentMethods(false);
  };

  return (
    <div className="admin-section">
      <h2>Registro de Ventas</h2>
      
      <div className="sale-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Código de producto"
            value={currentItem.productCode}
            onChange={(e) => setCurrentItem({
              ...currentItem,
              productCode: e.target.value.toUpperCase()
            })}
          />
          <input
            type="number"
            min="1"
            value={currentItem.quantity}
            onChange={(e) => setCurrentItem({
              ...currentItem,
              quantity: parseInt(e.target.value) || 1
            })}
          />
          <button onClick={handleAddItem}>Agregar</button>
        </div>

        <div className="sale-items">
          {saleItems.map(item => (
            <div key={item.id} className="sale-item">
              <span className="item-code">{item.productCode}</span>
              <span className="item-name">{item.productName}</span>
              <span className="item-quantity">x{item.quantity}</span>
              <span className="item-price">${item.price.toFixed(2)}</span>
              <span className="item-subtotal">${item.subtotal.toFixed(2)}</span>
              <button 
                className="remove-item"
                onClick={() => handleRemoveItem(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="sale-summary">
          <div className="total">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          {!showPaymentMethods ? (
            <button 
              className="payment-button"
              onClick={() => setShowPaymentMethods(true)}
              disabled={saleItems.length === 0}
            >
              Proceder al Pago
            </button>
          ) : (
            <div className="payment-methods">
              <button onClick={() => handlePayment('Efectivo')}>Efectivo</button>
              <button onClick={() => handlePayment('Tarjeta')}>Tarjeta</button>
              <button onClick={() => setShowPaymentMethods(false)}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}