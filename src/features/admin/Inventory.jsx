import React from 'react';
import './AdminStyles.css';

export default function Inventory() {
  const inventory = [
    { id: 1, name: 'Camiseta Básica', details: 'Algodón 100%', stock: 50 },
    { id: 2, name: 'Pantalón Jean', details: 'Denim azul', stock: 30 },
    { id: 3, name: 'Chaqueta', details: 'Cuero sintético', stock: 15 }
  ];

  return (
    <div className="admin-section">
      <h2>Inventario</h2>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Detalle</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.details}</td>
                <td>{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}