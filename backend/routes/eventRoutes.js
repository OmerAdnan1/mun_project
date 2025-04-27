const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create a new event
router.post('/', eventController.createEvent);

// Get all events by committee
router.get('/committee/:id', eventController.getEventsByCommittee);

// Get all events by delegate
router.get('/delegate/:id', eventController.getEventsByDelegate);

// Get event by ID
router.get('/:id', eventController.getEventById);

// Update event
router.put('/:id', eventController.updateEvent);

// Delete event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;