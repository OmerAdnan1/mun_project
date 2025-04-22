// controllers/userController.js
const userModel = require('../models/userModel');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Register user
  registerUser: async (req, res) => {
    try {
      const result = await userModel.registerUser(req.body);
      res.status(201).json({ success: true, message: 'User registered successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
  },

  // Login user
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await userModel.loginUser(email, password);
      
      // Check for successful login
      if (result.recordset && result.recordset.length > 0) {
        res.status(200).json({ success: true, message: 'Login successful', data: result.recordset[0] });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await userModel.updateUser(userId, req.body);
      res.status(200).json({ success: true, message: 'User updated successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await userModel.deleteUser(userId);
      res.status(200).json({ success: true, message: 'User deleted successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
    }
  }
};

module.exports = userController;