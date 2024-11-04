// models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: 'order',
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
},
  quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'order_item'
});
 
module.exports = OrderItem;