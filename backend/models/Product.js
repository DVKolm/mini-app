class Product {
  constructor({
    id,
    name,
    description,
    price,
    category,
    image,
    unit = 'шт',
    weight,
    inStock = true,
    nutritionalInfo = {}
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.image = image;
    this.unit = unit;
    this.weight = weight;
    this.inStock = inStock;
    this.nutritionalInfo = nutritionalInfo;
    this.createdAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      image: this.image,
      unit: this.unit,
      weight: this.weight,
      inStock: this.inStock,
      nutritionalInfo: this.nutritionalInfo
    };
  }

  static validate(productData) {
    const errors = [];
    
    if (!productData.name || productData.name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (!productData.price || productData.price <= 0) {
      errors.push('Valid price is required');
    }
    
    if (!productData.category || productData.category.trim() === '') {
      errors.push('Category is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Product;