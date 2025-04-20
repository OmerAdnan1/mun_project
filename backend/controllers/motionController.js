const Motion = require('../models/motionModel');

// Get all motions
const getAllMotions = async (req, res) => {
    try {
        const motions = await Motion.getAllMotions();
        return res.status(200).json(motions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get motion by ID
const getMotionById = async (req, res) => {
    try {
        const { id } = req.params;
        const motion = await Motion.getMotionById(id);
        
        if (!motion) {
            return res.status(404).json({ message: 'Motion not found' });
        }
        
        return res.status(200).json(motion);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Submit new motion
const submitMotion = async (req, res) => {
    try {
        const { eventId, title, description } = req.body;
        
        if (!eventId || !title || !description) {
            return res.status(400).json({ message: 'Event ID, title, and description are required' });
        }
        
        const subDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // Set due date to 7 days from now
        
        const result = await Motion.submitMotion(eventId, title, subDate, dueDate, description);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete motion
const deleteMotion = async (req, res) => {
    try {
        const { id } = req.params;
        
        const motion = await Motion.getMotionById(id);
        
        if (!motion) {
            return res.status(404).json({ message: 'Motion not found' });
        }
        
        const result = await Motion.deleteMotion(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update motion status
const updateMotionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be Pending, Approved, or Rejected' });
        }
        
        const motion = await Motion.getMotionById(id);
        
        if (!motion) {
            return res.status(404).json({ message: 'Motion not found' });
        }
        
        const result = await Motion.updateMotionStatus(id, status);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get motions by event ID
const getMotionsByEventId = async (req, res) => {
    try {
        const { eventId } = req.params;
        const motions = await Motion.getMotionsByEventId(eventId);
        return res.status(200).json(motions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllMotions,
    getMotionById,
    submitMotion,
    deleteMotion,
    updateMotionStatus,
    getMotionsByEventId
};