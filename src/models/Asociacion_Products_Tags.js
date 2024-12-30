// src/models/Asociacion_Products_Tags.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

// Tabla intermedia para Tags-Products
const Asociacion_Products_Tags = sequelize.define('Asociacion_Products_Tags', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    tag_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tag',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'asociacion_products_tags'
});

module.exports = Asociacion_Products_Tags;