import React, { useState, useEffect } from 'react';
import { productsApi } from '../utils/api';
import { useTelegram } from '../hooks/useTelegram';
import './Categories.css';

export default function Categories({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hapticFeedback } = useTelegram();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getCategories();
      setCategories([
        { name: 'Все', emoji: '🛒', displayName: '🛒 Все товары' },
        ...data
      ]);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Не удалось загрузить категории');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    hapticFeedback('light');
    onCategoryChange(categoryName === 'Все' ? null : categoryName);
  };

  if (loading) {
    return (
      <div className="categories-container">
        <div className="categories-loading">Загрузка категорий...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-container">
        <div className="categories-error">
          {error}
          <button onClick={loadCategories} className="retry-btn">
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-scroll">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`category-btn ${
              (selectedCategory === null && category.name === 'Все') ||
              selectedCategory === category.name
                ? 'active'
                : ''
            }`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <span className="category-emoji">{category.emoji}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}