// routes/delegateRoutes.js
const express = require('express');
const router = express.Router();
const delegateController = require('../controllers/delegateController');

// Get all delegates
router.get('/', delegateController.getAllDelegates);

// Get delegates without country
router.get('/without-country', delegateController.getDelegatesWithoutCountry);

// Get delegates without committee
router.get('/without-committee', delegateController.getDelegatesWithoutCommittee);

// Get delegate by ID
router.get('/:id', delegateController.getDelegateById);

// Assign country to delegate
router.post('/assign-country', delegateController.assignCountry);

// Assign block to delegate
router.post('/assign-block', delegateController.assignBlock);

// Submit position paper
router.post('/submit-paper', delegateController.submitPositionPaper);

// Get overall leaderboard
router.get('/leaderboard/overall', delegateController.getOverallLeaderboard);

// Get committee leaderboard
router.get('/leaderboard/committee/:committeeId', delegateController.getCommitteeLeaderboard);

module.exports = router;