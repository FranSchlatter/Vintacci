// src/index.js
const express = require('express');
const pool = require('./db');  // Importamos la conexión desde db.js
const app = express();
const PORT = 5000;
const cors = require('cors'); // Importar cors


// Habilitar CORS
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para agregar un nuevo producto
app.post('/products', async (req, res) => {
    const { name, description, price, image_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al agregar el producto');
    }
});

// Ruta para obtener todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener usuarios');
    }
});

// Ruta para registrar un nuevo usuario
app.post('/users', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});