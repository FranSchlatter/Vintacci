// models/Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Invoice = sequelize.define('Invoice', {
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
    invoice_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'invoice'
  });

module.exports = Invoice;
