const express = require('express');
const router = express.Router();
const productsData = require('../data/products.json');

router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    if (category) {
      const filteredProducts = productsData.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
      return res.json(filteredProducts);
    }
    
    res.json(productsData);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/categories', (req, res) => {
  try {
    const categories = [...new Set(productsData.map(product => product.category))];
    const categoriesWithEmojis = categories.map(category => {
      const emoji = getCategoryEmoji(category);
      return { name: category, emoji, displayName: `${emoji} ${category}` };
    });
    
    res.json(categoriesWithEmojis);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = productsData.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

function getCategoryEmoji(category) {
  const emojiMap = {
    'Сыры': '🧀',
    'Молоко': '🥛',
    'Творог': '🍰',
    'Напитки': '🥤'
  };
  return emojiMap[category] || '🥛';
}

module.exports = router;