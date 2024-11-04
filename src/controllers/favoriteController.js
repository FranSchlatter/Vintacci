// src/controllers/favoriteController.js
const { Favorite, Product, User } = require('../models');

const favoriteController = {
    // Obtener favoritos de un usuario
    getUserFavorites: async (req, res) => {
        try {
            const { userId } = req.params;
            
            const user = await User.findByPk(userId, {
                include: [{
                    model: Product,
                    as: 'favoriteProducts',
                    through: { attributes: [] }, // Esto evita incluir datos de la tabla intermedia
                    attributes: ['id', 'name', 'price', 'image_url', 'stock', 'brand', 'category']
                }]
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(user.favoriteProducts);
        } catch (err) {
            console.error('Error getting favorites:', err);
            res.status(500).json({ error: 'Error al obtener favoritos' });
        }
    },

    // Agregar a favoritos
    addToFavorites: async (req, res) => {
        try {
            const { userId, productId } = req.params;
    
            // Validar que exista el usuario
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    error: 'Usuario no encontrado',
                    userId
                });
            }
    
            // Validar que exista el producto
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({
                    error: 'Producto no encontrado',
                    productId
                });
            }
    
            // Verificar si ya existe el favorito
            const existingFavorite = await Favorite.findOne({
                where: { user_id: userId, product_id: productId }
            });

            if (existingFavorite) {
                console.error('Favorite already exists');
                return res.status(400).json({ 
                    error: 'El producto ya está en favoritos',
                    favorite: existingFavorite
                });
            }
    
            // Crear el favorito
            const favorite = await Favorite.create({
                user_id: userId,
                product_id: productId
            });
    
            // Devolver la respuesta con el producto incluido
            res.status(201).json({
                id: favorite.id,
                user_id: userId,
                product_id: productId,
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    stock: product.stock
                }
            });
    
        } catch (err) {
            console.error('Error detallado:', err);
            res.status(500).json({ 
                error: 'Error al agregar a favoritos',
                details: err.message,
                type: err.name,
                stack: err.stack
            });
        }
    },

    // Eliminar de favoritos
    removeFromFavorites: async (req, res) => {
        try {
            const { userId, productId } = req.params;
            
            const favorite = await Favorite.findOne({
                where: { user_id: userId, product_id: productId }
            });

            if (!favorite) {
                return res.status(404).json({ 
                    error: 'Favorito no encontrado' 
                });
            }

            await favorite.destroy();
            res.status(204).send();
        } catch (err) {
            console.error('Error removing from favorites:', err);
            res.status(500).json({ error: 'Error al eliminar de favoritos' });
        }
    },

    // Verificar si un producto está en favoritos
    checkFavorite: async (req, res) => {
        try {
            const { userId, productId } = req.params;
            
            const favorite = await Favorite.findOne({
                where: { user_id: userId, product_id: productId }
            });

            res.json({ isFavorite: !!favorite });
        } catch (err) {
            console.error('Error checking favorite:', err);
            res.status(500).json({ error: 'Error al verificar favorito' });
        }
    }
};

module.exports = favoriteController;