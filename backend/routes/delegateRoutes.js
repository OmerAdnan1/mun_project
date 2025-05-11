// routes/delegateRoutes.js
const express = require('express');
const router = express.Router();
const delegateController = require('../controllers/delegateController');

// Get all delegates
router.get('/', delegateController.getAllDelegates);

// Get delegate by ID
router.get('/:id', delegateController.getDelegateById);

// Update delegate
router.put('/:id', delegateController.updateDelegate);

// Delete delegate
router.delete('/:id', delegateController.deleteDelegate);

// Add past experience
router.post('/:id/experiences', delegateController.addPastExperience);

// Get past experiences
router.get('/:id/experiences', delegateController.getPastExperiences);

module.exports = router;