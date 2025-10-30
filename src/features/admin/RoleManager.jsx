import React, { useState } from 'react';
import './AdminStyles.css';

export default function RoleManager() {
  const [selectedUser, setSelectedUser] = useState('');
  const [roles, setRoles] = useState({
    canSell: false,
    canDiscount: false,
    canRequestLeave: false
  });

  const handleSaveRoles = () => {
    // Aquí iría la lógica para guardar los roles
    console.log('Roles guardados para:', selectedUser, roles);
  };

  return (
    <div className="admin-section">
      <h2>Asignar Roles</h2>
      <div className="admin-form">
        <div className="form-group">
          <label>Seleccionar Vendedor</label>
          <select 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Seleccione un vendedor</option>
            <option value="vendedor1">Juan Pérez</option>
            <option value="vendedor2">María García</option>
          </select>
        </div>

        {selectedUser && (
          <>
            <div className="roles-grid">
              <div className="role-item">
                <input
                  type="checkbox"
                  id="canSell"
                  checked={roles.canSell}
                  onChange={(e) => setRoles({...roles, canSell: e.target.checked})}
                />
                <label htmlFor="canSell">Puede Vender</label>
              </div>
              <div className="role-item">
                <input
                  type="checkbox"
                  id="canDiscount"
                  checked={roles.canDiscount}
                  onChange={(e) => setRoles({...roles, canDiscount: e.target.checked})}
                />
                <label htmlFor="canDiscount">Puede hacer rebajas</label>
              </div>
              <div className="role-item">
                <input
                  type="checkbox"
                  id="canRequestLeave"
                  checked={roles.canRequestLeave}
                  onChange={(e) => setRoles({...roles, canRequestLeave: e.target.checked})}
                />
                <label htmlFor="canRequestLeave">Puede solicitar licencia</label>
              </div>
            </div>
            <button className="save-button" onClick={handleSaveRoles}>
              Guardar Cambios
            </button>
          </>
        )}
      </div>
    </div>
  );
}