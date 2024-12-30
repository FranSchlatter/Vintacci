// models/Asociacion_Users_Products.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Asociacion_Users_Products = sequelize.define('Asociacion_Users_Products', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
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
    tableName: 'asociacion_users_products'
});

module.exports = Asociacion_Users_Products;