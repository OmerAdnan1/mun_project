const { sql, pool } = require('../config/db');

class NotificationModel {
  async createNotification(notificationData, recipientIds) {
    try {
      const poolConnection = await pool.connect();
      
      // Join recipientIds array into comma-separated string
      const recipientIdsString = recipientIds.join(',');
      
      const result = await poolConnection.request()
        .input('Title', sql.VarChar(100), notificationData.title)
        .input('Content', sql.VarChar(sql.MAX), notificationData.content)
        .input('Category', sql.VarChar(50), notificationData.category)
        .input('ScheduledTime', sql.DateTime, notificationData.scheduledTime || null)
        .input('RecipientIds', sql.NVarChar(sql.MAX), recipientIdsString)
        .execute('SendNotification');
      
      poolConnection.release();
      return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
      console.error('Error in createNotification model:', error);
      return { success: false, message: error.message };
    }
  }

  async getNotificationsByUser(userId) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('UserId', sql.Int, userId)
        .query(`
          SELECT n.NotificationId, n.Title, n.Content, n.SentDate, n.Category, n.ScheduledTime
          FROM Notification n
          JOIN NotificationRecipients nr ON n.NotificationId = nr.NotificationId
          WHERE nr.UserId = @UserId
          ORDER BY n.SentDate DESC
        `);
      
      poolConnection.release();
      return { success: true, notifications: result.recordset };
    } catch (error) {
      console.error('Error in getNotificationsByUser model:', error);
      return { success: false, message: error.message };
    }
  }

  async getNotificationById(notificationId) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('NotificationId', sql.Int, notificationId)
        .query(`
          SELECT n.*, 
            (SELECT STRING_AGG(u.UserId, ',') 
            FROM NotificationRecipients nr 
            JOIN [User] u ON nr.UserId = u.UserId 
            WHERE nr.NotificationId = n.NotificationId) AS Recipients
          FROM Notification n
          WHERE n.NotificationId = @NotificationId
        `);
      
      poolConnection.release();
      
      if (result.recordset.length > 0) {
        return { success: true, notification: result.recordset[0] };
      } else {
        return { success: false, message: 'Notification not found' };
      }
    } catch (error) {
      console.error('Error in getNotificationById model:', error);
      return { success: false, message: error.message };
    }
  }

  async deleteNotification(notificationId) {
    try {
      const poolConnection = await pool.connect();
      
      // First delete from NotificationRecipients
      await poolConnection.request()
        .input('NotificationId', sql.Int, notificationId)
        .query('DELETE FROM NotificationRecipients WHERE NotificationId = @NotificationId');
      
      // Then delete from Notification
      const result = await poolConnection.request()
        .input('NotificationId', sql.Int, notificationId)
        .query('DELETE FROM Notification WHERE NotificationId = @NotificationId');
      
      poolConnection.release();
      
      if (result.rowsAffected[0] > 0) {
        return { success: true, message: 'Notification deleted successfully' };
      } else {
        return { success: false, message: 'Notification not found' };
      }
    } catch (error) {
      console.error('Error in deleteNotification model:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new NotificationModel();