import React, { useState } from 'react';
import { sampleProducts } from '../data/sampleProducts';
import ProductDetail from './product/ProductDetail';
import './ProductGrid.css';

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {sampleProducts.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="product-image">
              <img src={product.images[0]} alt={product.name} />
            </div>
            <div className="product-info-preview">
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

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default ProductGrid;