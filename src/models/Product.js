// src/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
    },
    brand: {
        type: DataTypes.STRING,
    },
    style: {
        type: DataTypes.STRING,
    },
    era: {
        type: DataTypes.STRING,
    },
    size: {
        type: DataTypes.STRING,
    },
    sex: {
        type: DataTypes.STRING,
    },
    color: {
        type: DataTypes.STRING,
    },
    material: {
        type: DataTypes.STRING,
    },
    image_url: {
        type: DataTypes.STRING,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    serial_number: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'product'
});

module.exports = Product;