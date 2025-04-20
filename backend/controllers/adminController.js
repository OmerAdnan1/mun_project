// controllers/adminController.js
const Admin = require('../models/adminModel');

exports.getAdminById = async (req, res) => {
  try {
    const adminId = parseInt(req.params.id);
    const admin = await Admin.getAdminById(adminId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error in getAdminById controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAdminByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const admin = await Admin.getAdminByUserId(userId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found for this user' });
    }
    
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error in getAdminByUserId controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error in getAllAdmins controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateResponsibilities = async (req, res) => {
  try {
    const adminId = parseInt(req.params.id);
    const { responsibilities } = req.body;
    
    if (!responsibilities) {
      return res.status(400).json({ message: 'Responsibilities are required' });
    }
    
    const result = await Admin.updateResponsibilities(adminId, responsibilities);
    
    if (result) {
      res.status(200).json({ message: 'Admin responsibilities updated successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found or update failed' });
    }
  } catch (error) {
    console.error('Error in updateResponsibilities controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { userId, responsibilities } = req.body;
    
    if (!userId || !responsibilities) {
      return res.status(400).json({ message: 'User ID and responsibilities are required' });
    }
    
    const adminId = await Admin.createAdmin(userId, responsibilities);
    
    if (adminId) {
      res.status(201).json({ 
        message: 'Admin created successfully', 
        adminId 
      });
    } else {
      res.status(400).json({ message: 'Failed to create admin' });
    }
  } catch (error) {
    console.error('Error in createAdmin controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = parseInt(req.params.id);
    const result = await Admin.deleteAdmin(adminId);
    
    if (result) {
      res.status(200).json({ message: 'Admin deleted successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found or deletion failed' });
    }
  } catch (error) {
    console.error('Error in deleteAdmin controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dashboard data for admin
exports.getDashboardData = async (req, res) => {
  try {
    // This would be a comprehensive query that gathers summary data
    // For now, we'll mock this with some placeholder data
    const dashboardData = {
      totalDelegates: 120,
      totalChairs: 15,
      totalCommittees: 8,
      upcomingSessions: 4,
      pendingResolutions: 7,
      pendingMotions: 12,
      recentActivity: [
        { type: 'Resolution', status: 'Passed', time: '2023-04-19T15:30:00Z' },
        { type: 'Motion', status: 'Pending', time: '2023-04-19T14:15:00Z' },
        { type: 'Session', status: 'Scheduled', time: '2023-04-20T09:00:00Z' }
      ]
    };
    
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error in getDashboardData controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};