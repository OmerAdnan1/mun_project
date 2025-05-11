const Score = require('../models/Score');

// Record a new score
exports.recordScore = async (req, res) => {
  try {
    const score = await Score.record(req.body);

    res.status(201).json({
      success: true,
      data: score
    });
  } catch (error) {
    console.error('Record score error:', error);

    // Handle specific errors
    if (error.message.includes('Invalid category')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
        error: error.message
      });
    }

    if (error.message.includes('Points must be between')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid points value',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to record score',
      error: error.message
    });
  }
};

// Get score by ID
exports.getScoreById = async (req, res) => {
  try {
    const score = await Score.getById(req.params.id);

    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    res.status(200).json({
      success: true,
      data: score
    });
  } catch (error) {
    console.error('Get score error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve score',
      error: error.message
    });
  }
};

// Update score
exports.updateScore = async (req, res) => {
  try {
    const score = await Score.update(req.params.id, req.body);

    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    res.status(200).json({
      success: true,
      data: score
    });
  } catch (error) {
    console.error('Update score error:', error);

    // Handle specific errors
    if (error.message.includes('Points must be between')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid points value',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update score',
      error: error.message
    });
  }
};

// Delete score
exports.deleteScore = async (req, res) => {
  try {
    await Score.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Score deleted successfully'
    });
  } catch (error) {
    console.error('Delete score error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete score',
      error: error.message
    });
  }
};

// Get all scores by delegate
exports.getScoresByDelegate = async (req, res) => {
  try {
    const scores = await Score.getByDelegate(parseInt(req.params.id));

    res.status(200).json({
      success: true,
      count: scores.length,
      data: scores
    });
  } catch (error) {
    console.error('Get scores by delegate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve scores',
      error: error.message
    });
  }
};

// Get scores by committee
exports.getScoresByCommittee = async (req, res) => {
  try {
    const scores = await Score.getByCommittee(req.params.id);

    res.status(200).json({
      success: true,
      count: scores.length,
      data: scores
    });
  } catch (error) {
    console.error('Get scores by committee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve scores',
      error: error.message
    });
  }
};