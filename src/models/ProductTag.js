// src/models/ProductTag.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

// Tabla intermedia para Tags-Products
const ProductTag = sequelize.define('ProductTag', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'product_tags'
});

module.exports = ProductTag;