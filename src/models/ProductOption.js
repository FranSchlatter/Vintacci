// src/models/ProductOption.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const ProductOption = sequelize.define('ProductOption', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING, // 'color', 'size', etc.
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'product_options'
});

module.exports = ProductOption;