const PositionPaper = require('../models/positionPaperModel');

// Get all position papers
exports.getAllPositionPapers = async (req, res) => {
    try {
        const papers = await PositionPaper.getAll();
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get position paper by ID
exports.getPositionPaperById = async (req, res) => {
    try {
        const paper = await PositionPaper.getById(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: 'Position paper not found' });
        }
        res.status(200).json(paper);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get position paper by delegate ID
exports.getPositionPaperByDelegateId = async (req, res) => {
    try {
        const paper = await PositionPaper.getByDelegateId(req.params.delegateId);
        if (!paper) {
            return res.status(404).json({ message: 'Position paper not found for this delegate' });
        }
        res.status(200).json(paper);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit a new position paper
exports.createPositionPaper = async (req, res) => {
    try {
        const { delegateId, submissionDate, dueDate, status } = req.body;
        
        // Basic validation
        if (!delegateId || !submissionDate || !dueDate || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const result = await PositionPaper.create({
            delegateId,
            submissionDate,
            dueDate,
            status
        });
        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a position paper
exports.updatePositionPaper = async (req, res) => {
    try {
        const { feedback, status } = req.body;
        
        const result = await PositionPaper.update(req.params.id, {
            feedback,
            status
        });
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a position paper
exports.deletePositionPaper = async (req, res) => {
    try {
        const result = await PositionPaper.delete(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};