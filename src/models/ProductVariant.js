// src/models/ProductVariant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const ProductVariant = sequelize.define('ProductVariant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.UUID,
        references: {
            model: 'products',
            key: 'id'
        },
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    discountStart: {
        type: DataTypes.DATE,
        allowNull: true
    },
    discountEnd: {
        type: DataTypes.DATE,
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'product_variants'
});

module.exports = ProductVariant;