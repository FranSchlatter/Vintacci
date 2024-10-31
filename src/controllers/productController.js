// src/controllers/productController.js
const { Product } = require('../models');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener productos');
        }
    },

    createProduct: async (req, res) => {
        const { name, description, price, category, brand, style, era, size, sex, color, material, image_url, stock, serial_number } = req.body;

        if (!name || !description || !price || !category || !brand || !style || !era || !size || !sex || !color || !material || !image_url || !stock || !serial_number) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        try {
            const newProduct = await Product.create({
                name, description, price, category, brand, style, era, size, 
                sex, color, material, image_url, stock, serial_number
            });
            res.status(201).json(newProduct);
        } catch (err) {
            console.error('Error al agregar el producto:', err.message);
            res.status(500).send('Error al agregar el producto');
        }
    },

    updateProduct: async (req, res) => {
        const { id } = req.params;
        const { name, description, price, category, brand, style, era, size, sex, color, material, image_url, stock, serial_number } = req.body;

        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }

            const updatedProduct = await product.update({
                name, description, price, category, brand, style, era, size, 
                sex, color, material, image_url, stock, serial_number
            });

            res.json(updatedProduct);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar el producto');
        }
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;

        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }

            await product.destroy();
            res.status(204).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el producto');
        }
    },

    getProductById: async (req, res) => {
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
    }
};

module.exports = productController;