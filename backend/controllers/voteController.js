const Vote = require('../models/voteModel');

// Get all votes
exports.getAllVotes = async (req, res) => {
    try {
        const votes = await Vote.getAll();
        res.status(200).json(votes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get vote by ID
exports.getVoteById = async (req, res) => {
    try {
        const vote = await Vote.getById(req.params.id);
        if (!vote) {
            return res.status(404).json({ message: 'Vote not found' });
        }
        res.status(200).json(vote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get votes by delegate ID
exports.getVotesByDelegateId = async (req, res) => {
    try {
        const votes = await Vote.getByDelegateId(req.params.delegateId);
        res.status(200).json(votes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cast vote on motion
exports.voteOnMotion = async (req, res) => {
    try {
        const { delegateId, motionId, voteType } = req.body;
        
        // Basic validation
        if (!delegateId || !motionId || !voteType) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        if (!['For', 'Against', 'Abstain'].includes(voteType)) {
            return res.status(400).json({ message: 'Vote type must be For, Against, or Abstain' });
        }
        
        const result = await Vote.voteOnMotion({
            delegateId,
            motionId,
            voteType
        });
        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cast vote on resolution
exports.voteOnResolution = async (req, res) => {
    try {
        const { delegateId, resolutionId, voteType } = req.body;
        
        // Basic validation
        if (!delegateId || !resolutionId || !voteType) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        if (!['For', 'Against', 'Abstain'].includes(voteType)) {
            return res.status(400).json({ message: 'Vote type must be For, Against, or Abstain' });
        }
        
        const result = await Vote.voteOnResolution({
            delegateId,
            resolutionId,
            voteType
        });
        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a vote
exports.deleteVote = async (req, res) => {
    try {
        const result = await Vote.delete(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};