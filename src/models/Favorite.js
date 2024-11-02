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
        allowNull: false
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'favorites'
});

module.exports = Favorite;