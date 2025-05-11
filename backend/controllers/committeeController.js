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
    console.log('Getting committee by ID:', req.params.id);
    const result = await Committee.getDetailsWithDelegates(req.params.id);
    console.log('Committee details result:', result);
    
    if (!result.success || !result.data.committee) {
      console.log('Committee not found or error in result');
      return res.status(404).json({
        success: false,
        message: 'Committee not found'
      });
    }
    
    console.log('Sending response with committee data');
    res.status(200).json(result);
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

// Get committees by chair ID
exports.getCommitteesByChair = async (req, res) => {
  try {
    console.log('Received request for chair ID:', req.params.chairId);
    const { chairId } = req.params;
    console.log('Parsed chair ID:', chairId);
    
    const committees = await Committee.getByChairId(parseInt(chairId));
    console.log('Retrieved committees:', committees);
    
    res.status(200).json({
      success: true,
      count: committees.length,
      data: committees
    });
  } catch (error) {
    console.error('Get committees by chair error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve committees',
      error: error.message
    });
  }
};

// Get all committees
exports.getCommittees = async (req, res) => {
  try {
    const filters = {
      difficulty: req.query.difficulty || null,
      search_term: req.query.search_term || null,
      chair_id: req.query.chair_id || null, // Add chair_id if needed
    };

    console.log('Filters received in getCommittees:', filters); // Debug log

    const committees = await Committee.getAll(filters);

    console.log('Retrieved committees:', committees); // Debug log

    res.status(200).json({
      success: true,
      count: committees.length,
      data: committees,
    });
  } catch (error) {
    console.error('Get committees error:', error); // Debug log
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve committees',
      error: error.message,
    });
  }
};

// Get full committee overview (details, delegates, scores, attendance, documents)
exports.getCommitteeOverview = async (req, res) => {
  try {
    const result = await Committee.getFullOverview(req.params.id);
    if (!result.success || !result.data.committee) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found'
      });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Get committee overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve committee overview',
      error: error.message
    });
  }
};