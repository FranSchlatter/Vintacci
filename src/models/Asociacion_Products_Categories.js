// src/models/Asociacion_Products_Categories.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

// Tabla intermedia para Variants-Options
const Asociacion_Products_Categories = sequelize.define('Asociacion_Products_Categories', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'asociacion_products_categories'
});

module.exports = Asociacion_Products_Categories;