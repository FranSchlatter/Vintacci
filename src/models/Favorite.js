// models/Favorite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'product',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'favorite'
});

module.exports = Favorite;