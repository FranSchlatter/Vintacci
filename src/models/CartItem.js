// models/CartItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
});

module.exports = CartItem;