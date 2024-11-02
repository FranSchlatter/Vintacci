// src/controllers/favoriteController.js
const { Favorite, Product } = require('../models');

const favoriteController = {
    // Obtener favoritos de un usuario
    getUserFavorites: async (req, res) => {
        try {
            const { userId } = req.params;
            const favorites = await Favorite.findAll({
                where: { user_id: userId },
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'price', 'image_url', 'stock']
                }]
            });
            res.json(favorites);
        } catch (err) {
            console.error('Error getting favorites:', err);
            res.status(500).json({ error: 'Error al obtener favoritos' });
        }
    },

    // Agregar a favoritos
    addToFavorites: async (req, res) => {
        try {
            const { userId, productId } = req.params;
            
            const existingFavorite = await Favorite.findOne({
                where: { user_id: userId, product_id: productId }
            });

            if (existingFavorite) {
                return res.status(400).json({ 
                    error: 'El producto ya está en favoritos' 
                });
            }

            const favorite = await Favorite.create({
                user_id: userId,
                product_id: productId
            });

            res.status(201).json(favorite);
        } catch (err) {
            console.error('Error adding to favorites:', err);
            res.status(500).json({ error: 'Error al agregar a favoritos' });
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