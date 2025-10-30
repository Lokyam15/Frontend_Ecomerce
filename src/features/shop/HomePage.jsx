import { useState } from 'react'
import './HomePage.css'
import LoginPanel from '../../features/auth/LoginPanel'
import RoleManager from '../../features/admin/RoleManager'
import UserManager from '../../features/admin/UserManager'
import Inventory from '../../features/admin/Inventory'
import Sales from '../../features/admin/Sales'
import CategoryManager from '../../features/admin/CategoryManager'
import StockManager from '../../features/admin/StockManager'

import Header from '../../components/common/Header';
import SalesManager from '../seller/SalesManager';

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('');

  const handleLogout = () => {
    setUser(null);
    setActiveSection('');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveSection('sales'); // Sección por defecto al iniciar sesión
  };

  return (
    <div className="app-root">
      <Header 
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      <LoginPanel 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      <main className="main-content">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <aside className="sidebar admin-sidebar">
                <h3>Menú Administrativo</h3>
                <nav className="admin-menu">
                  <button 
                    className={`admin-menu-item ${activeSection === 'sales' ? 'active' : ''}`}
                    onClick={() => setActiveSection('sales')}
                  >📊 Ventas</button>
                  <button 
                    className={`admin-menu-item ${activeSection === 'inventory' ? 'active' : ''}`}
                    onClick={() => setActiveSection('inventory')}
                  >📦 Inventario</button>
                  <button 
                    className={`admin-menu-item ${activeSection === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveSection('users')}
                  >👥 Gestionar Usuarios</button>
                  <button 
                    className={`admin-menu-item ${activeSection === 'roles' ? 'active' : ''}`}
                    onClick={() => setActiveSection('roles')}
                  >🔑 Asignar Roles</button>
                  <button 
                    className={`admin-menu-item ${activeSection === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveSection('categories')}
                  >📑 Gestionar Categorías</button>
                  <button 
                    className={`admin-menu-item ${activeSection === 'stock' ? 'active' : ''}`}
                    onClick={() => setActiveSection('stock')}
                  >📦 Gestionar Stock</button>
                </nav>
              </aside>
            ) : (
              <aside className="sidebar seller-sidebar">
                <h3>Menú Vendedor</h3>
                <nav className="admin-menu">
                  <button 
                    className={`admin-menu-item ${activeSection === 'newsale' ? 'active' : ''}`}
                    onClick={() => setActiveSection('newsale')}
                  >💰 Nueva Venta</button>
                  <button 
                    className={`admin-menu-item ${activeSection === 'inventory' ? 'active' : ''}`}
                    onClick={() => setActiveSection('inventory')}
                  >📦 Ver Stock</button>
                </nav>
              </aside>
            )}
            <div className="admin-content">
              {/* Admin components */}
              {user.role === 'admin' && (
                <>
                  {activeSection === 'sales' && <Sales />}
                  {activeSection === 'inventory' && <Inventory />}
                  {activeSection === 'users' && <UserManager />}
                  {activeSection === 'roles' && <RoleManager />}
                  {activeSection === 'categories' && <CategoryManager />}
                  {activeSection === 'stock' && <StockManager />}
                </>
              )}
              {/* Seller components */}
              {user.role === 'seller' && (
                <>
                  {activeSection === 'newsale' && <SalesManager />}
                  {activeSection === 'inventory' && <Inventory />}
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <aside className="sidebar">
              <h3>Filtros</h3>
              <div className="filter-group">
                <label>Talla</label>
                <select>
                  <option>Todas</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Color</label>
                <div className="color-list">
                  <button className="color-swatch" style={{background:'#000'}} aria-label="negro"></button>
                  <button className="color-swatch" style={{background:'#fff'}} aria-label="blanco"></button>
                  <button className="color-swatch" style={{background:'#f00'}} aria-label="rojo"></button>
                  <button className="color-swatch" style={{background:'#00f'}} aria-label="azul"></button>
                </div>
              </div>
              <div className="filter-group">
                <label>Tipo</label>
                <ul>
                  <li><input type="checkbox" /> Camisetas</li>
                  <li><input type="checkbox" /> Pantalones</li>
                  <li><input type="checkbox" /> Chaquetas</li>
                </ul>
              </div>
            </aside>
            <div className="product-area">
              <div className="product-grid">
                {Array.from({ length: 30 }).map((_, i) => (
                  <article className="product-card" key={i}>
                    <div className="thumb" />
                    <h4>Modelo {i + 1}</h4>
                    <p className="price">$ {Math.floor(20 + Math.random() * 80)}</p>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
