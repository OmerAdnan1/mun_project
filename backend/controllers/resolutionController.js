const Resolution = require('../models/resolutionModel');

// Get all resolutions
const getAllResolutions = async (req, res) => {
    try {
        const resolutions = await Resolution.getAllResolutions();
        return res.status(200).json(resolutions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get resolution by ID
const getResolutionById = async (req, res) => {
    try {
        const { id } = req.params;
        const resolution = await Resolution.getResolutionById(id);
        
        if (!resolution) {
            return res.status(404).json({ message: 'Resolution not found' });
        }
        
        return res.status(200).json(resolution);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Submit new resolution
const submitResolution = async (req, res) => {
    try {
        const { eventId, submissionBlockId, votingType } = req.body;
        
        if (!eventId || !submissionBlockId || !votingType) {
            return res.status(400).json({ message: 'Event ID, submission block ID, and voting type are required' });
        }
        
        const submissionDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // Set due date to 7 days from now
        const status = 'Pending';
        
        const result = await Resolution.submitResolution(eventId, submissionDate, dueDate, status, submissionBlockId, votingType);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete resolution
const deleteResolution = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resolution = await Resolution.getResolutionById(id);
        
        if (!resolution) {
            return res.status(404).json({ message: 'Resolution not found' });
        }
        
        const result = await Resolution.deleteResolution(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update resolution status
const updateResolutionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        
        if (!['Pending', 'Passed', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be Pending, Passed, or Rejected' });
        }
        
        const resolution = await Resolution.getResolutionById(id);
        
        if (!resolution) {
            return res.status(404).json({ message: 'Resolution not found' });
        }
        
        const result = await Resolution.updateResolutionStatus(id, status);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get resolutions by event ID
const getResolutionsByEventId = async (req, res) => {
    try {
        const { eventId } = req.params;
        const resolutions = await Resolution.getResolutionsByEventId(eventId);
        return res.status(200).json(resolutions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get resolutions by block ID
const getResolutionsByBlockId = async (req, res) => {
    try {
        const { blockId } = req.params;
        const resolutions = await Resolution.getResolutionsByBlockId(blockId);
        return res.status(200).json(resolutions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllResolutions,
    getResolutionById,
    submitResolution,
    deleteResolution,
    updateResolutionStatus,
    getResolutionsByEventId,
    getResolutionsByBlockId
};