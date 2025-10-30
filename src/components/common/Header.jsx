import React from 'react';
import './Header.css';

export default function Header({ user, onLoginClick }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon menu" aria-label="menu">☰</button>
        <div className="logo">Shopping</div>
      </div>
      <div className="topbar-center">
        <input className="search" placeholder="Buscar productos..." aria-label="buscar" />
        <button className="filter-btn">Buscar</button>
      </div>
      <div className="topbar-right">
        <button 
          className="icon" 
          aria-label="iniciar sesión"
          onClick={onLoginClick}
        >
          {user ? '👤' : '👤'}
        </button>
        <button className="icon" aria-label="carrito">🛒</button>
      </div>
    </header>
  );
}