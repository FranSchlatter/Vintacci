// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
// const { User, Product, Order, OrderItem, Invoice } = require('./src/models');

// Importar rutas
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const addressRoutes = require('./src/routes/addressRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/addresses', addressRoutes);
app.use('/auth', authRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: err.message 
    });
});

// Conectar a la base de datos y sincronizar modelos
sequelize.sync({ force: false }) // force: borra la db.
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });