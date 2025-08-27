import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useTelegram } from '../hooks/useTelegram';
import { ordersApi } from '../utils/api';
import './Cart.css';

export default function Cart({ isVisible, onClose }) {
  const { cart, getCartTotal, updateQuantity, clearCart } = useCart();
  const { user, initData, hapticFeedback, showAlert, showConfirm } = useTelegram();
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const total = getCartTotal();

  const handleQuantityChange = (productId, quantity) => {
    hapticFeedback('light');
    updateQuantity(productId, quantity);
  };

  const handleSubmitOrder = async () => {
    if (!deliveryAddress.trim()) {
      showAlert('Пожалуйста, укажите адрес доставки');
      return;
    }

    if (cart.length === 0) {
      showAlert('Корзина пуста');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        deliveryAddress: deliveryAddress.trim(),
        initData
      };

      const response = await ordersApi.create(orderData);
      
      if (response.success) {
        hapticFeedback('notification_success');
        clearCart();
        showAlert(response.message || 'Заказ успешно оформлен!');
        
        // Сразу закрываем корзину после успешного заказа
        setDeliveryAddress('');
        onClose();
      }
    } catch (error) {
      console.error('Order creation error:', error);
      hapticFeedback('notification_error');
      showAlert(error.message || 'Ошибка при оформлении заказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearCart = () => {
    showConfirm('Очистить корзину?', (confirmed) => {
      if (confirmed) {
        hapticFeedback('impact_heavy');
        clearCart();
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2>Корзина</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p>Корзина пуста</p>
              <p className="empty-cart-hint">Добавьте товары из каталога</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">{item.price}₽/{item.unit}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">
                      {item.price * item.quantity}₽
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="delivery-address">
                  <label htmlFor="address">Адрес доставки:</label>
                  <textarea
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Укажите полный адрес доставки..."
                    rows="3"
                  />
                </div>

                {user && (
                  <div className="customer-info">
                    <p>Заказчик: {user.first_name} {user.last_name || ''}</p>
                  </div>
                )}

                <div className="total-section">
                  <div className="total-row">
                    <span>Товары:</span>
                    <span>{total}₽</span>
                  </div>
                  <div className="total-row">
                    <span>Доставка:</span>
                    <span>Уточняется</span>
                  </div>
                  <div className="total-row total-final">
                    <span>Итого:</span>
                    <span>{total}₽</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <button 
              className="clear-cart-btn"
              onClick={handleClearCart}
            >
              Очистить
            </button>
            <button
              className="submit-order-btn"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Оформление...' : `Заказать ${total}₽`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}