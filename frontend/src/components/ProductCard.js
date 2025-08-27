import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useTelegram } from '../hooks/useTelegram';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { hapticFeedback } = useTelegram();
  const [justAdded, setJustAdded] = useState(false);
  
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    hapticFeedback('light');
    addToCart(product, 1);
    setJustAdded(true);
  };

  useEffect(() => {
    if (justAdded) {
      const timer = setTimeout(() => setJustAdded(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [justAdded]);

  const handleIncrement = () => {
    hapticFeedback('light');
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    hapticFeedback('light');
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      updateQuantity(product.id, 0);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.name}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE1MFYxMDBIMTI1VjEyNUgxMDBWMTUwSDEyNVYxNzVIMTUwVjE1MEgxNzVWMTI1WiIgZmlsbD0iI2NjYyIvPgo8L3N2Zz4K';
          }}
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <span className="product-weight">{product.weight}</span>
          {product.nutritionalInfo && (
            <span className="product-calories">
              {product.nutritionalInfo.calories} ккал
            </span>
          )}
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            {product.price}₽<span className="price-unit">/{product.unit}</span>
          </div>
          
          {quantity === 0 ? (
            <button 
              className={`add-to-cart-btn ${justAdded ? 'just-added' : ''}`}
              onClick={handleAddToCart}
            >
              {justAdded ? '✓ Добавлено!' : 'В корзину'}
            </button>
          ) : (
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={handleDecrement}
              >
                −
              </button>
              <span className="quantity">{quantity}</span>
              <button 
                className="quantity-btn"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
      
      {!product.inStock && (
        <div className="out-of-stock-overlay">
          Нет в наличии
        </div>
      )}
    </div>
  );
}