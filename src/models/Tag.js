// src/models/Tag.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Tag = sequelize.define('Tag', {
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
    type: {
        type: DataTypes.STRING, // 'descriptive', 'functional', 'occasion', 'season', etc.
        allowNull: false,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'tags'
});

module.exports = Tag;