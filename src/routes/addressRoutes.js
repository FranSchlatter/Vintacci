// src/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.get('/user/:userId', addressController.getUserAddresses);
router.post('/user/:userId', addressController.addAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.patch('/:id/default/:userId', addressController.setDefaultAddress);

module.exports = router;