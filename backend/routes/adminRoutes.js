const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get admin by ID
router.get('/:id', adminController.getAdminById);

// Update admin
router.put('/:id', adminController.updateAdmin);

// Delete admin
router.delete('/:id', adminController.deleteAdmin);


// Assign chair to committee
router.post('/chair-assignment', adminController.assignChairToCommittee);

// Calculate overall scores
router.post('/scores/calculate', adminController.calculateOverallScores);

// Generate awards
router.post('/awards/generate', adminController.generateAwards);

// Change document status
router.put('/documents/:id/status', adminController.changeDocumentStatus);

// Change event status
router.put('/events/:id/status', adminController.changeEventStatus);


module.exports = router;

