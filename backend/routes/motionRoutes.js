const express = require('express');
const router = express.Router();
const motionController = require('../controllers/motionController');

// GET all motions
router.get('/', motionController.getAllMotions);

// GET motion by ID
router.get('/:id', motionController.getMotionById);

// GET motions by event ID
router.get('/event/:eventId', motionController.getMotionsByEventId);

// POST submit new motion
router.post('/', motionController.submitMotion);

// PUT update motion status
router.put('/:id/status', motionController.updateMotionStatus);

// DELETE motion
router.delete('/:id', motionController.deleteMotion);

module.exports = router;