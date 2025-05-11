const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get admin by ID
// Get dashboard counts

// Generate awards
router.post('/awards/generate', adminController.generateAwards);


router.get('/dashboard-counts', adminController.getDashboardCounts);

router.get('/:id', adminController.getAdminById);

// Update admin
router.put('/:id', adminController.updateAdmin);

// Delete admin
router.delete('/:id', adminController.deleteAdmin);

// Get all users
router.get('/users/all', adminController.getAllUsers);

// Get all delegates
router.get('/delegates/all', adminController.getAllDelegates);

// Get all delegate assignments
router.get('/assignments/all', adminController.getAllDelegateAssignments);



// Assign chair to committee
router.post('/chair-assignment', adminController.assignChairToCommittee);

// Calculate overall scores
router.post('/scores/calculate', adminController.calculateOverallScores);


// Change document status
router.put('/documents/:id/status', adminController.changeDocumentStatus);

// Change event status
router.put('/events/:id/status', adminController.changeEventStatus);


module.exports = router;

