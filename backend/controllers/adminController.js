const Admin = require('../models/Admin');

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.getById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin',
      error: error.message
    });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.update(req.params.id, req.body);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Update admin error:', error);

    // Handle specific errors
    if (error.message.includes('Invalid admin level')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin level. Must be basic, intermediate, or advanced',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update admin',
      error: error.message
    });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    await Admin.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin',
      error: error.message
    });
  }
};

// Assign chair to committee
exports.assignChairToCommittee = async (req, res) => {
    try {
      const { chairId, committeeId } = req.body;
  
      if (!chairId || !committeeId) {
        return res.status(400).json({
          success: false,
          message: 'Chair ID and Committee ID are required'
        });
      }
  
      const result = await Admin.assignChairToCommittee(chairId, committeeId);
  
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Assign chair error:', error);
  
      if (error.message.includes('not a chair') || error.message.includes('Committee not found')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
  
      res.status(500).json({
        success: false,
        message: 'Failed to assign chair to committee',
        error: error.message
      });
    }
  };
  
  // Calculate overall scores
  exports.calculateOverallScores = async (req, res) => {
    try {
      const { committeeId } = req.body;
      
      const scores = await Admin.calculateOverallScores(committeeId || null);
  
      res.status(200).json({
        success: true,
        count: scores.length,
        data: scores
      });
    } catch (error) {
      console.error('Calculate scores error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate overall scores',
        error: error.message
      });
    }
  };
  
  // Generate awards
  exports.generateAwards = async (req, res) => {
    try {
      const { committeeId, topDelegates } = req.body;
  
      if (!committeeId) {
        return res.status(400).json({
          success: false,
          message: 'Committee ID is required'
        });
      }
  
      const awards = await Admin.generateAwards(committeeId, topDelegates || 3);
  
      res.status(200).json({
        success: true,
        count: awards.length,
        data: awards
      });
    } catch (error) {
      console.error('Generate awards error:', error);
  
      if (error.message.includes('Committee not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
  
      res.status(500).json({
        success: false,
        message: 'Failed to generate awards',
        error: error.message
      });
    }
  };
  
  // Change document status
  exports.changeDocumentStatus = async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const { newStatus } = req.body;
  
      if (!newStatus) {
        return res.status(400).json({
          success: false,
          message: 'New status is required'
        });
      }
  
      const result = await Admin.changeDocumentStatus(documentId, newStatus);
  
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Change document status error:', error);
  
      if (error.message.includes('Invalid status') || error.message.includes('Document not found')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
  
      res.status(500).json({
        success: false,
        message: 'Failed to change document status',
        error: error.message
      });
    }
  };
  
  // Change event status
  exports.changeEventStatus = async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const { newStatus } = req.body;
  
      if (!newStatus) {
        return res.status(400).json({
          success: false,
          message: 'New status is required'
        });
      }
  
      const result = await Admin.changeEventStatus(eventId, newStatus);
  
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Change event status error:', error);
  
      if (error.message.includes('Invalid status') || error.message.includes('Event not found')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
  
      res.status(500).json({
        success: false,
        message: 'Failed to change event status',
        error: error.message
      });
    }
  };