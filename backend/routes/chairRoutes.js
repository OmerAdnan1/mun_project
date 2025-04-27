// routes/chairRoutes.js
const express = require('express');
const router = express.Router();
const chairController = require('../controllers/chairController');

// Get chair by ID
router.get('/:id', chairController.getChairById);

// Update chair
router.put('/:id', chairController.updateChair);

// Delete chair
router.delete('/:id', chairController.deleteChair);

module.exports = router;