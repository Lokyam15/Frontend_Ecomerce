import React, { useState } from 'react';
import './AdminStyles.css';

export default function RoleManager() {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Vendedor',
      description: 'Personal de ventas y atención al cliente',
      permissions: [
        'Realizar ventas',
        'Ver inventario',
        'Aplicar descuentos básicos',
        'Gestionar devoluciones'
      ]
    },
    {
      id: 2,
      name: 'Cliente',
      description: 'Usuario registrado para compras',
      permissions: [
        'Ver productos',
        'Realizar compras',
        'Gestionar perfil',
        'Ver historial de compras'
      ]
    }
  ]);

  const [editingRole, setEditingRole] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });
  const [newPermission, setNewPermission] = useState('');

  const handleAddRole = () => {
    if (!newRole.name.trim()) return;
    
    setRoles([
      ...roles,
      {
        id: Date.now(),
        ...newRole,
        permissions: newRole.permissions.filter(p => p.trim())
      }
    ]);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setNewRole({ ...role });
  };

  const handleUpdate = () => {
    setRoles(roles.map(role => 
      role.id === editingRole.id ? { ...newRole, id: role.id } : role
    ));
    setEditingRole(null);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const addPermission = () => {
    if (newPermission.trim()) {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, newPermission.trim()]
      });
      setNewPermission('');
    }
  };

  const removePermission = (index) => {
    setNewRole({
      ...newRole,
      permissions: newRole.permissions.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="admin-section">
      <h2>Gestión de Roles</h2>

      <div className="roles-container">
        <div className="roles-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>{role.description}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => setShowDetail(role)}>👁️</button>
                      <button onClick={() => handleEdit(role)}>✏️</button>
                      <button onClick={() => handleDelete(role.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="role-form">
          <h3>{editingRole ? 'Editar Rol' : 'Crear Nuevo Rol'}</h3>
          <div className="form-group">
            <label>Nombre del Rol</label>
            <input
              type="text"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="Nombre del rol"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              placeholder="Descripción del rol"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Permisos</label>
            <div className="permission-input">
              <input
                type="text"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
                placeholder="Agregar permiso"
              />
              <button onClick={addPermission}>+</button>
            </div>
            <ul className="permissions-list">
              {newRole.permissions.map((permission, index) => (
                <li key={index}>
                  {permission}
                  <button onClick={() => removePermission(index)}>×</button>
                </li>
              ))}
            </ul>
          </div>

          <button 
            className="save-button"
            onClick={editingRole ? handleUpdate : handleAddRole}
          >
            {editingRole ? 'Actualizar Rol' : 'Crear Rol'}
          </button>
          
          {editingRole && (
            <button 
              className="cancel-button"
              onClick={() => {
                setEditingRole(null);
                setNewRole({ name: '', description: '', permissions: [] });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {showDetail && (
        <div className="role-detail-modal">
          <div className="modal-content">
            <h3>{showDetail.name}</h3>
            <p>{showDetail.description}</p>
            <div className="permissions-section">
              <h4>Permisos:</h4>
              <ul>
                {showDetail.permissions.map((permission, index) => (
                  <li key={index}>{permission}</li>
                ))}
              </ul>
            </div>
            <button onClick={() => setShowDetail(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}