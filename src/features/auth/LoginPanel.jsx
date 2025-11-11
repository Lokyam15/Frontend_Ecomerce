import React, { useState } from 'react';
import './LoginPanel.css';
import authService from '../../services/authService';

export default function LoginPanel({ onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="login-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="login-panel">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}
        
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
              disabled={loading}
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}