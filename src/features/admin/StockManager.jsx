import React, { useState } from 'react';
import './AdminStyles.css';

export default function StockManager() {
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Camiseta Básica',
      category: 'Camisetas',
      details: 'Algodón 100%',
      stock: 50,
      price: 29.99
    }
  ]);

  const [categories] = useState([
    'Camisetas',
    'Pantalones',
    'Chaquetas',
    'Zapatos',
    'Accesorios'
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    details: '',
    stock: '',
    price: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAddProduct = () => {
    if (newProduct.name.trim() === '' || newProduct.category === '') return;

    if (editMode) {
      setProducts(products.map(prod => 
        prod.id === editId ? { ...prod, ...newProduct } : prod
      ));
      setEditMode(false);
      setEditId(null);
    } else {
      setProducts([
        ...products,
        {
          id: Date.now(),
          ...newProduct
        }
      ]);
    }

    setNewProduct({
      name: '',
      category: '',
      details: '',
      stock: '',
      price: ''
    });
  };

  const handleEdit = (product) => {
    setNewProduct({ 
      name: product.name,
      category: product.category,
      details: product.details,
      stock: product.stock,
      price: product.price
    });
    setEditMode(true);
    setEditId(product.id);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(prod => prod.id !== id));
  };

  const handleStockUpdate = (id, amount) => {
    setProducts(products.map(prod => 
      prod.id === id 
        ? { ...prod, stock: Math.max(0, parseInt(prod.stock) + amount) }
        : prod
    ));
  };

  return (
    <div className="admin-section">
      <h2>Gestionar Stock</h2>
      
      <div className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Nombre del producto"
            />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Inicial</label>
            <input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              placeholder="Cantidad"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="Precio unitario"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Detalles</label>
          <textarea
            value={newProduct.details}
            onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
            placeholder="Descripción del producto"
            rows="3"
          />
        </div>

        <button 
          className="save-button"
          onClick={handleAddProduct}
        >
          {editMode ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Detalles</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.details}</td>
                <td>
                  <div className="stock-control">
                    <button 
                      className="stock-button"
                      onClick={() => handleStockUpdate(product.id, -1)}
                    >
                      -
                    </button>
                    {product.stock}
                    <button 
                      className="stock-button"
                      onClick={() => handleStockUpdate(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>${product.price}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(product)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}