// controllers/chairController.js
const Chair = require('../models/chairModel');

exports.getChairById = async (req, res) => {
  try {
    const chairId = parseInt(req.params.id);
    const chair = await Chair.getChairById(chairId);
    
    if (!chair) {
      return res.status(404).json({ message: 'Chair not found' });
    }
    
    res.status(200).json(chair);
  } catch (error) {
    console.error('Error in getChairById controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getChairByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const chair = await Chair.getChairByUserId(userId);
    
    if (!chair) {
      return res.status(404).json({ message: 'Chair not found for this user' });
    }
    
    res.status(200).json(chair);
  } catch (error) {
    console.error('Error in getChairByUserId controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllChairs = async (req, res) => {
  try {
    const chairs = await Chair.getAllChairs();
    res.status(200).json(chairs);
  } catch (error) {
    console.error('Error in getAllChairs controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.assignToCommittee = async (req, res) => {
  try {
    const { chairId, committeeId } = req.body;
    
    if (!chairId || !committeeId) {
      return res.status(400).json({ message: 'Chair ID and Committee ID are required' });
    }
    
    const result = await Chair.assignToCommittee(chairId, committeeId);
    
    if (result) {
      res.status(200).json({ message: 'Chair assigned to committee successfully' });
    } else {
      res.status(404).json({ message: 'Chair not found or assignment failed' });
    }
  } catch (error) {
    console.error('Error in assignToCommittee controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.unassignFromCommittee = async (req, res) => {
  try {
    const chairId = parseInt(req.params.id);
    const result = await Chair.unassignFromCommittee(chairId);
    
    if (result) {
      res.status(200).json({ message: 'Chair unassigned from committee successfully' });
    } else {
      res.status(404).json({ message: 'Chair not found or unassignment failed' });
    }
  } catch (error) {
    console.error('Error in unassignFromCommittee controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};