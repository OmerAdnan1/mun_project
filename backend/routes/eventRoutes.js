const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET all events
router.get('/', eventController.getAllEvents);

// GET event by ID
router.get('/:id', eventController.getEventById);

// GET events by session ID
router.get('/session/:sessionId', eventController.getEventsBySessionId);

// POST new event
router.post('/', eventController.createEvent);

// PUT update event
router.put('/:id', eventController.updateEvent);

// DELETE event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;