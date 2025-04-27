// routes/committeeRoutes.js
const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');

// Create a new committee
router.post('/', committeeController.createCommittee);

// Get all committees
router.get('/', committeeController.getCommittees);

// Get committee by ID
router.get('/:id', committeeController.getCommitteeById);

// Update committee
router.put('/:id', committeeController.updateCommittee);

// Delete committee
router.delete('/:id', committeeController.deleteCommittee);

module.exports = router;