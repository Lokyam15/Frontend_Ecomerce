import React from 'react';
import './AdminStyles.css';

export default function Sales() {
  const sales = [
    {
      id: 1,
      productId: 'P001',
      productName: 'Camiseta Básica',
      quantity: 2,
      amount: 50.00,
      customer: 'Juan Pérez'
    },
    {
      id: 2,
      productId: 'P002',
      productName: 'Pantalón Jean',
      quantity: 1,
      amount: 75.00,
      customer: 'María García'
    }
  ];

  return (
    <div className="admin-section">
      <h2>Registro de Ventas</h2>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Nombre Producto</th>
              <th>Cantidad</th>
              <th>Monto</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.productId}</td>
                <td>{sale.productName}</td>
                <td>{sale.quantity}</td>
                <td>${sale.amount.toFixed(2)}</td>
                <td>{sale.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}