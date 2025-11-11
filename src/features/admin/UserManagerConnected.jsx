import React, { useState, useEffect } from 'react';
import './AdminStyles.css';
import userService from '../../services/userService';

export default function UserManagerConnected() {
  console.log('🟦 UserManagerConnected: Componente renderizándose...');
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_staff: false,
    is_superuser: false,
    is_active: true,
    // Datos de persona asociada
    persona: {
      nombres: '',
      apellidos: '',
      telefono: '',
      genero: 'PREFIERE_NO_DECIR',
      tipo: 'CLIENTE'
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar usuarios al montar el componente
  useEffect(() => {
    console.log('UserManagerConnected montado - cargando datos...');
    loadUsers();
  }, []);

  const loadUsers = async (filters = {}) => {
    try {
      console.log('Llamando a userService.getAllUsers()...');
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filterRole && filterRole !== 'all') {
        params.role = filterRole;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const data = await userService.getAllUsers({ ...params, ...filters });
      console.log('Usuarios recibidos:', data);
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
        setUsers(data.results);
      } else {
        console.warn('Formato de datos inesperado:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('No se pudieron cargar los usuarios. Verifica que tengas permisos de administrador.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones
      if (!newUser.username.trim()) {
        setError('El nombre de usuario es requerido');
        setLoading(false);
        return;
      }
      if (!newUser.email.trim()) {
        setError('El email es requerido');
        setLoading(false);
        return;
      }
      if (!editMode && !newUser.password.trim()) {
        setError('La contraseña es requerida para nuevos usuarios');
        setLoading(false);
        return;
      }

      // Preparar datos del usuario
      const userData = {
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        is_staff: newUser.is_staff,
        is_superuser: newUser.is_superuser,
        is_active: newUser.is_active,
      };

      // Solo incluir password si se proporcionó
      if (newUser.password.trim()) {
        userData.password = newUser.password;
      }

      // Incluir datos de persona si se completaron
      if (newUser.persona.nombres.trim() || newUser.persona.apellidos.trim()) {
        userData.persona = {
          nombres: newUser.persona.nombres,
          apellidos: newUser.persona.apellidos,
          email: newUser.email, // Usar el mismo email
          telefono: newUser.persona.telefono,
          genero: newUser.persona.genero,
          tipo: newUser.persona.tipo,
          estado: 'ACTIVO'
        };
      }

      if (editMode && editId) {
        // Actualizar usuario existente
        console.log('Actualizando usuario...', userData);
        const updated = await userService.updateUser(editId, userData);
        console.log('Usuario actualizado:', updated);
        
        setUsers(users.map(user => user.id === editId ? updated : user));
        setEditMode(false);
        setEditId(null);
        setSuccess('✅ Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        console.log('Creando nuevo usuario...', userData);
        const created = await userService.createUser(userData);
        console.log('Usuario creado:', created);
        
        setUsers([created, ...users]);
        setSuccess('✅ Usuario creado exitosamente');
      }

      // Limpiar formulario
      setNewUser({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        is_staff: false,
        is_superuser: false,
        is_active: true,
        persona: {
          nombres: '',
          apellidos: '',
          telefono: '',
          genero: 'PREFIERE_NO_DECIR',
          tipo: 'CLIENTE'
        }
      });
      setShowModal(false);
      
      setTimeout(() => {
        setSuccess(null);
        loadUsers();
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error al guardar usuario:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      
      let errorMsg = 'Error al guardar el usuario';
      if (err.response?.data) {
        if (err.response.data.username) {
          errorMsg = `Username: ${err.response.data.username[0]}`;
        } else if (err.response.data.email) {
          errorMsg = `Email: ${err.response.data.email[0]}`;
        } else if (err.response.data.password) {
          errorMsg = `Contraseña: ${err.response.data.password[0]}`;
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

  const handleEdit = (user) => {
    setNewUser({
      username: user.username,
      email: user.email,
      password: '', // No mostrar contraseña actual
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
      is_active: user.is_active,
      persona: {
        nombres: user.persona?.nombres || '',
        apellidos: user.persona?.apellidos || '',
        telefono: user.persona?.telefono || '',
        genero: user.persona?.genero || 'PREFIERE_NO_DECIR',
        tipo: user.persona?.tipo || 'CLIENTE'
      }
    });
    setEditMode(true);
    setEditId(user.id);
    setError(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setSuccess('✅ Usuario eliminado exitosamente');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError(err.response?.data?.detail || 'Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setNewUser({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      is_staff: false,
      is_superuser: false,
      is_active: true,
      persona: {
        nombres: '',
        apellidos: '',
        telefono: '',
        genero: 'PREFIERE_NO_DECIR',
        tipo: 'CLIENTE'
      }
    });
    setShowModal(false);
    setError(null);
  };

  const toggleUserStatus = async (user) => {
    try {
      setLoading(true);
      await userService.patchUser(user.id, { is_active: !user.is_active });
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
      setSuccess(`✅ Usuario ${!user.is_active ? 'activado' : 'desactivado'} exitosamente`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar el estado del usuario');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (user) => {
    if (user.is_superuser) {
      return <span style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>👑 Admin</span>;
    } else if (user.is_staff) {
      return <span style={{ padding: '4px 8px', backgroundColor: '#17a2b8', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>👤 Vendedor</span>;
    } else {
      return <span style={{ padding: '4px 8px', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>🛍️ Cliente</span>;
    }
  };

  return (
    <div className="admin-section">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        👥 Gestión de Usuarios
      </h2>

      {error && (
        <div className="error-message" style={{ animation: 'shake 0.5s' }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>✕</button>
        </div>
      )}

      {success && (
        <div className="success-message" style={{ animation: 'slideIn 0.3s' }}>
          {success}
        </div>
      )}

      {/* Barra de herramientas */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Botón Crear Usuario */}
        <button 
          className="save-button"
          onClick={() => {
            handleCancelEdit();
            setShowModal(true);
          }}
          disabled={loading}
          style={{ 
            padding: '12px 24px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }}>➕</span>
          Crear Usuario
        </button>

        {/* Filtro por Rol */}
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            loadUsers({ role: e.target.value !== 'all' ? e.target.value : undefined });
          }}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #1565c0',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">🔍 Todos los roles</option>
          <option value="admin">👑 Administradores</option>
          <option value="seller">👤 Vendedores</option>
          <option value="customer">🛍️ Clientes</option>
        </select>

        {/* Buscador */}
        <div style={{ flex: 1, minWidth: '250px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="🔎 Buscar por nombre, email o username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadUsers()}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid #ccc',
              fontSize: '14px'
            }}
          />
          <button
            onClick={() => loadUsers()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1565c0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s'
        }}>
          <div className="admin-form" style={{
            maxWidth: '700px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'slideIn 0.3s',
            position: 'relative'
          }}>
            <button
              onClick={handleCancelEdit}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>

            <h3 style={{ marginBottom: '20px' }}>
              {editMode ? '✏️ Editar Usuario' : '➕ Crear Nuevo Usuario'}
            </h3>

            {/* Sección 1: Credenciales de Acceso */}
            <div style={{ 
              padding: '20px',
              backgroundColor: '#f0f8ff',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '2px solid #1565c0'
            }}>
              <h4 style={{ marginTop: 0, color: '#1565c0' }}>🔐 Credenciales de Acceso</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div className="form-group">
                  <label>Username (usuario) *</label>
                  <input
                    type="text"
                    placeholder="Ej: jperez"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    style={{ borderColor: newUser.username.trim() === '' ? '#f44336' : '#ccc' }}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    style={{ borderColor: newUser.email.trim() === '' ? '#f44336' : '#ccc' }}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Contraseña {editMode ? '(dejar vacío para no cambiar)' : '*'}</label>
                  <input
                    type="password"
                    placeholder={editMode ? "Nueva contraseña (opcional)" : "Contraseña segura"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    style={{ borderColor: !editMode && newUser.password.trim() === '' ? '#f44336' : '#ccc' }}
                  />
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    Mínimo 8 caracteres. Se recomienda usar letras, números y símbolos.
                  </small>
                </div>
              </div>
            </div>

            {/* Sección 2: Información Personal */}
            <div style={{ 
              padding: '20px',
              backgroundColor: '#fff8e1',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '2px solid #ffc107'
            }}>
              <h4 style={{ marginTop: 0, color: '#f57c00' }}>👤 Información Personal</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div className="form-group">
                  <label>Nombre(s)</label>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value, persona: { ...newUser.persona, nombres: e.target.value } })}
                  />
                </div>

                <div className="form-group">
                  <label>Apellido(s)</label>
                  <input
                    type="text"
                    placeholder="Pérez García"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value, persona: { ...newUser.persona, apellidos: e.target.value } })}
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    placeholder="70123456"
                    value={newUser.persona.telefono}
                    onChange={(e) => setNewUser({ ...newUser, persona: { ...newUser.persona, telefono: e.target.value } })}
                  />
                </div>

                <div className="form-group">
                  <label>Género</label>
                  <select
                    value={newUser.persona.genero}
                    onChange={(e) => setNewUser({ ...newUser, persona: { ...newUser.persona, genero: e.target.value } })}
                  >
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="NB">No Binario</option>
                    <option value="PREFIERE_NO_DECIR">Prefiere no decir</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección 3: Permisos y Roles */}
            <div style={{ 
              padding: '20px',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '2px solid #4caf50'
            }}>
              <h4 style={{ marginTop: 0, color: '#2e7d32' }}>🔑 Permisos y Roles</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: newUser.is_superuser ? '3px solid #dc3545' : '2px solid #e0e0e0'
                }}>
                  <input
                    type="checkbox"
                    checked={newUser.is_superuser}
                    onChange={(e) => setNewUser({ 
                      ...newUser, 
                      is_superuser: e.target.checked,
                      is_staff: e.target.checked ? true : newUser.is_staff // Admin siempre es staff
                    })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>👑 Administrador</div>
                    <small style={{ color: '#666' }}>Acceso total al sistema, puede gestionar usuarios, productos, ventas y configuración</small>
                  </div>
                </label>

                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: newUser.is_staff && !newUser.is_superuser ? '3px solid #17a2b8' : '2px solid #e0e0e0',
                  opacity: newUser.is_superuser ? 0.6 : 1
                }}>
                  <input
                    type="checkbox"
                    checked={newUser.is_staff}
                    onChange={(e) => setNewUser({ ...newUser, is_staff: e.target.checked })}
                    disabled={newUser.is_superuser}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>👤 Vendedor</div>
                    <small style={{ color: '#666' }}>Puede gestionar ventas y consultar inventario</small>
                  </div>
                </label>

                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: newUser.is_active ? '3px solid #4caf50' : '2px solid #f44336'
                }}>
                  <input
                    type="checkbox"
                    checked={newUser.is_active}
                    onChange={(e) => setNewUser({ ...newUser, is_active: e.target.checked })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {newUser.is_active ? '✅ Usuario Activo' : '❌ Usuario Inactivo'}
                    </div>
                    <small style={{ color: '#666' }}>Los usuarios inactivos no pueden iniciar sesión</small>
                  </div>
                </label>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                className="save-button"
                onClick={handleAddUser}
                disabled={loading}
                style={{ flex: 1, padding: '15px', fontSize: '16px' }}
              >
                {loading ? '⏳ Guardando...' : (editMode ? '💾 Actualizar Usuario' : '➕ Crear Usuario')}
              </button>
              
              <button 
                className="delete-button"
                onClick={handleCancelEdit}
                disabled={loading}
                style={{ padding: '15px 30px', fontSize: '16px' }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombre Completo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registrado</th>
              <th>Último Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <strong style={{ color: '#1565c0' }}>{user.username}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.first_name || user.last_name 
                      ? `${user.first_name} ${user.last_name}`.trim()
                      : <span style={{ color: '#999', fontSize: '12px' }}>Sin nombre</span>
                    }
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getRoleBadge(user)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => toggleUserStatus(user)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: user.is_active ? '#4caf50' : '#f44336',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {user.is_active ? '✅ Activo' : '❌ Inactivo'}
                    </button>
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleDateString()
                      : <span style={{ color: '#999' }}>Nunca</span>
                    }
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                        title="Editar usuario"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(user.id)}
                        disabled={loading}
                        title="Eliminar usuario"
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

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        )}
      </div>
    </div>
  );
}
