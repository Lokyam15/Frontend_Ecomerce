import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../../services';
import './AdminStyles.css';

/**
 * Componente ProductManager - Conectado al Backend
 * 
 * Este es un ejemplo de cómo conectar el componente con el backend.
 * Puedes usar esta estructura para los demás componentes administrativos.
 */
export default function ProductManagerExample() {
  // Estados
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    estado: 'activo',
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  /**
   * Cargar todos los productos desde el backend
   */
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts({
        estado: 'activo' // Filtrar solo productos activos
      });
      
      // Si la respuesta tiene paginación
      if (data.results) {
        setProducts(data.results);
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar productos. Verifica que el backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar todas las categorías
   */
  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      if (data.results) {
        setCategories(data.results);
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  /**
   * Guardar o actualizar producto
   */
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingProduct) {
        // Actualizar producto existente
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        // Crear nuevo producto
        await productService.createProduct(formData);
      }

      // Recargar productos
      await loadProducts();

      // Limpiar formulario
      resetForm();
    } catch (err) {
      console.error('Error guardando producto:', err);
      setError(err.response?.data?.detail || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Editar producto
   */
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      categoria: product.categoria,
      descripcion: product.descripcion || '',
      estado: product.estado,
    });
    setShowForm(true);
  };

  /**
   * Eliminar producto
   */
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    setLoading(true);
    try {
      await productService.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      setError('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambiar estado del producto (activo/inactivo)
   */
  const toggleProductStatus = async (product) => {
    const newStatus = product.estado === 'activo' ? 'inactivo' : 'activo';
    
    try {
      await productService.patchProduct(product.id, {
        estado: newStatus
      });
      await loadProducts();
    } catch (err) {
      console.error('Error cambiando estado:', err);
      setError('Error al cambiar el estado del producto');
    }
  };

  /**
   * Resetear formulario
   */
  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: '',
      descripcion: '',
      estado: 'activo',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  /**
   * Obtener nombre de categoría
   */
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.nombre : 'Sin categoría';
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Gestión de Productos</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="form-container">
          <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Producto *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loader */}
      {loading && !showForm && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      )}

      {/* Lista de productos */}
      {!loading && (
        <div className="products-list">
          {products.length === 0 ? (
            <div className="empty-state">
              <p>No hay productos registrados</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Crear primer producto
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.nombre}</td>
                      <td>{getCategoryName(product.categoria)}</td>
                      <td className="description-cell">
                        {product.descripcion || '-'}
                      </td>
                      <td>
                        <span className={`badge badge-${product.estado === 'activo' ? 'success' : 'danger'}`}>
                          {product.estado}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleEdit(product)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => toggleProductStatus(product)}
                          title="Cambiar estado"
                        >
                          🔄
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(product.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Instrucciones de uso */}
      <div className="help-box">
        <h4>💡 Cómo usar este módulo:</h4>
        <ul>
          <li>Haz clic en "Nuevo Producto" para crear un producto</li>
          <li>Usa el botón ✏️ para editar</li>
          <li>Usa el botón 🔄 para activar/desactivar</li>
          <li>Usa el botón 🗑️ para eliminar</li>
        </ul>
        <p><strong>Nota:</strong> Este componente está conectado al backend. Asegúrate de que el servidor esté ejecutándose.</p>
      </div>
    </div>
  );
}
