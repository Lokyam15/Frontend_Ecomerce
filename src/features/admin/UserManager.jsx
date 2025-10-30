import React, { useState } from 'react';
import './AdminStyles.css';

export default function UserManager() {
  const [userData, setUserData] = useState({
    fullName: '',
    ci: '',
    phone: '',
    address: '',
    birthDate: ''
  });

  const handleSave = () => {
    console.log('Datos del vendedor guardados:', userData);
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-section">
      <h2>Gestionar Usuarios</h2>
      <div className="admin-form">
        <div className="form-group">
          <label>Nombre Completo</label>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>CI</label>
          <input
            type="text"
            name="ci"
            value={userData.ci}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Celular</label>
          <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="birthDate"
            value={userData.birthDate}
            onChange={handleChange}
          />
        </div>
        <button className="save-button" onClick={handleSave}>
          Guardar Usuario
        </button>
      </div>
    </div>
  );
}