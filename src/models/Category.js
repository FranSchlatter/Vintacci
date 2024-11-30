// src/models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
    parentId: {
        type: DataTypes.UUID,
        references: {
            model: 'categories',
            key: 'id'
        },
        allowNull: true
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'categories'
});
// Auto-referencial para subcategorías
// Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });
// Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId' });

module.exports = Category;