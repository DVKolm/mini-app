import { mockApi } from './mockData';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const DEMO_MODE = !process.env.REACT_APP_API_URL;

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (window.Telegram?.WebApp?.initData) {
    defaultOptions.headers['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ApiError('Проблемы с подключением к серверу', 0);
    }
    
    throw new ApiError('Произошла неожиданная ошибка', 0);
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint),
  
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
};

export const productsApi = {
  getAll: () => DEMO_MODE ? mockApi.getProducts() : api.get('/products'),
  
  getByCategory: (category) => DEMO_MODE ? 
    mockApi.getProducts().then(products => products.filter(p => p.category === category)) :
    api.get(`/products?category=${encodeURIComponent(category)}`),
  
  getById: (id) => DEMO_MODE ?
    mockApi.getProducts().then(products => products.find(p => p.id === parseInt(id))) :
    api.get(`/products/${id}`),
  
  getCategories: () => DEMO_MODE ? mockApi.getCategories() : api.get('/products/categories'),
};

export const ordersApi = {
  create: (orderData) => DEMO_MODE ? mockApi.createOrder(orderData) : api.post('/orders', orderData),
  
  getById: (id) => DEMO_MODE ? 
    Promise.resolve({ id, status: 'demo', message: 'Demo order' }) :
    api.get(`/orders/${id}`),
  
  getAll: () => DEMO_MODE ? Promise.resolve([]) : api.get('/orders'),
};

export const telegramApi = {
  validate: (initData) => api.post('/telegram/validate', { initData }),
  
  getUser: () => api.get('/telegram/user'),
};

export { ApiError };