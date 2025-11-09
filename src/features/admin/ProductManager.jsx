import React, { useState } from 'react';
import './AdminStyles.css';

export default function ProductManager() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Camiseta Básica',
      description: 'Camiseta de algodón 100%',
      category: 'Camisetas',
      price: 29.99,
      stock: {
        S: { black: 10, white: 15, red: 5 },
        M: { black: 20, white: 20, red: 10 },
        L: { black: 15, white: 15, red: 8 }
      },
      images: [],
      details: {
        material: 'Algodón',
        care: 'Lavado en máquina',
        origin: 'Nacional'
      }
    }
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: {},
    images: [],
    details: {
      material: '',
      care: '',
      origin: ''
    }
  });

  // Valores predefinidos
  const categories = ['Camisetas', 'Pantalones', 'Vestidos', 'Chaquetas'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Negro', value: 'black' },
    { name: 'Blanco', value: 'white' },
    { name: 'Rojo', value: 'red' },
    { name: 'Azul', value: 'blue' }
  ];

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));

    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, ...newImages]
    });
  };

  const removeImage = (index) => {
    setNewProduct({
      ...newProduct,
      images: newProduct.images.filter((_, i) => i !== index)
    });
  };

  const updateStock = (size, color, quantity) => {
    setNewProduct(prev => {
      const updatedStock = { ...prev.stock };
      if (!updatedStock[size]) {
        updatedStock[size] = {};
      }
      updatedStock[size][color] = parseInt(quantity) || 0;
      return { ...prev, stock: updatedStock };
    });
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...newProduct, id: p.id } : p
      ));
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
    }
    
    setNewProduct({
      name: '',
      description: '',
      category: '',
      price: '',
      stock: {},
      images: [],
      details: {
        material: '',
        care: '',
        origin: ''
      }
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="admin-section">
      <h2>Gestión de Productos</h2>

      <div className="product-management">
        <div className="product-list">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.images[0] ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    ) : (
                      <div className="no-image">Sin imagen</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => setShowDetail(product)}>👁️</button>
                      <button onClick={() => handleEdit(product)}>✏️</button>
                      <button onClick={() => handleDelete(product.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="product-form">
          <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Imágenes</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="image-preview">
              {newProduct.images.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img src={img.url} alt={`Preview ${index + 1}`} />
                  <button onClick={() => removeImage(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Stock por Talla y Color</label>
            <div className="stock-grid">
              <table>
                <thead>
                  <tr>
                    <th>Talla/Color</th>
                    {colors.map(color => (
                      <th key={color.value}>{color.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizes.map(size => (
                    <tr key={size}>
                      <td>{size}</td>
                      {colors.map(color => (
                        <td key={color.value}>
                          <input
                            type="number"
                            min="0"
                            value={newProduct.stock[size]?.[color.value] || ''}
                            onChange={(e) => updateStock(size, color.value, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="form-group">
            <label>Detalles adicionales</label>
            <div className="details-inputs">
              <input
                type="text"
                placeholder="Material"
                value={newProduct.details.material}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  details: { ...newProduct.details, material: e.target.value }
                })}
              />
              <input
                type="text"
                placeholder="Instrucciones de cuidado"
                value={newProduct.details.care}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  details: { ...newProduct.details, care: e.target.value }
                })}
              />
              <input
                type="text"
                placeholder="Origen"
                value={newProduct.details.origin}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  details: { ...newProduct.details, origin: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="button-group">
            <button className="save-button" onClick={handleSave}>
              {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
            {editingProduct && (
              <button 
                className="cancel-button"
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                    stock: {},
                    images: [],
                    details: { material: '', care: '', origin: '' }
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <div className="product-detail-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowDetail(null)}>×</button>
            
            <h3>{showDetail.name}</h3>
            
            <div className="detail-images">
              {showDetail.images.map((img, index) => (
                <img key={index} src={img.url} alt={`${showDetail.name} ${index + 1}`} />
              ))}
            </div>
            
            <div className="detail-info">
              <p><strong>Categoría:</strong> {showDetail.category}</p>
              <p><strong>Precio:</strong> ${showDetail.price}</p>
              <p><strong>Descripción:</strong> {showDetail.description}</p>
              
              <div className="stock-info">
                <h4>Stock Disponible</h4>
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>Talla</th>
                      <th>Color</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(showDetail.stock).map(([size, colorStock]) => 
                      Object.entries(colorStock).map(([color, quantity]) => (
                        <tr key={`${size}-${color}`}>
                          <td>{size}</td>
                          <td>{color}</td>
                          <td>{quantity}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="product-details">
                <h4>Detalles del Producto</h4>
                <p><strong>Material:</strong> {showDetail.details.material}</p>
                <p><strong>Cuidado:</strong> {showDetail.details.care}</p>
                <p><strong>Origen:</strong> {showDetail.details.origin}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}