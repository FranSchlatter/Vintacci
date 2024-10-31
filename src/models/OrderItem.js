// models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Importa la conexión de la DB

const OrderItem = sequelize.define('OrderItem', {
  id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
  },
  order_id: {
      type: DataTypes.UUID,
      allowNull: false
  },
  product_id: {
      type: DataTypes.UUID,
      allowNull: false
  },
  quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
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
  tableName: 'order_items'
});
 
module.exports = OrderItem;