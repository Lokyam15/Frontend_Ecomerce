import React, { useState, useEffect } from 'react';
import groupService from '../../services/groupService';
import './RoleManager.css';

export default function RoleManager() {
  console.log('🔵 RoleManager component mounted');
  
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    permission_ids: []
  });

  useEffect(() => {
    console.log('🔵 RoleManager useEffect - loading data');
    loadGroups();
    loadPermissions();
  }, []);

  const loadGroups = async () => {
    console.log('🔵 loadGroups called');
    setLoading(true);
    try {
      const data = await groupService.getAllGroups();
      console.log('🟢 Groups loaded:', data);
      // Si viene paginado o envuelto en un objeto, extraer el array
      const groupsArray = Array.isArray(data) ? data : (data.results || data.groups || []);
      console.log('🟢 Groups array:', groupsArray);
      setGroups(groupsArray);
    } catch (err) {
      setError('Error al cargar grupos');
      console.error('🔴 Error loading groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    console.log('🔵 loadPermissions called');
    try {
      const data = await groupService.getAllPermissions();
      console.log('🟢 Permissions loaded:', data);
      setPermissions(data.permissions || []);
    } catch (err) {
      console.error('🔴 Error loading permissions:', err);
    }
  };

  const handleOpenModal = (group = null) => {
    if (group) {
      setIsEditMode(true);
      setCurrentGroup(group);
      setFormData({
        name: group.name,
        permission_ids: group.permissions.map(p => p.id)
      });
    } else {
      setIsEditMode(false);
      setCurrentGroup(null);
      setFormData({
        name: '',
        permission_ids: []
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setCurrentGroup(null);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => {
      const isSelected = prev.permission_ids.includes(permissionId);
      return {
        ...prev,
        permission_ids: isSelected
          ? prev.permission_ids.filter(id => id !== permissionId)
          : [...prev.permission_ids, permissionId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode && currentGroup) {
        await groupService.updateGroup(currentGroup.id, formData);
      } else {
        await groupService.createGroup(formData);
      }
      
      await loadGroups();
      handleCloseModal();
    } catch (err) {
      let errorMsg = 'Error al guardar el grupo';
      if (err.response?.data) {
        if (err.response.data.name) {
          errorMsg = `Nombre: ${err.response.data.name[0]}`;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (group) => {
    if (!window.confirm(`¿Está seguro de eliminar el grupo "${group.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await groupService.deleteGroup(group.id);
      await loadGroups();
    } catch (err) {
      setError('Error al eliminar el grupo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Asegurarse de que groups sea un array antes de filtrar
  const filteredGroups = Array.isArray(groups) 
    ? groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Agrupar permisos por app
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const app = perm.app_label;
    if (!acc[app]) acc[app] = [];
    acc[app].push(perm);
    return acc;
  }, {});

  console.log('🔵 RoleManager rendering - groups:', groups.length, 'permissions:', permissions.length, 'loading:', loading);

  return (
    <div className="role-manager">
      <div className="role-manager-header">
        <div>
          <h2>Gestión de Roles</h2>
          <p className="subtitle">Administra los grupos y sus permisos del sistema</p>
        </div>
        <button className="btn-create" onClick={() => handleOpenModal()}>
          <span className="icon">+</span>
          Crear Rol
        </button>
      </div>

      {error && !showModal && <div className="alert alert-error">{error}</div>}

      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && !showModal ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando roles...</p>
        </div>
      ) : (
        <div className="roles-grid">
          {filteredGroups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No hay roles creados</h3>
              <p>Comienza creando tu primer rol</p>
              <button className="btn-primary" onClick={() => handleOpenModal()}>
                Crear Primer Rol
              </button>
            </div>
          ) : (
            filteredGroups.map(group => (
              <div key={group.id} className="role-card">
                <div className="role-card-header">
                  <h3>{group.name}</h3>
                  <div className="role-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleOpenModal(group)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-danger" 
                      onClick={() => handleDelete(group)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="role-card-body">
                  <div className="role-stat">
                    <span className="stat-label">Permisos</span>
                    <span className="stat-value">{group.permissions?.length || 0}</span>
                  </div>
                  <div className="role-stat">
                    <span className="stat-label">Usuarios</span>
                    <span className="stat-value">{group.users_count || 0}</span>
                  </div>
                </div>

                {group.permissions && group.permissions.length > 0 && (
                  <div className="role-card-footer">
                    <div className="permissions-preview">
                      {group.permissions.slice(0, 3).map(perm => (
                        <span key={perm.id} className="permission-tag">
                          {perm.name}
                        </span>
                      ))}
                      {group.permissions.length > 3 && (
                        <span className="permission-tag more">
                          +{group.permissions.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseModal();
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditMode ? 'Editar Rol' : 'Crear Nuevo Rol'}</h3>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <label htmlFor="name" className="form-label">
                  Nombre del Rol *
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Vendedor, Gerente, Administrador"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h4>Permisos del Sistema</h4>
                  <span className="selected-count">
                    {formData.permission_ids.length} seleccionados
                  </span>
                </div>
                <p className="help-text">
                  Seleccione los permisos que tendrá este rol
                </p>
                
                <div className="permissions-container">
                  {Object.keys(groupedPermissions).length === 0 ? (
                    <p className="text-muted">Cargando permisos...</p>
                  ) : (
                    Object.entries(groupedPermissions).map(([app, perms]) => (
                      <div key={app} className="permission-group">
                        <h5 className="permission-group-title">
                          {app.toUpperCase()}
                        </h5>
                        <div className="permission-list">
                          {perms.map(perm => (
                            <label key={perm.id} className="permission-checkbox">
                              <input
                                type="checkbox"
                                checked={formData.permission_ids.includes(perm.id)}
                                onChange={() => handlePermissionToggle(perm.id)}
                                disabled={loading}
                              />
                              <span className="checkbox-label">
                                <strong>{perm.name}</strong>
                                <span className="permission-codename">
                                  {perm.codename}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear Rol')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
