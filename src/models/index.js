// models/index.js
const sequelize = require('../../db');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Invoice = require('./Invoice');
const Product = require('./Product');
const User = require('./User');

function initializeAssociations() {
    // Usuario - Órdenes
    User.hasMany(Order, {
        foreignKey: {
            name: 'user_id',
            allowNull: true
        },
        as: 'orders'
    });
    Order.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
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
    Invoice
};