// routes/voteRoutes.js
const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// Create a new vote
router.post('/', voteController.createVote);

// Get vote by ID
router.get('/:id', voteController.getVoteById);

// Update vote
router.put('/:id', voteController.updateVote);

// Delete vote
router.delete('/:id', voteController.deleteVote);

// Get votes by document
router.get('/document/:documentId', voteController.getVotesByDocument);

// Get votes by event
router.get('/event/:eventId', voteController.getVotesByEvent);

module.exports = router;