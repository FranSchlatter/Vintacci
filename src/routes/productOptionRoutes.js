// src/routes/productOptionRoutes.js
const express = require('express');
const router = express.Router();
const productOptionController = require('../controllers/productOptionController');

router.get('/', productOptionController.getAllOptions);
router.post('/', productOptionController.createOption);
router.put('/:id', productOptionController.updateOption);
router.delete('/:id', productOptionController.deleteOption);
router.get('/type/:type', productOptionController.getOptionsByType);

module.exports = router;