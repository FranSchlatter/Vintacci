// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
        model: 'user',
        key: 'id'
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  shipping_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tracking_number: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'order'
});

module.exports = Order;