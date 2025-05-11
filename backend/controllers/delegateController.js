// controllers/delegateController.js
const Delegate = require('../models/Delegate');

// Get delegate details
exports.getDelegateById = async (req, res) => {
  try {
    const delegate = await Delegate.getById(req.params.id);
    
    if (!delegate) {
      return res.status(404).json({
        success: false,
        message: 'Delegate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: delegate
    });
  } catch (error) {
    console.error('Get delegate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve delegate',
      error: error.message
    });
  }
};

// Update delegate details
exports.updateDelegate = async (req, res) => {
  try {
    const delegate = await Delegate.update(req.params.id, req.body);
    
    if (!delegate) {
      return res.status(404).json({
        success: false,
        message: 'Delegate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: delegate
    });
  } catch (error) {
    console.error('Update delegate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update delegate',
      error: error.message
    });
  }
};

// Delete delegate
exports.deleteDelegate = async (req, res) => {
  try {
    const deleteUser = req.query.delete_user === 'true';
    await Delegate.delete(req.params.id, deleteUser);
    
    res.status(200).json({
      success: true,
      message: deleteUser ? 'Delegate and user deleted successfully' : 'Delegate deleted successfully'
    });
  } catch (error) {
    console.error('Delete delegate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete delegate',
      error: error.message
    });
  }
};

// Add past experience
exports.addPastExperience = async (req, res) => {
  try {
    const experience = await Delegate.addPastExperience(req.params.id, req.body);
    
    res.status(201).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add past experience',
      error: error.message
    });
  }
};

// Get past experiences
exports.getPastExperiences = async (req, res) => {
  try {
    const experiences = await Delegate.getPastExperiences(req.params.id);
    
    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve past experiences',
      error: error.message
    });
  }
};

// Get all delegates
exports.getAllDelegates = async (req, res) => {
  try {
    const delegates = await Delegate.getAll();
    res.status(200).json({
      success: true,
      data: delegates
    });
  } catch (error) {
    console.error('Get all delegates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve delegates',
      error: error.message
    });
  }
};