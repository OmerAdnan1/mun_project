const DelegateAssignment = require('../models/DelegateAssignment');

// Assign delegate to committee
exports.assignDelegateToCommittee = async (req, res) => {
  try {
    const assignment = await DelegateAssignment.assignDelegateToCommittee(req.body);

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Assign delegate error:', error);

    // Handle specific errors
    if (error.message.includes('Delegate is already assigned') || 
        error.message.includes('Country is already assigned')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to assign delegate to committee',
      error: error.message
    });
  }
};

// Get delegate assignments
exports.getDelegateAssignments = async (req, res) => {
  try {
    const filters = {
      delegateId: req.query.delegateId ? parseInt(req.query.delegateId) : null,
      committeeId: req.query.committeeId ? parseInt(req.query.committeeId) : null,
      countryId: req.query.countryId ? parseInt(req.query.countryId) : null,
      conferenceYear: req.query.conferenceYear ? parseInt(req.query.conferenceYear) : null
    };

    const assignments = await DelegateAssignment.getAssignments(filters);

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve delegate assignments',
      error: error.message
    });
  }
};

// Get all assignments (for admin view)
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await DelegateAssignment.getAll();
    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error('Get all assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve all assignments',
      error: error.message
    });
  }
};

// Update delegate assignment
exports.updateDelegateAssignment = async (req, res) => {
  try {
    const assignment = await DelegateAssignment.updateAssignment(req.params.id, req.body);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Update assignment error:', error);

    // Handle specific errors
    if (error.message.includes('Country is already assigned')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update delegate assignment',
      error: error.message
    });
  }
};

// Remove delegate assignment
exports.removeDelegateAssignment = async (req, res) => {
  try {
    const result = await DelegateAssignment.removeAssignment(req.params.id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Remove assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove delegate assignment',
      error: error.message
    });
  }
};

// Assign delegate to block
exports.assignDelegateToBlock = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id);
    const { blockId } = req.body;

    if (!blockId) {
      return res.status(400).json({
        success: false,
        message: 'Block ID is required'
      });
    }

    const result = await DelegateAssignment.assignToBlock(assignmentId, blockId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Assign to block error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign delegate to block',
      error: error.message
    });
  }
};

// Allocate country to single delegate
exports.allocateCountryToSingleDelegate = async (req, res) => {
  try {
    const { delegateId, committeeId } = req.body;

    if (!delegateId || !committeeId) {
      return res.status(400).json({
        success: false,
        message: 'Delegate ID and Committee ID are required'
      });
    }

    const result = await DelegateAssignment.allocateCountryToSingleDelegate(delegateId, committeeId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Allocate country error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to allocate country to delegate',
      error: error.message
    });
  }
};

// Allocate countries by experience for an entire committee
exports.allocateCountriesByExperience = async (req, res) => {
  try {
    const committeeId = parseInt(req.params.committeeId);

    if (!committeeId) {
      return res.status(400).json({
        success: false,
        message: 'Committee ID is required'
      });
    }

    const results = await DelegateAssignment.allocateCountriesByExperience(committeeId);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Allocate countries by experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to allocate countries by experience',
      error: error.message
    });
  }
};