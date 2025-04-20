const express = require('express');
const router = express.Router();
const positionPaperController = require('../controllers/positionPaperController');

// GET all position papers
router.get('/', positionPaperController.getAllPositionPapers);

// GET position paper by ID
router.get('/:id', positionPaperController.getPositionPaperById);

// GET position paper by delegate ID
router.get('/delegate/:delegateId', positionPaperController.getPositionPaperByDelegateId);

// POST create new position paper
router.post('/', positionPaperController.createPositionPaper);

// PUT update position paper
router.put('/:id', positionPaperController.updatePositionPaper);

// DELETE position paper
router.delete('/:id', positionPaperController.deletePositionPaper);

module.exports = router;