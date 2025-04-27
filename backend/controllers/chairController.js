// controllers/chairController.js
const Chair = require('../models/Chair');

// Get chair details
exports.getChairById = async (req, res) => {
  try {
    const chair = await Chair.getById(req.params.id);
    
    if (!chair) {
      return res.status(404).json({
        success: false,
        message: 'Chair not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chair
    });
  } catch (error) {
    console.error('Get chair error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chair',
      error: error.message
    });
  }
};

// Update chair details
exports.updateChair = async (req, res) => {
  try {
    const chair = await Chair.update(req.params.id, req.body);
    
    if (!chair) {
      return res.status(404).json({
        success: false,
        message: 'Chair not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chair
    });
  } catch (error) {
    console.error('Update chair error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chair',
      error: error.message
    });
  }
};

// Delete chair
exports.deleteChair = async (req, res) => {
  try {
    const deleteUser = req.query.delete_user === 'true';
    await Chair.delete(req.params.id, deleteUser);
    
    res.status(200).json({
      success: true,
      message: deleteUser ? 'Chair and user deleted successfully' : 'Chair deleted successfully'
    });
  } catch (error) {
    console.error('Delete chair error:', error);
    
    // Handle specific error for chair assigned to committees
    if (error.message.includes('Cannot delete chair who is assigned to a committee')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete chair who is assigned to a committee',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete chair',
      error: error.message
    });
  }
};