// src/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Podría ser algo como "REM001", "CAM001", etc.
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    brand: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'draft'),
        defaultValue: 'active'
    },
    categoryId: {
        type: DataTypes.UUID,
        references: {
            model: 'categories',
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'products'
});

module.exports = Product;