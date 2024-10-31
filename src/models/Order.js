// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Importa la conexión de la DB

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
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
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'orders'
});

module.exports = Order;