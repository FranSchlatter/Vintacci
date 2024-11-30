// models/index.js
const sequelize = require('../../db');

// Importar todos los modelos
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Invoice = require('./Invoice');
const Product = require('./Product');
const User = require('./User');
const Address = require('./Address');
const Favorite = require('./Favorite');
const CartItem = require('./CartItem');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductOption = require('./ProductOption');
const ProductVariant = require('./ProductVariant');
const ProductTag = require('./ProductTag');
const VariantOption = require('./VariantOption');

function initializeAssociations() {
    // User - Orders (1:N)
    User.hasMany(Order, {
        foreignKey: 'user_id',
        as: 'orders',
        onDelete: 'SET NULL'
    });
    Order.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - Addresses (1:N)
    User.hasMany(Address, {
        foreignKey: 'user_id',
        as: 'addresses',
        onDelete: 'CASCADE'
    });
    Address.belongsTo(User, {
        foreignKey: 'user_id'
    });

    // User - Products through Favorites (N:N)
    User.belongsToMany(Product, {
        through: Favorite,
        as: 'favoriteProducts',
        foreignKey: 'user_id',
        otherKey: 'product_id',
        onDelete: 'CASCADE'
    });
    
    Product.belongsToMany(User, {
        through: Favorite,
        as: 'favoritedBy',
        foreignKey: 'product_id',
        otherKey: 'user_id',
        onDelete: 'CASCADE'
    });

    // User - Cart (1:N)
    User.hasMany(CartItem, {
        foreignKey: 'user_id',
        as: 'cartItems',
        onDelete: 'CASCADE'
    });
    CartItem.belongsTo(User, {
        foreignKey: 'user_id'
    });

    // Product - CartItem (1:N)
    Product.hasMany(CartItem, {
        foreignKey: 'product_id',
        onDelete: 'CASCADE'
    });
    CartItem.belongsTo(Product, {
        foreignKey: 'product_id'
    });

    // Order - OrderItems (1:N)
    Order.hasMany(OrderItem, {
        foreignKey: 'order_id',
        as: 'items',
        onDelete: 'CASCADE'
    });
    OrderItem.belongsTo(Order, {
        foreignKey: 'order_id'
    });

    // Order - Invoice (1:1)
    Order.hasOne(Invoice, {
        foreignKey: 'order_id',
        as: 'invoice',
        onDelete: 'CASCADE'
    });
    Invoice.belongsTo(Order, {
        foreignKey: 'order_id'
    });

    // Product - OrderItem (1:N)
    Product.hasMany(OrderItem, {
        foreignKey: 'product_id',
        onDelete: 'RESTRICT'
    });
    OrderItem.belongsTo(Product, {
        foreignKey: 'product_id'
    });

    // Categories (auto-referencial)
    Category.belongsTo(Category, { 
        as: 'parent', 
        foreignKey: 'parentId',
        onDelete: 'RESTRICT'
    });
    Category.hasMany(Category, { 
        as: 'subcategories', 
        foreignKey: 'parentId',
        onDelete: 'CASCADE'
    });

    // Product - Category
    Product.belongsTo(Category, {
        foreignKey: 'categoryId',
        onDelete: 'RESTRICT'
    });
    Category.hasMany(Product, {
        foreignKey: 'categoryId'
    });

    // Product - ProductVariant
    Product.hasMany(ProductVariant, {
        foreignKey: 'productId',
        onDelete: 'CASCADE'
    });
    ProductVariant.belongsTo(Product, {
        foreignKey: 'productId'
    });

    // Product - Tags
    Product.belongsToMany(Tag, { 
        through: ProductTag,
        onDelete: 'CASCADE'
    });
    Tag.belongsToMany(Product, { 
        through: ProductTag,
        onDelete: 'CASCADE'
    });

    // ProductVariant - ProductOption
    ProductVariant.belongsToMany(ProductOption, { 
        through: VariantOption,
        onDelete: 'CASCADE'
    });
    ProductOption.belongsToMany(ProductVariant, { 
        through: VariantOption,
        onDelete: 'CASCADE'
    });
}

// Inicializar asociaciones
initializeAssociations();

// Exportar todo
module.exports = {
    sequelize,
    User,
    Product,
    Order,
    OrderItem,
    Invoice,
    Address,
    Favorite,
    CartItem,
    Category,
    Tag,
    ProductOption,
    ProductVariant,
    ProductTag,
    VariantOption
};