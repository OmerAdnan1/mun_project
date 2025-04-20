const Event = require('../models/eventModel');

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.getAllEvents();
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.getEventById(id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        return res.status(200).json(event);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Create new event
const createEvent = async (req, res) => {
    try {
        const { title, eventType, sessionId } = req.body;
        
        if (!title || !eventType || !sessionId) {
            return res.status(400).json({ message: 'Title, event type, and session ID are required' });
        }
        
        const result = await Event.createEvent(title, eventType, sessionId);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, eventType } = req.body;
        
        if (!title && !eventType) {
            return res.status(400).json({ message: 'At least one field to update is required' });
        }
        
        const event = await Event.getEventById(id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        const result = await Event.updateEvent(id, title || event.Agenda, eventType || event.EventType);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const event = await Event.getEventById(id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        const result = await Event.deleteEvent(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get events by session ID
const getEventsBySessionId = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const events = await Event.getEventsBySessionId(sessionId);
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsBySessionId
};