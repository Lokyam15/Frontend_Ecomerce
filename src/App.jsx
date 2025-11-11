import React, { useState, useEffect } from 'react';
import { FiMenu, FiShoppingBag, FiUser, FiSearch, FiX } from 'react-icons/fi';
import LoginPanel from './features/auth/LoginPanel';
import ProductDetail from './components/product/ProductDetail';
import Checkout from './components/checkout/Checkout';
import OrderTracking from './components/orders/OrderTracking';
import ProductManager from './features/admin/ProductManager';
import ProductManagerConnected from './features/admin/ProductManagerConnected';
import SalesManager from './features/seller/SalesManager';
import UserManager from './features/admin/UserManager';
import UserManagerConnected from './features/admin/UserManagerConnected';
import Inventory from './features/admin/Inventory';
import Sales from './features/admin/Sales';
import CategoryManager from './features/admin/CategoryManager';
import StockManager from './features/admin/StockManager';
import RoleManager from './features/admin/RoleManager';
import AIReports from './features/admin/AIReports';
import SalesForecast from './features/admin/SalesForecast';
import { sampleProducts } from './data/sampleProducts';
import authService from './services/authService';
import './App.css';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [activeModule, setActiveModule] = useState(null);

  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
    // Mantener al usuario en la página actual (productos) sin cambiar de vista
    // No establecer activeModule para que siga viendo los productos
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setActiveModule(null);
    setIsSideMenuOpen(false);
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => [...prevCart, { ...product, cartId: Date.now() }]);
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const handleGoToCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
    } else {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }
  };

  const handleConfirmOrder = async (orderData) => {
    try {
      console.log('Enviando pedido al backend:', orderData);
      // Importar el servicio si no está ya importado
      const orderService = (await import('./services/orderService')).default;
      const result = await orderService.createOrder(orderData);
      console.log('Pedido creado exitosamente:', result);
      // Limpiar el carrito
      setCart([]);
      setIsCheckoutOpen(false);
      return result;
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      throw error;
    }
  };

  const handleSearch = () => {
    console.log('Buscando:', searchTerm);
  };

  // Filtrar productos por búsqueda, categoría y género
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesGender = selectedGender === 'all' || product.gender === selectedGender;
    return matchesSearch && matchesCategory && matchesGender;
  });

  // Agrupar productos por categoría
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const categories = ['Poleras', 'Blusas', 'Faldas', 'Pantalones'];

  // Módulos disponibles según el rol
  const adminModules = [
    { id: 'products', name: 'Gestión de Productos', icon: '📦' },
    { id: 'categories', name: 'Gestión de Categorías', icon: '📂' },
    { id: 'inventory', name: 'Inventario', icon: '📊' },
    { id: 'stock', name: 'Gestión de Stock', icon: '📦' },
    { id: 'sales', name: 'Ventas', icon: '💰' },
    { id: 'forecast', name: 'Pronóstico de Ventas', icon: '📈' },
    { id: 'users', name: 'Usuarios', icon: '👥' },
    { id: 'roles', name: 'Gestión de Roles', icon: '🔐' },
    { id: 'ai-reports', name: 'Reportes con IA', icon: '🤖' },
  ];

  const sellerModules = [
    { id: 'sales', name: 'Registro de Ventas', icon: '💰' },
  ];

  const renderModule = () => {
    console.log('🔴 renderModule llamado con activeModule:', activeModule);
    switch (activeModule) {
      case 'products':
        console.log('🟢 Renderizando ProductManagerConnected');
        return <ProductManagerConnected />;
      case 'categories':
        console.log('🟢 Renderizando CategoryManager');
        return <CategoryManager />;
      case 'inventory':
        return <Inventory />;
      case 'stock':
        return <StockManager />;
      case 'sales':
        return user.role === 'seller' ? <SalesManager /> : <Sales />;
      case 'forecast':
        return <SalesForecast />;
      case 'users':
        return <UserManagerConnected />;
      case 'roles':
        return <RoleManager />;
      case 'ai-reports':
        return <AIReports />;
      default:
        return (
          <div className="dashboard-welcome">
            <h2>Bienvenido, {user.name}</h2>
            <p>Selecciona un módulo del menú para comenzar</p>
          </div>
        );
    }
  };

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="topbar-left">
          {user && (
            <button 
              className="icon menu"
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            >
              <FiMenu />
            </button>
          )}
          <span className="logo">ShopSmart</span>
        </div>

        <div className="topbar-center">
          <input
            type="search"
            className="search"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="filter-btn" onClick={handleSearch}>
            <FiSearch />
            Buscar
          </button>
        </div>

        <div className="topbar-right">
          <button 
            className="icon"
            onClick={() => user ? handleLogout() : setIsLoginOpen(true)}
            title={user ? 'Cerrar Sesión' : 'Iniciar Sesión'}
          >
            <FiUser />
          </button>
          {/* Mostrar carrito solo para clientes (no admin/seller) */}
          {(!user || (user && user.role !== 'admin' && user.role !== 'seller')) && (
            <button 
              className="icon cart-button"
              onClick={() => setIsCartOpen(!isCartOpen)}
              title="Carrito de Compras"
            >
              <FiShoppingBag />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
          )}
        </div>
      </header>

      {isLoginOpen && (
        <LoginPanel 
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
            <div className="cart-header">
              <h2>Carrito de Compras</h2>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Tu carrito está vacío</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.cartId} className="cart-item">
                      <img src={item.images[0]} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p className="cart-item-price">${item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.cartId)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <div className="cart-total">
                    <strong>Total:</strong>
                    <strong>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</strong>
                  </div>
                  <div className="cart-actions">
                    <button 
                      className="checkout-button"
                      onClick={handleGoToCheckout}
                    >
                      {!user ? '🔒 Iniciar Sesión para Pagar' : '💳 Ir a Pagar'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú lateral para usuarios logueados */}
      {user && (
        <div className={`side-menu ${isSideMenuOpen ? 'open' : ''}`}>
          <div className="side-menu-header">
            <h3>{user.name}</h3>
            <span className="user-role">
              {user.role === 'admin' ? '👑 Administrador' : 
               user.role === 'seller' ? '👤 Vendedor' : 
               '🛍️ Cliente'}
            </span>
          </div>
          <div className="side-menu-items">
            {/* Menú para Admin y Vendedor */}
            {(user.role === 'admin' || user.role === 'seller') ? (
              <>
                {(user.role === 'admin' ? adminModules : sellerModules).map(module => (
                  <button
                    key={module.id}
                    className={`menu-item ${activeModule === module.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveModule(module.id);
                      setIsSideMenuOpen(false);
                    }}
                  >
                    <span className="menu-icon">{module.icon}</span>
                    <span>{module.name}</span>
                  </button>
                ))}
              </>
            ) : (
              /* Menú para Cliente */
              <>
                <button 
                  className="menu-item"
                  onClick={() => {
                    setActiveModule(null);
                    setIsSideMenuOpen(false);
                  }}
                >
                  <span className="menu-icon">🏠</span>
                  <span>Inicio / Productos</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsSideMenuOpen(false);
                  }}
                >
                  <span className="menu-icon">🛒</span>
                  <span>Mi Carrito {cart.length > 0 && `(${cart.length})`}</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    setIsOrderTrackingOpen(true);
                    setIsSideMenuOpen(false);
                  }}
                >
                  <span className="menu-icon">📦</span>
                  <span>Mis Pedidos</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    alert('Perfil de usuario próximamente');
                    setIsSideMenuOpen(false);
                  }}
                >
                  <span className="menu-icon">👤</span>
                  <span>Mi Perfil</span>
                </button>
              </>
            )}
            
            {/* Cerrar sesión para todos */}
            <button className="menu-item logout" onClick={handleLogout}>
              <span className="menu-icon">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      <main className="main-content">
        {user && (user.role === 'admin' || user.role === 'seller') ? (
          /* Dashboard para Admin y Vendedor */
          <div className="admin-dashboard">
            {renderModule()}
          </div>
        ) : (
          /* Página de productos para clientes no logueados o clientes logueados */
          <>
            <aside className="sidebar">
              <h3>Filtros</h3>
              
              <div className="filter-group">
                <label>Género</label>
                <select 
                  className="filter-select"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="hombre">Hombres</option>
                  <option value="mujer">Mujeres</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Categoría</label>
                <select 
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Talla</label>
                <select className="filter-select">
                  <option value="">Todas las tallas</option>
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Categoría</label>
                <div className="filter-checkboxes">
                  <label className="checkbox">
                    <input type="checkbox" /> Poleras
                  </label>
                  <label className="checkbox">
                    <input type="checkbox" /> Blusas
                  </label>
                  <label className="checkbox">
                    <input type="checkbox" /> Faldas
                  </label>
                  <label className="checkbox">
                    <input type="checkbox" /> Pantalones
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label>Rango de Precio</label>
                <div className="range-inputs">
                  <input type="number" placeholder="Min" className="price-input" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="price-input" />
                </div>
              </div>
            </aside>

            <div className="product-area">
              {/* Mensaje de bienvenida para clientes logueados */}
              {user && user.role !== 'admin' && user.role !== 'seller' && (
                <div className="client-welcome-banner">
                  <h2>¡Hola, {user.name}! 👋</h2>
                  <p>Explora nuestra colección y encuentra tu estilo perfecto</p>
                </div>
              )}

              {/* Pestañas de género */}
              <div className="gender-tabs">
                <button 
                  className={`gender-tab ${selectedGender === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedGender('all')}
                >
                  General
                </button>
                <button 
                  className={`gender-tab ${selectedGender === 'hombre' ? 'active' : ''}`}
                  onClick={() => setSelectedGender('hombre')}
                >
                  Hombres
                </button>
                <button 
                  className={`gender-tab ${selectedGender === 'mujer' ? 'active' : ''}`}
                  onClick={() => setSelectedGender('mujer')}
                >
                  Mujeres
                </button>
              </div>

              {/* Sección Hombres */}
              {(selectedGender === 'all' || selectedGender === 'hombre') && (
                <div className="gender-section">
                  <h1 className="gender-title">Hombres</h1>
                  {selectedCategory === 'all' ? (
                    categories.map(category => {
                      const categoryProducts = groupedProducts[category]?.filter(p => p.gender === 'hombre') || [];
                      if (categoryProducts.length === 0) return null;
                      
                      return (
                        <div key={`hombre-${category}`} className="category-section">
                          <h2 className="category-title">{category}</h2>
                          <div className="product-grid">
                            {categoryProducts.map((product) => (
                              <article 
                                className="product-card" 
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                              >
                                <div className="product-thumb">
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                  />
                                  <button className="quick-add btn-primary">Añadir Rápido</button>
                                </div>
                                <div className="product-info">
                                  <h3>{product.name}</h3>
                                  <p className="price">${product.price.toFixed(2)}</p>
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="category-section">
                      <h2 className="category-title">{selectedCategory}</h2>
                      <div className="product-grid">
                        {filteredProducts.filter(p => p.gender === 'hombre').map((product) => (
                          <article 
                            className="product-card" 
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <div className="product-thumb">
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                              />
                              <button className="quick-add btn-primary">Añadir Rápido</button>
                            </div>
                            <div className="product-info">
                              <h3>{product.name}</h3>
                              <p className="price">${product.price.toFixed(2)}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sección Mujeres */}
              {(selectedGender === 'all' || selectedGender === 'mujer') && (
                <div className="gender-section">
                  <h1 className="gender-title">Mujeres</h1>
                  {selectedCategory === 'all' ? (
                    categories.map(category => {
                      const categoryProducts = groupedProducts[category]?.filter(p => p.gender === 'mujer') || [];
                      if (categoryProducts.length === 0) return null;
                      
                      return (
                        <div key={`mujer-${category}`} className="category-section">
                          <h2 className="category-title">{category}</h2>
                          <div className="product-grid">
                            {categoryProducts.map((product) => (
                              <article 
                                className="product-card" 
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                              >
                                <div className="product-thumb">
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                  />
                                  <button className="quick-add btn-primary">Añadir Rápido</button>
                                </div>
                                <div className="product-info">
                                  <h3>{product.name}</h3>
                                  <p className="price">${product.price.toFixed(2)}</p>
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="category-section">
                      <h2 className="category-title">{selectedCategory}</h2>
                      <div className="product-grid">
                        {filteredProducts.filter(p => p.gender === 'mujer').map((product) => (
                          <article 
                            className="product-card" 
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <div className="product-thumb">
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                              />
                              <button className="quick-add btn-primary">Añadir Rápido</button>
                            </div>
                            <div className="product-info">
                              <h3>{product.name}</h3>
                              <p className="price">${product.price.toFixed(2)}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
                user={user}
                onLoginRequired={() => setIsLoginOpen(true)}
                onGoToCheckout={handleGoToCheckout}
              />
            )}

            {isCheckoutOpen && (
              <Checkout
                cart={cart}
                user={user}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirmOrder={handleConfirmOrder}
              />
            )}

            {isOrderTrackingOpen && (
              <OrderTracking
                user={user}
                onClose={() => setIsOrderTrackingOpen(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;