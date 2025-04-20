const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create a new notification
router.post('/', notificationController.createNotification);

// Get notifications for a specific user
router.get('/user/:userId', notificationController.getNotificationsByUser);

// Get a specific notification by ID
router.get('/:notificationId', notificationController.getNotificationById);

// Delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;