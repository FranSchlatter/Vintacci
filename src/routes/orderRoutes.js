// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/:orderId/invoice', orderController.generateInvoice);
router.get('/:id', orderController.getOrderById);
router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.patch('/:id', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;