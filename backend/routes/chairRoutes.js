// routes/chairRoutes.js
const express = require('express');
const router = express.Router();
const chairController = require('../controllers/chairController');

// Get all chairs
router.get('/', chairController.getAllChairs);

// Get chair by ID
router.get('/:id', chairController.getChairById);

// Get chair by user ID
router.get('/user/:userId', chairController.getChairByUserId);

// Assign chair to committee
router.put('/assign', chairController.assignToCommittee);

// Unassign chair from committee
router.put('/unassign/:id', chairController.unassignFromCommittee);

module.exports = router;