import React, { useState } from 'react';
import { sampleProducts } from '../../data/sampleProducts';
import ProductDetail from '../../components/product/ProductDetail';
import './ShopPage.css';

const categories = [...new Set(sampleProducts.map(product => product.category))];

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    search: ''
  });

  const handleAddToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    setSelectedProduct(null);
  };

  const filteredProducts = sampleProducts.filter(product => {
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (product.price < min || (max && product.price > max)) {
        return false;
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="shop-container">
      <aside className="filters-sidebar">
        <div className="filter-section">
          <h3>Categorías</h3>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <h3>Rango de Precio</h3>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
          >
            <option value="all">Todos los Precios</option>
            <option value="0-25">$0 - $25</option>
            <option value="25-50">$25 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100">$100+</option>
          </select>
        </div>

        <div className="filter-section">
          <h3>Buscar</h3>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </aside>

      <main className="products-grid">
        <div className="products-header">
          <h2>Productos ({filteredProducts.length})</h2>
          <select className="sort-select">
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
        </div>

        <div className="products-container">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="product-image">
                <img src={product.images[0]} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <div className="product-colors">
                  {product.colors.map((color) => (
                    <span 
                      key={color} 
                      className={`color-dot bg-${color}`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}