const express = require('express');
const cors = require('cors'); // Importar cors
const sequelize = require('./db'); // Importamos sequelize desde db.js
const Product = require('./src/models/Product');
const User = require('./src/models/User');

const app = express();
const PORT = 5000;

// Habilitar CORS
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Conectar a la base de datos
sequelize.sync()
    .then(() => console.log('Base de datos sincronizada'))
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

// PRODUCTS

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para agregar un nuevo producto
app.post('/products', async (req, res) => {
    const { name, description, price, category, brand, style, era, size, sex, color, material, image_url, stock, serial_number } = req.body;

    // Validación de datos
    if ( !name || !description || !price || !category || !brand || !style || !era || !size|| !sex || !color || !material || !image_url || !stock || !serial_number ) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    try {
        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            brand,
            style, 
            era,
            size, 
            sex, 
            color,
            material,
            image_url,
            stock,
            serial_number,
        });
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error al agregar el producto:', err.message);
        res.status(500).send('Error al agregar el producto');
    }
});

// Ruta para actualizar un producto TODO
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        const updatedProduct = await product.update({
            name,
            description,
            price,
            image_url
        });

        res.json(updatedProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar el producto');
    }
});

// Ruta para eliminar un producto TODO
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        await product.destroy();
        res.status(204).send();  // Respuesta sin contenido (No Content)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar el producto');
    }
});

// Filtrar un producto TODO
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener el producto');
    }
});

// USERS

// Ruta para obtener todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener usuarios');
    }
});

// Ruta para registrar un nuevo usuario
app.post('/users', async (req, res) => {
    console.log(req.body); // Agrega esta línea para depuración
    const { username, gmail, password, role, first_name, last_name, dni, country, city, postal_code, street, height, apartment } = req.body;

    // Validación de datos
    if ( !username || !gmail || !password || !role || !first_name || !last_name || !dni || !country || !city || !postal_code || !street || !height || !apartment ) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    try {
        const newUser = await User.create({
            username,
            gmail,
            password,
            role,
            first_name,
            last_name,
            dni,
            country,
            city,
            postal_code,
            street,
            height,
            apartment
        });
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error al registrar el usuario:', err.message);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Ruta para actualizar un usuario TODO
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { role, first_name, last_name, dni, country, city, postal_code, street, height, apartment, username, gmail, password } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const updatedUser = await user.update({
            role,
            first_name,
            last_name,
            dni,
            country,
            city,
            postal_code,
            street,
            height,
            apartment,
            username,
            gmail,
            password
        });

        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar el usuario');
    }
});

// Ruta para eliminar un usuario TODO
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        await user.destroy();
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
