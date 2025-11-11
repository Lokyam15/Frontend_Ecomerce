import React, { useState } from 'react';
import './LoginPanel.css';
import authService from '../../services/authService';

export default function LoginPanel({ onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Estados para registro
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });

  const handleLogin = async () => {
    // Validación básica
    if (!username || !password) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Intentando login con email:', username); // Debug
      
      // Llamar al servicio de autenticación (ahora con email)
      const userData = await authService.login(username, password);
      
      console.log('Login exitoso:', userData); // Debug
      
      // Llamar al callback con los datos del usuario
      onLogin({
        ...userData,
        name: userData.first_name || userData.username,
      });
      
      onClose();
    } catch (err) {
      console.error('Error completo de login:', err);
      console.error('Error response:', err.response);
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        if (err.response.status === 401) {
          setError('Usuario o contraseña incorrectos');
        } else if (err.response.status === 500) {
          setError('Error del servidor. Intente más tarde');
        } else {
          setError('Error al iniciar sesión. Intente nuevamente');
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose');
      } else {
        setError('Error inesperado. Intente nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  const handleRegister = async () => {
    // Validaciones
    if (!registerData.username || !registerData.email || !registerData.password) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (registerData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Creando usuario:', registerData.username);
      
      // Llamar al servicio para crear usuario
      const userData = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        is_active: true,
        is_staff: false,
        is_superuser: false
      };

      const created = await authService.register(userData);
      console.log('Usuario creado exitosamente:', created);
      
      // Automáticamente intentar login
      const loginData = await authService.login(registerData.email, registerData.password);
      onLogin({
        ...loginData,
        name: loginData.first_name || loginData.username,
      });
      
      onClose();
    } catch (err) {
      console.error('Error al crear usuario:', err);
      
      let errorMsg = 'Error al crear la cuenta';
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
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="login-panel">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{showRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {!showRegister ? (
          // Formulario de Login
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ingrese su usuario"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ingrese su contraseña"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          
            <div className="button-group">
              <button 
                type="button" 
                className="login-button" 
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
              <button 
                type="button" 
                className="create-account-button"
                onClick={() => setShowRegister(true)}
                disabled={loading}
              >
                Crear Usuario
              </button>
            </div>
          </form>
        ) : (
          // Formulario de Registro
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label htmlFor="reg-username">Usuario *</label>
              <input
                type="text"
                id="reg-username"
                value={registerData.username}
                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                placeholder="Nombre de usuario"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email *</label>
              <input
                type="email"
                id="reg-email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                placeholder="correo@ejemplo.com"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-first-name">Nombre</label>
              <input
                type="text"
                id="reg-first-name"
                value={registerData.first_name}
                onChange={(e) => setRegisterData({...registerData, first_name: e.target.value})}
                placeholder="Nombre"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-last-name">Apellido</label>
              <input
                type="text"
                id="reg-last-name"
                value={registerData.last_name}
                onChange={(e) => setRegisterData({...registerData, last_name: e.target.value})}
                placeholder="Apellido"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Contraseña *</label>
              <input
                type="password"
                id="reg-password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-confirm-password">Confirmar Contraseña *</label>
              <input
                type="password"
                id="reg-confirm-password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                placeholder="Repita su contraseña"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          
            <div className="button-group">
              <button 
                type="button" 
                className="login-button" 
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Cuenta'}
              </button>
              <button 
                type="button" 
                className="create-account-button"
                onClick={() => {
                  setShowRegister(false);
                  setError('');
                  setRegisterData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    first_name: '',
                    last_name: ''
                  });
                }}
                disabled={loading}
              >
                Volver al Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}