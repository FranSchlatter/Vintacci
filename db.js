// db.js
const { Sequelize } = require('sequelize');

// Conexión a la base de datos usando Sequelize
const sequelize = new Sequelize('vintacci', 'postgres', 'Schlatter', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false, // No muestra logs
});

// Verifica la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa.');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

module.exports = sequelize;

// psql -U postgres > db
// npm run dev > back
// npm start > front
// Emailer: FAN5743FNP4AXV6S7GYVQ73N

// TODO After:
// Historial de compras para el user
// Implemetar maps en info contacto.

// Paycheck real, o mercado pago fake.
// Login google.
// Analitics con info real.
// Admin panel.
// Productos complementarios, similares y recomendaciones.
// Análisis básico de tendencias para ofertas.

// Revisar mercado pago, nike, etc para sacar + funcionalidades.