import React, { useState } from 'react';
import './LoginPanel.css';
import { USERS } from '../../config/constants';

export default function LoginPanel({ onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const admin = USERS.ADMIN;
    const seller = USERS.SELLER;

    if (username === admin.username && password === admin.password) {
      onLogin({ 
        username, 
        name: admin.username,
        role: 'admin',
        permissions: ['manage_sales', 'manage_stock', 'manage_users', 'assign_roles']
      });
      onClose();
    } else if (username === seller.username && password === seller.password) {
      onLogin({
        username,
        name: seller.username,
        role: 'seller',
        permissions: seller.permissions
      });
      onClose();
    } else {
      setError('Credenciales inválidas');
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
              placeholder="Ingrese su usuario"
              autoComplete="new-password"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              autoComplete="new-password"
            />
          </div>
        
          <div className="button-group">
            <button type="button" className="login-button" onClick={handleLogin}>
              Ingresar
            </button>
            <button type="button" className="create-account-button">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}