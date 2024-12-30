// src/models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    parent_id: {
        type: DataTypes.UUID,
        references: {
            model: 'categories',
            key: 'id'
        },
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'categories'
});

module.exports = Category;