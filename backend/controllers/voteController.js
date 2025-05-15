// controllers/voteController.js
const Vote = require('../models/Vote');

// Create a new vote
exports.createVote = async (req, res) => {
  try {
    const vote = await Vote.create(req.body);

    res.status(201).json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error('Create vote error:', error);

    // Handle specific errors
    if (error.message.includes('Invalid vote value')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote value. Must be for, against, or abstain.',
        error: error.message
      });
    }

    if (error.message.includes('Exactly one of event_id or document_id must be provided')) {
      return res.status(400).json({
        success: false,
        message: 'Exactly one of event_id or document_id must be provided',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create vote',
      error: error.message
    });
  }
};

// Get vote by ID
exports.getVoteById = async (req, res) => {
  try {
    const vote = await Vote.getById(req.params.id);

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error('Get vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vote',
      error: error.message
    });
  }
};

// Update vote
exports.updateVote = async (req, res) => {
  try {
    const vote = await Vote.update(req.params.id, req.body);

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error('Update vote error:', error);

    // Handle specific errors
    if (error.message.includes('Invalid vote value')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote value. Must be for, against, or abstain.',
        error: error.message
      });
    }

    if (error.message.includes('Vote record not found')) {
      return res.status(404).json({
        success: false,
        message: 'Vote record not found',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update vote',
      error: error.message
    });
  }
};

// Delete vote
exports.deleteVote = async (req, res) => {
  try {
    await Vote.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Vote deleted successfully'
    });
  } catch (error) {
    console.error('Delete vote error:', error);
    
    if (error.message.includes('Vote record not found')) {
      return res.status(404).json({
        success: false,
        message: 'Vote record not found',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete vote',
      error: error.message
    });
  }
};

// Get votes by document
exports.getVotesByDocument = async (req, res) => {
  try {
    const votes = await Vote.getByDocument(req.params.documentId);

    res.status(200).json({
      success: true,
      count: votes.length,
      data: votes
    });
  } catch (error) {
    console.error('Get votes by document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve votes by document',
      error: error.message
    });
  }
};

// Get votes by event
exports.getVotesByEvent = async (req, res) => {
  try {
    const votes = await Vote.getByEvent(req.params.eventId);

    res.status(200).json({
      success: true,
      count: votes.length,
      data: votes
    });
  } catch (error) {
    console.error('Get votes by event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve votes by event',
      error: error.message
    });
  }
};

// Check if delegate has voted for a document
exports.checkUserVote = async (req, res) => {
  try {
    const { delegateId, documentId } = req.query;
    
    if (!delegateId || !documentId) {
      return res.status(400).json({
        success: false,
        message: 'Delegate ID and Document ID are required'
      });
    }
    
    const hasVoted = await Vote.hasVoted(delegateId, documentId);
    
    res.status(200).json({
      success: true,
      data: { hasVoted }
    });
  } catch (error) {
    console.error('Check user vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check if user has voted',
      error: error.message
    });
  }
};

// Count votes for a document
exports.countDocumentVotes = async (req, res) => {
  try {
    const documentId = req.params.documentId;
    
    const voteCount = await Vote.countVotesForDocument(documentId);
    
    res.status(200).json({
      success: true,
      data: voteCount
    });
  } catch (error) {
    console.error('Count document votes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to count document votes',
      error: error.message
    });
  }
};