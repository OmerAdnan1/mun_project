// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get all admins
router.get('/', adminController.getAllAdmins);

// Get admin by ID
router.get('/:id', adminController.getAdminById);

// Get admin by user ID
router.get('/user/:userId', adminController.getAdminByUserId);

// Update admin responsibilities
router.put('/:id/responsibilities', adminController.updateResponsibilities);

// Create new admin (promote user to admin)
router.post('/', adminController.createAdmin);

// Delete admin (demote admin to regular user)
router.delete('/:id', adminController.deleteAdmin);

// Get admin dashboard data
router.get('/dashboard/summary', adminController.getDashboardData);

module.exports = router;