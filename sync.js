// src/sync.js
const sequelize = require('./db');

sequelize.sync({ force: false }) // Usa { force: true } para sobrescribir la tabla si ya existe
    .then(() => {
        console.log('Base de datos y tablas sincronizadas');
    })
    .catch(err => {
        console.error('Error sincronizando la base de datos:', err);
    });
