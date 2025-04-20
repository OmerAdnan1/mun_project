const notificationModel = require('../models/notificationModel');

class NotificationController {
  async createNotification(req, res) {
    try {
      const { title, content, category, scheduledTime, recipientIds } = req.body;
      
      // Validate required fields
      if (!title || !content || !category || !recipientIds || !Array.isArray(recipientIds)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide all required fields'
        });
      }
      
      // Validate category
      const validCategories = ['System Updates', 'Event Changes', 'Reminders'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Category must be one of: System Updates, Event Changes, Reminders'
        });
      }
      
      // Call model to create notification
      const result = await notificationModel.createNotification(
        { title, content, category, scheduledTime }, 
        recipientIds
      );
      
      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in createNotification controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getNotificationsByUser(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
      }
      
      const result = await notificationModel.getNotificationsByUser(userId);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in getNotificationsByUser controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getNotificationById(req, res) {
    try {
      const notificationId = parseInt(req.params.notificationId);
      
      if (isNaN(notificationId)) {
        return res.status(400).json({ success: false, message: 'Invalid notification ID' });
      }
      
      const result = await notificationModel.getNotificationById(notificationId);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in getNotificationById controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async deleteNotification(req, res) {
    try {
      const notificationId = parseInt(req.params.notificationId);
      
      if (isNaN(notificationId)) {
        return res.status(400).json({ success: false, message: 'Invalid notification ID' });
      }
      
      const result = await notificationModel.deleteNotification(notificationId);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in deleteNotification controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new NotificationController();