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
    // User - Orders
    User.hasMany(Order, {
        foreignKey: 'user_id',
        as: 'orders'
    });
    Order.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // User - Addresses
    User.hasMany(Address, {
        foreignKey: 'user_id',
        as: 'addresses'
    });
    Address.belongsTo(User, {
        foreignKey: 'user_id'
    });

    // User - Favorites
    User.belongsToMany(Product, {
        through: Favorite,
        as: 'favoriteProducts',
        foreignKey: 'user_id'
    });
    
    Product.belongsToMany(User, {
        through: Favorite,
        as: 'favoritedBy',
        foreignKey: 'product_id'
    });

    // User - Cart
    User.hasMany(CartItem, {
        foreignKey: 'user_id',
        as: 'cartItems'
    });
    CartItem.belongsTo(User, {
        foreignKey: 'user_id'
    });

    // Orden - Items
    Order.hasMany(OrderItem, {
        foreignKey: {
            name: 'order_id',
            allowNull: false
        },
        as: 'items',
        onDelete: 'CASCADE'
    });
    OrderItem.belongsTo(Order, {
        foreignKey: 'order_id'
    });

    // Orden - Factura
    Order.hasOne(Invoice, {
        foreignKey: {
            name: 'order_id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });
    Invoice.belongsTo(Order, {
        foreignKey: 'order_id'
    });

    // OrderItem - Producto
    Product.hasMany(OrderItem, {
        foreignKey: {
            name: 'product_id',
            allowNull: false
        }
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