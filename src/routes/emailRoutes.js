// src/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Auth/User emails
router.post('/welcome', emailController.sendWelcome);

// Contact emails
router.post('/contact-confirm', emailController.sendContactConfirm);
router.post('/contact-staff', emailController.sendContactStaff);

// Order emails
router.post('/order-created', emailController.sendOrderCreated);
router.post('/order-status', emailController.sendOrderStatus);
router.post('/order-custom', emailController.sendOrderCustom);

// Marketing emails
router.post('/new-product', emailController.sendNewProduct);
router.post('/offer', emailController.sendOffer);

module.exports = router;