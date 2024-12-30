// src/models/Asociacion_Tags_Categories.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

// Tabla intermedia para Variants-Options
const Asociacion_Tags_Categories = sequelize.define('Asociacion_Tags_Categories', {
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
    tableName: 'asociacion_tags_categories'
});

module.exports = Asociacion_Tags_Categories;