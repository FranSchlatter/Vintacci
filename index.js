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

// PRODUCTS

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

// Ruta para actualizar un producto
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url } = req.body;

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *',
            [name, description, price, image_url, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar el producto');
    }
});

// Ruta para eliminar un producto
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.status(204).send();  // Respuesta sin contenido (No Content)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar el producto');
    }
});

// USERS

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
        console.error('Error al registrar el usuario:', err.message); // Agrega el mensaje de error
        res.status(500).send('Error al registrar el usuario');
    }
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
            [username, email, password, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar el usuario');
    }
});

// Ruta para eliminar un usuario
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(204).send();  // Respuesta sin contenido (No Content)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar el usuario');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});