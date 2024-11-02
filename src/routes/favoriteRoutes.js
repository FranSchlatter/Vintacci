// src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.get('/user/:userId', favoriteController.getUserFavorites);
router.post('/user/:userId/product/:productId', favoriteController.addToFavorites);
router.delete('/user/:userId/product/:productId', favoriteController.removeFromFavorites);
router.get('/user/:userId/product/:productId/check', favoriteController.checkFavorite);

module.exports = router;