// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register
router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.loginUser);

module.exports = router;