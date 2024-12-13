// src/routes/dbInitRoutes.js
const express = require('express');
const router = express.Router();
const dbInitializationController = require('../controllers/dbInitializationController');

router.post('/initialize', dbInitializationController.initializeDatabase);

module.exports = router;