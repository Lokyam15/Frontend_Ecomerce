import React, { useState, useEffect } from 'react';
import './AdminStyles.css';
import categoryService from '../../services/categoryService';

export default function CategoryManager() {
  console.log('🔵 CategoryManager: Componente renderizándose...');
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [newCategory, setNewCategory] = useState({
    nombre: '',
    id_padre: '',
    estado: 'activo'
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    console.log('CategoryManager montado - cargando categorías...');
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      console.log('Llamando a categoryService.getAll()...');
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      console.log('Categorías recibidas:', data);
      console.log('Tipo de data:', typeof data);
      console.log('Es array?:', Array.isArray(data));
      
      // Asegurar que siempre sea un array
      let categoriesArray = [];
      if (Array.isArray(data)) {
        categoriesArray = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
        // Si viene paginado
        categoriesArray = data.results;
      } else {
        console.warn('Formato de datos inesperado:', data);
        categoriesArray = [];
      }
      
      // Ordenar: primero categorías principales, luego subcategorías
      const sorted = categoriesArray.sort((a, b) => {
        // Si ambas son principales o ambas son subcategorías, ordenar por nombre
        if ((a.id_padre === null && b.id_padre === null) || 
            (a.id_padre !== null && b.id_padre !== null)) {
          return a.nombre.localeCompare(b.nombre);
        }
        // Las principales van primero
        return a.id_padre === null ? -1 : 1;
      });
      
      setCategories(sorted);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      console.error('Detalles del error:', err.response);
      setError('No se pudieron cargar las categorías. Verifica que el servidor backend esté corriendo en http://localhost:8000');
      setCategories([]); // Asegurar que categories sea un array
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.nombre.trim() === '') {
      setError('El nombre de la categoría es requerido');
      return;
    }

    try {
      console.log('Guardando categoría:', newCategory);
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Preparar datos: convertir string vacío a null para id_padre
      const categoryData = {
        nombre: newCategory.nombre,
        id_padre: newCategory.id_padre === '' ? null : parseInt(newCategory.id_padre),
        estado: newCategory.estado
      };

      console.log('Datos a enviar:', categoryData);

      if (editMode) {
        // Actualizar categoría existente
        console.log('Actualizando categoría ID:', editId);
        const updated = await categoryService.update(editId, categoryData);
        console.log('Categoría actualizada:', updated);
        setCategories(categories.map(cat => 
          cat.id === editId ? updated : cat
        ));
        setEditMode(false);
        setEditId(null);
        setSuccess('✅ Categoría actualizada exitosamente');
      } else {
        // Crear nueva categoría
        console.log('Creando nueva categoría...');
        const created = await categoryService.create(categoryData);
        console.log('Categoría creada exitosamente:', created);
        
        // Agregar la nueva categoría al estado
        setCategories([...categories, created]);
        setSuccess('✅ Categoría creada exitosamente');
      }

      // Limpiar formulario
      setNewCategory({ nombre: '', id_padre: '', estado: 'activo' });
      
      // Mostrar mensaje de éxito
      console.log('✅ Operación exitosa. Recargando lista...');
      
      // Recargar la lista para asegurar sincronización
      setTimeout(() => {
        loadCategories();
        setSuccess(null);
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error al guardar categoría:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      
      // Extraer mensaje de error específico
      let errorMsg = 'Error al guardar la categoría';
      if (err.response?.data) {
        if (err.response.data.nombre) {
          errorMsg = `Nombre: ${err.response.data.nombre[0]}`;
        } else if (err.response.data.id_padre) {
          errorMsg = `Categoría Padre: ${err.response.data.id_padre[0]}`;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setNewCategory({ 
      nombre: category.nombre,
      id_padre: category.id_padre || '',
      estado: category.estado 
    });
    setEditMode(true);
    setEditId(category.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      setLoading(true);
      setError(null);
      await categoryService.delete(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      setError(err.response?.data?.message || 'Error al eliminar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setNewCategory({ nombre: '', id_padre: '', estado: 'activo' });
    setError(null);
  };

  return (
    <div className="admin-section">
      <h2>Gestionar Categorías</h2>
      
      {success && (
        <div className="success-message" style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          {success}
        </div>
      )}
      
      {error && (
        <div className="error-message" style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: '#fee', 
          color: '#c33', 
          borderRadius: '4px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando...
        </div>
      )}

      <div className="admin-form">
        <div className="form-group">
          <label>Nombre de la Categoría</label>
          <input
            type="text"
            value={newCategory.nombre}
            onChange={(e) => setNewCategory({ ...newCategory, nombre: e.target.value })}
            placeholder="Ej: Camisetas, Pantalones, etc."
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Categoría Padre (opcional)</label>
          <select
            value={newCategory.id_padre}
            onChange={(e) => setNewCategory({ ...newCategory, id_padre: e.target.value })}
            disabled={loading}
          >
            <option value="">-- Categoría Principal --</option>
            {categories
              .filter(cat => cat.id !== editId && cat.id_padre === null)
              .map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))
            }
          </select>
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            Si no seleccionas nada, será una categoría principal. Si seleccionas una categoría, será una subcategoría.
          </small>
        </div>
        
        <div className="form-group">
          <label>Estado</label>
          <select
            value={newCategory.estado}
            onChange={(e) => setNewCategory({ ...newCategory, estado: e.target.value })}
            disabled={loading}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="save-button"
            onClick={handleAddCategory}
            disabled={loading}
          >
            {editMode ? 'Actualizar Categoría' : 'Agregar Categoría'}
          </button>
          {editMode && (
            <button 
              className="delete-button"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría Padre</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Subcategorías</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && !loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                  No hay categorías registradas
                </td>
              </tr>
            ) : (
              categories.map(category => (
                <tr key={category.id} style={{
                  backgroundColor: category.id_padre ? '#f8f9fa' : 'white'
                }}>
                  <td>{category.id}</td>
                  <td>
                    {category.id_padre && <span style={{ color: '#999', marginRight: '8px' }}>└─</span>}
                    <strong>{category.nombre}</strong>
                  </td>
                  <td>
                    {category.nombre_padre ? (
                      <span style={{ 
                        padding: '2px 8px', 
                        backgroundColor: '#e3f2fd', 
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}>
                        {category.nombre_padre}
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                    )}
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: category.es_categoria_principal ? '#fff3cd' : '#d1ecf1',
                      color: category.es_categoria_principal ? '#856404' : '#0c5460',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {category.es_categoria_principal ? '📁 Principal' : '📂 Subcategoría'}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: category.estado === 'activo' ? '#d4edda' : '#f8d7da',
                      color: category.estado === 'activo' ? '#155724' : '#721c24',
                      fontSize: '12px'
                    }}>
                      {category.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {category.subcategorias_count > 0 ? (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#e7f3ff',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#0066cc'
                      }}>
                        {category.subcategorias_count}
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>-</span>
                    )}
                  </td>
                  <td>{new Date(category.creado_en).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(category)}
                        disabled={loading}
                        title="Editar categoría"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(category.id)}
                        disabled={loading}
                        title="Eliminar categoría"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}