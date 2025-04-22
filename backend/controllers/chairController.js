// controllers/chairController.js
const chairModel = require('../models/chairModel');

const chairController = {
  // Get all chairs
  getAllChairs: async (req, res) => {
    try {
      const chairs = await chairModel.getAllChairs();
      res.status(200).json({ success: true, data: chairs });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get chair by ID
  getChairById: async (req, res) => {
    try {
      const chairId = req.params.id;
      const chair = await chairModel.getChairById(chairId);
      if (!chair) {
        return res.status(404).json({ success: false, message: 'Chair not found' });
      }
      res.status(200).json({ success: true, data: chair });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Assign committee to chair
  assignCommittee: async (req, res) => {
    try {
      const { chairId, committeeId } = req.body;
      const result = await chairModel.assignToCommittee(chairId, committeeId);
      res.status(200).json({ success: true, message: 'Committee assigned successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Assignment failed', error: error.message });
    }
  },

  // Provide feedback on position paper
  provideFeedback: async (req, res) => {
    try {
      const { paperId, feedback } = req.body;
      const result = await chairModel.provideFeedback(paperId, feedback);
      res.status(200).json({ success: true, message: 'Feedback provided successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to provide feedback', error: error.message });
    }
  },

  // Get position papers for a committee
  getCommitteePapers: async (req, res) => {
    try {
      const committeeId = req.params.committeeId;
      const papers = await chairModel.getCommitteePapers(committeeId);
      res.status(200).json({ success: true, data: papers });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

module.exports = chairController;