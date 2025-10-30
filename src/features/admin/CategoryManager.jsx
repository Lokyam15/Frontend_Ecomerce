import React, { useState } from 'react';
import './AdminStyles.css';

export default function CategoryManager() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Camisetas', details: 'Ropa superior casual' },
    { id: 2, name: 'Pantalones', details: 'Ropa inferior para toda ocasión' }
  ]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    details: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAddCategory = () => {
    if (newCategory.name.trim() === '') return;

    if (editMode) {
      setCategories(categories.map(cat => 
        cat.id === editId ? { ...cat, ...newCategory } : cat
      ));
      setEditMode(false);
      setEditId(null);
    } else {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          ...newCategory
        }
      ]);
    }

    setNewCategory({ name: '', details: '' });
  };

  const handleEdit = (category) => {
    setNewCategory({ name: category.name, details: category.details });
    setEditMode(true);
    setEditId(category.id);
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="admin-section">
      <h2>Gestionar Categorías</h2>
      
      <div className="admin-form">
        <div className="form-group">
          <label>Nombre de la Categoría</label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Ej: Zapatos, Accesorios, etc."
          />
        </div>
        <div className="form-group">
          <label>Detalles</label>
          <textarea
            value={newCategory.details}
            onChange={(e) => setNewCategory({ ...newCategory, details: e.target.value })}
            placeholder="Descripción de la categoría"
            rows="3"
          />
        </div>
        <button 
          className="save-button"
          onClick={handleAddCategory}
        >
          {editMode ? 'Actualizar Categoría' : 'Agregar Categoría'}
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Detalles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.details}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(category)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(category.id)}
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