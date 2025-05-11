// routes/delegateAssignmentRoutes.js
const express = require('express');
const router = express.Router();
const delegateAssignmentController = require('../controllers/delegateAssignmentController');

// Assign delegate to committee
router.post('/', delegateAssignmentController.assignDelegateToCommittee);

// Get all delegate assignments
router.get('/', delegateAssignmentController.getDelegateAssignments);

// Update delegate assignment
router.put('/:id', delegateAssignmentController.updateDelegateAssignment);

// Remove delegate assignment
router.delete('/:id', delegateAssignmentController.removeDelegateAssignment);

// Assign delegate to block
router.put('/:id/block', delegateAssignmentController.assignDelegateToBlock);

// Allocate country to single delegate
router.post('/allocate/single', delegateAssignmentController.allocateCountryToSingleDelegate);

// Allocate countries by experience for an entire committee
router.post('/allocate/committee/:committeeId', delegateAssignmentController.allocateCountriesByExperience);

// Get all assignments (admin view)
router.get('/all', delegateAssignmentController.getAllAssignments);

module.exports = router;