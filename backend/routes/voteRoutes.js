const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// GET all votes
router.get('/', voteController.getAllVotes);

// GET vote by ID
router.get('/:id', voteController.getVoteById);

// GET votes by delegate ID
router.get('/delegate/:delegateId', voteController.getVotesByDelegateId);

// POST vote on motion
router.post('/motion', voteController.voteOnMotion);

// POST vote on resolution
router.post('/resolution', voteController.voteOnResolution);

// DELETE vote
router.delete('/:id', voteController.deleteVote);

module.exports = router;