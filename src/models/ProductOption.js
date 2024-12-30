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
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'product_options'
});

module.exports = ProductOption;