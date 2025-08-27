class Order {
  constructor({
    id,
    userId,
    userName,
    items = [],
    totalAmount,
    deliveryAddress,
    status = 'pending',
    telegramData = {},
    notes = ''
  }) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.items = items.map(item => new OrderItem(item));
    this.totalAmount = totalAmount;
    this.deliveryAddress = deliveryAddress;
    this.status = status;
    this.telegramData = telegramData;
    this.notes = notes;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  updateStatus(newStatus) {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }
    
    this.status = newStatus;
    this.updatedAt = new Date().toISOString();
  }

  calculateTotal() {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName,
      items: this.items.map(item => item.toJSON()),
      totalAmount: this.totalAmount,
      deliveryAddress: this.deliveryAddress,
      status: this.status,
      telegramData: this.telegramData,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static validate(orderData) {
    const errors = [];
    
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    if (!orderData.deliveryAddress || orderData.deliveryAddress.trim() === '') {
      errors.push('Delivery address is required');
    }
    
    if (!orderData.totalAmount || orderData.totalAmount <= 0) {
      errors.push('Valid total amount is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

class OrderItem {
  constructor({ id, name, price, quantity, subtotal }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.subtotal = subtotal || (price * quantity);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      subtotal: this.subtotal
    };
  }
}

module.exports = { Order, OrderItem };