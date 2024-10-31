// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.patch('/:id', orderController.updateOrderStatus);
router.post('/:orderId/invoice', orderController.generateInvoice);

module.exports = router;