// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.patch('/:id', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);
router.get('/:id', orderController.getOrderById);

router.post('/:orderId/invoice', orderController.generateInvoice);

module.exports = router;