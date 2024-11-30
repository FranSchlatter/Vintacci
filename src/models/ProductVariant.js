// src/models/ProductVariant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const ProductVariant = sequelize.define('ProductVariant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    },
    image_url: {
        type: DataTypes.STRING,
    },
    productId: {
        type: DataTypes.UUID,
        references: {
            model: 'products',
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'product_variants'
});

module.exports = ProductVariant;