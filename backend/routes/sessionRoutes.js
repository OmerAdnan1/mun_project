// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Get all sessions
router.get('/', sessionController.getAllSessions);

// Get session by ID
router.get('/:id', sessionController.getSessionById);

// Get sessions by committee
router.get('/committee/:committeeId', sessionController.getSessionsByCommittee);

// Create new session
router.post('/', sessionController.createSession);

// Update session
router.put('/:id', sessionController.updateSession);

// End session (update end time to current time)
router.put('/:id/end', sessionController.endSession);

// Delete session
router.delete('/:id', sessionController.deleteSession);

module.exports = router;