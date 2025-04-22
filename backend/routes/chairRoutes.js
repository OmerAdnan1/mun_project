// routes/chairRoutes.js
const express = require('express');
const router = express.Router();
const chairController = require('../controllers/chairController');

// Get all chairs
router.get('/', chairController.getAllChairs);

// Get chair by ID
router.get('/:id', chairController.getChairById);

// Assign committee to chair
router.post('/assign-committee', chairController.assignCommittee);

// Provide feedback on position paper
router.post('/provide-feedback', chairController.provideFeedback);

// Get position papers for a committee
router.get('/papers/:committeeId', chairController.getCommitteePapers);

module.exports = router;