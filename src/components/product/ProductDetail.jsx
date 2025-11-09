import React, { useState } from 'react';
import './ProductDetail.css';

export default function ProductDetail({ product, onClose, onAddToCart }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Por favor selecciona color y talla');
      return;
    }

    onAddToCart({
      ...product,
      selectedColor,
      selectedSize,
      quantity
    });
  };

  const COLOR_CLASSES = {
    negro: 'bg-black',
    blanco: 'bg-white',
    gris: 'bg-gray',
    azul: 'bg-blue',
    'azul marino': 'bg-navy',
    marrón: 'bg-brown',
    rosa: 'bg-pink'
  };

  return (
    <div className="product-detail-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="product-detail-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[currentImage]} alt={product.name} />
              {product.images.length > 1 && (
                <div className="image-controls">
                  <button 
                    onClick={() => setCurrentImage(prev => 
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )}
                  >←</button>
                  <button 
                    onClick={() => setCurrentImage(prev => 
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )}
                  >→</button>
                </div>
              )}
            </div>
            <div className="thumbnail-list">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={currentImage === index ? 'active' : ''}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="description">{product.description}</p>

            <div className="product-options">
              <div className="color-options">
                <label>Color:</label>
                <div className="color-list">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${COLOR_CLASSES[color]} ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                {selectedColor && <span className="selected-text">Color: {selectedColor}</span>}
              </div>

              <div className="size-options">
                <label>Talla:</label>
                <div className="size-list">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >-</button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                  >+</button>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="add-to-cart-button"
                onClick={handleAddToCart}
              >
                Añadir al Carrito
              </button>
              <button className="buy-now-button">
                Comprar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}