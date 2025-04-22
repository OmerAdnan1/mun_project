// controllers/delegateController.js
const delegateModel = require('../models/delegateModel');

const delegateController = {
  // Get all delegates
  getAllDelegates: async (req, res) => {
    try {
      const delegates = await delegateModel.getAllDelegates();
      res.status(200).json({ success: true, data: delegates });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get delegate by ID
  getDelegateById: async (req, res) => {
    try {
      const delegateId = req.params.id;
      const delegate = await delegateModel.getDelegateById(delegateId);
      if (!delegate) {
        return res.status(404).json({ success: false, message: 'Delegate not found' });
      }
      res.status(200).json({ success: true, data: delegate });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Assign country to delegate
  assignCountry: async (req, res) => {
    try {
      const { delegateId, countryId } = req.body;
      const result = await delegateModel.assignCountry(delegateId, countryId);
      res.status(200).json({ success: true, message: 'Country assigned successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Assignment failed', error: error.message });
    }
  },

  // Assign block to delegate
  assignBlock: async (req, res) => {
    try {
      const { delegateId, blockId } = req.body;
      const result = await delegateModel.assignBlock(delegateId, blockId);
      res.status(200).json({ success: true, message: 'Block assigned successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Assignment failed', error: error.message });
    }
  },

  // Get delegates without country
  getDelegatesWithoutCountry: async (req, res) => {
    try {
      const delegates = await delegateModel.getDelegatesWithoutCountry();
      res.status(200).json({ success: true, data: delegates });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get delegates without committee
  getDelegatesWithoutCommittee: async (req, res) => {
    try {
      const delegates = await delegateModel.getDelegatesWithoutCommittee();
      res.status(200).json({ success: true, data: delegates });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Submit position paper
  submitPositionPaper: async (req, res) => {
    try {
      const result = await delegateModel.submitPositionPaper(req.body);
      res.status(201).json({ success: true, message: 'Position paper submitted successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Submission failed', error: error.message });
    }
  },

  // Get overall leaderboard
  getOverallLeaderboard: async (req, res) => {
    try {
      const leaderboard = await delegateModel.getOverallLeaderboard();
      res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get committee leaderboard
  getCommitteeLeaderboard: async (req, res) => {
    try {
      const committeeId = req.params.committeeId;
      const leaderboard = await delegateModel.getCommitteeLeaderboard(committeeId);
      res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

module.exports = delegateController;