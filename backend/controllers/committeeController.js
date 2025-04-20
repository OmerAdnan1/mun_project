const Committee = require('../models/committeeModel');

exports.getAllCommittees = async (req, res) => {
  try {
    const committees = await Committee.getAllCommittees();
    res.json(committees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommitteeById = async (req, res) => {
  try {
    const committeeId = req.params.id;
    const committee = await Committee.getCommitteeById(committeeId);
    
    if (!committee) {
      return res.status(404).json({ message: 'Committee not found' });
    }
    
    res.json(committee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCommittee = async (req, res) => {
  try {
    const { name, topic } = req.body;
    
    if (!name || !topic) {
      return res.status(400).json({ message: 'Name and topic are required' });
    }
    
    const result = await Committee.createCommittee(name, topic);
    res.status(201).json({ 
      message: 'Committee created successfully',
      committeeId: result.CommitteeId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCommittee = async (req, res) => {
  try {
    const committeeId = req.params.id;
    const { name, topic } = req.body;
    
    if (!name || !topic) {
      return res.status(400).json({ message: 'Name and topic are required' });
    }
    
    const result = await Committee.updateCommittee(committeeId, name, topic);
    res.json({ 
      message: 'Committee updated successfully',
      committee: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCommittee = async (req, res) => {
  try {
    const committeeId = req.params.id;
    await Committee.deleteCommittee(committeeId);
    
    res.json({ message: 'Committee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignChair = async (req, res) => {
  try {
    const { committeeId, chairId } = req.body;
    
    if (!committeeId || !chairId) {
      return res.status(400).json({ message: 'Committee ID and Chair ID are required' });
    }
    
    const result = await Committee.assignChair(committeeId, chairId);
    res.json({ 
      message: 'Chair assigned to committee successfully',
      assignment: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};