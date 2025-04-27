// controllers/committeeController.js
const Committee = require('../models/Committee');

// Create a new committee
exports.createCommittee = async (req, res) => {
  try {
    const committee = await Committee.create(req.body);
    
    res.status(201).json({
      success: true,
      data: committee
    });
  } catch (error) {
    console.error('Create committee error:', error);
    
    // Handle specific errors
    if (error.message.includes('Chair does not exist')) {
      return res.status(400).json({
        success: false,
        message: 'Chair does not exist',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create committee',
      error: error.message
    });
  }
};

// Get committee by ID
exports.getCommitteeById = async (req, res) => {
  try {
    const committee = await Committee.getById(req.params.id);
    
    if (!committee) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: committee
    });
  } catch (error) {
    console.error('Get committee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve committee',
      error: error.message
    });
  }
};

// Update committee
exports.updateCommittee = async (req, res) => {
  try {
    const committee = await Committee.update(req.params.id, req.body);
    
    if (!committee) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: committee
    });
  } catch (error) {
    console.error('Update committee error:', error);
    
    // Handle specific errors
    if (error.message.includes('Chair does not exist')) {
      return res.status(400).json({
        success: false,
        message: 'Chair does not exist',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update committee',
      error: error.message
    });
  }
};

// Delete committee
exports.deleteCommittee = async (req, res) => {
  try {
    await Committee.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Committee deleted successfully'
    });
  } catch (error) {
    console.error('Delete committee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete committee',
      error: error.message
    });
  }
};

// Get all committees
exports.getCommittees = async (req, res) => {
  try {
    const filters = {
      difficulty: req.query.difficulty,
      chair_id: req.query.chair_id ? parseInt(req.query.chair_id) : null,
      search_term: req.query.search_term
    };
    
    const committees = await Committee.getAll(filters);
    
    res.status(200).json({
      success: true,
      count: committees.length,
      data: committees
    });
  } catch (error) {
    console.error('Get committees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve committees',
      error: error.message
    });
  }
};