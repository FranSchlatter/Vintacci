// models/index.js
const sequelize = require('../../db');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Invoice = require('./Invoice');
const Product = require('./Product');
const User = require('./User');
const Address = require('./Address')
const Favorite = require('./Favorite')
const CartItem = require('./CartItem')

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
}

// 3. Inicializar asociaciones
initializeAssociations();

// 4. Exportar todo
module.exports = {
    sequelize,
    User,
    Product,
    Order,
    OrderItem,
    Invoice,
    Address,
    Favorite,
    CartItem
};