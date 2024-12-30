// src/models/Asociacion_Variants_Options.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

// Tabla intermedia para Variants-Options
const Asociacion_Variants_Options = sequelize.define('Asociacion_Variants_Options', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'asociacion_variants_options'
});

module.exports = Asociacion_Variants_Options;