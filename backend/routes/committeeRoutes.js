// routes/committeeRoutes.js
const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');

// Create a new committee
router.post('/', committeeController.createCommittee);

// Get all committees
router.get('/', committeeController.getCommittees);

// Get committees by chair ID
router.get('/chair/:chairId', committeeController.getCommitteesByChair);
// its thunderclient request would be http://localhost:5000/api/committees/chair/1

// Get committee by ID
router.get('/:id', committeeController.getCommitteeById);

// Get committee overview by ID
router.get('/overview/:id', committeeController.getCommitteeOverview);

// Update committee
router.put('/:id', committeeController.updateCommittee);

// Delete committee
router.delete('/:id', committeeController.deleteCommittee);

module.exports = router;