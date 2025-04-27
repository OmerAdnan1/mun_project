const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// Record a new score
router.post('/', scoreController.recordScore);

// Get all scores by delegate
router.get('/delegate/:id', scoreController.getScoresByDelegate);

// Get all scores by committee
router.get('/committee/:id', scoreController.getScoresByCommittee);

// Get score by ID
router.get('/:id', scoreController.getScoreById);

// Update score
router.put('/:id', scoreController.updateScore);

// Delete score
router.delete('/:id', scoreController.deleteScore);

module.exports = router;