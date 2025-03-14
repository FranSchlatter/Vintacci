// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);
router.post('/:productId/variants', productController.createVariant);
router.patch('/:productId/variants/:variantId', productController.updateVariant);
router.delete('/:productId/variants/:variantId', productController.deleteVariant);

module.exports = router;