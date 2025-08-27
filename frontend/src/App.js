import React, { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { useCart } from './hooks/useCart';
import { productsApi } from './utils/api';
import Categories from './components/Categories';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const { user, showMainButton, hideMainButton, hapticFeedback, themeParams } = useTelegram();
  const { cartItemsCount, cartTotal } = useCart();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Не удалось загрузить товары. Проверьте подключение к интернету.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = useCallback(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [products, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  useEffect(() => {
    if (cartItemsCount > 0) {
      showMainButton(
        `Корзина (${cartItemsCount}) • ${cartTotal}₽`,
        () => {
          hapticFeedback('light');
          setIsCartVisible(true);
        }
      );
    } else {
      hideMainButton();
    }

    return () => {
      hideMainButton();
    };
  }, [cartItemsCount, cartTotal, showMainButton, hideMainButton, hapticFeedback]);

  const handleCategoryChange = (category) => {
    hapticFeedback('light');
    setSelectedCategory(category);
  };

  const handleCloseCart = () => {
    setIsCartVisible(false);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загружаем свежие продукты... 🥛</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Что-то пошло не так</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadProducts}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="app"
      style={{
        backgroundColor: themeParams.bg_color,
        color: themeParams.text_color
      }}
    >
      <header className="app-header">
        <div className="header-content">
          <h1 className="shop-title">
            🥛 Фермерский магазин
            {user && <span className="user-greeting">Привет, {user.first_name}!</span>}
          </h1>
          {cartItemsCount > 0 && (
            <button 
              className="cart-button"
              onClick={() => setIsCartVisible(true)}
            >
              🛒 <span className="cart-count">{cartItemsCount}</span>
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        <Categories 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="products-section">
          <div className="products-header">
            <h2>
              {selectedCategory ? `${selectedCategory}` : 'Все товары'}
              <span className="products-count">({filteredProducts.length})</span>
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>Товары не найдены</h3>
              <p>В данной категории пока нет товаров</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Cart 
        isVisible={isCartVisible}
        onClose={handleCloseCart}
      />

      <footer className="app-footer">
        <p>Свежие продукты с фермы • Доставка по городу</p>
        <p className="footer-note">Сделано с ❤️ для Telegram</p>
      </footer>
    </div>
  );
}

export default App;