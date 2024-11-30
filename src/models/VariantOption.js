// src/models/VariantOption.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

// Tabla intermedia para Variants-Options
const VariantOption = sequelize.define('VariantOption', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'variant_options'
});

module.exports = VariantOption;