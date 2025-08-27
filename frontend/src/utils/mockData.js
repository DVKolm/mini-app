// Временные моки для тестирования без backend

export const mockProducts = [
  {
    id: 1,
    name: "Сыр Российский классический",
    description: "Натуральный твёрдый сыр из свежего фермерского молока",
    price: 450,
    category: "Сыры",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
    unit: "кг",
    weight: "0.3-0.5 кг",
    inStock: true
  },
  {
    id: 2, 
    name: "Молоко цельное фермерское",
    description: "Свежее цельное молоко от коров на свободном выпасе",
    price: 80,
    category: "Молоко", 
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
    unit: "л",
    weight: "1 л",
    inStock: true
  },
  {
    id: 3,
    name: "Творог классический 9%",
    description: "Домашний творог традиционной жирности",
    price: 180,
    category: "Творог",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop", 
    unit: "г",
    weight: "500 г",
    inStock: true
  }
];

export const mockCategories = [
  { name: 'Все', emoji: '🛒', displayName: '🛒 Все товары' },
  { name: 'Сыры', emoji: '🧀', displayName: '🧀 Сыры' },
  { name: 'Молоко', emoji: '🥛', displayName: '🥛 Молоко' },
  { name: 'Творог', emoji: '🍰', displayName: '🍰 Творог' },
  { name: 'Напитки', emoji: '🥤', displayName: '🥤 Напитки' }
];

// Mock API для демо режима
export const mockApi = {
  getProducts: () => Promise.resolve(mockProducts),
  getCategories: () => Promise.resolve(mockCategories.slice(1)),
  createOrder: (orderData) => {
    console.log('Demo order created:', orderData);
    return Promise.resolve({ 
      success: true, 
      orderId: 'demo-' + Date.now(),
      message: 'Демо заказ создан! (Backend не подключен)'
    });
  }
};