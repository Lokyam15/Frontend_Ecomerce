import React from 'react';
import './MainLayout.css';

export default function MainLayout({ children }) {
  return (
    <div className="app-root">
      {children}
    </div>
  );
}