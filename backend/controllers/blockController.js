const Block = require('../models/Block');

// Create a new block
exports.createBlock = async (req, res) => {
  try {
    const block = await Block.create(req.body);
    
    res.status(201).json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error('Create block error:', error);
    
    // Handle specific errors
    if (error.message.includes('Committee does not exist')) {
      return res.status(400).json({
        success: false,
        message: 'Committee does not exist',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create block',
      error: error.message
    });
  }
};

// Get block by ID
exports.getBlockById = async (req, res) => {
  try {
    const block = await Block.getById(req.params.id);
    
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Block not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error('Get block error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve block',
      error: error.message
    });
  }
};

// Update block
exports.updateBlock = async (req, res) => {
  try {
    const block = await Block.update(req.params.id, req.body);
    
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Block not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error('Update block error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update block',
      error: error.message
    });
  }
};

// Delete block
exports.deleteBlock = async (req, res) => {
  try {
    await Block.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Block deleted successfully'
    });
  } catch (error) {
    console.error('Delete block error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete block',
      error: error.message
    });
  }
};

// Get blocks by committee
exports.getBlocksByCommittee = async (req, res) => {
  try {
    const blocks = await Block.getByCommittee(req.params.committeeId);
    
    res.status(200).json({
      success: true,
      count: blocks.length,
      data: blocks
    });
  } catch (error) {
    console.error('Get blocks by committee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blocks',
      error: error.message
    });
  }
};