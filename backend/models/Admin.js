const { sql, poolPromise } = require('../config/db');

class Admin {
  // Get admin by ID
  static async getById(userId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, userId);

      const result = await request.execute('sp_GetAdminById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update admin
  static async update(userId, adminData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, userId);
      request.input('admin_level', sql.VarChar(15), adminData.admin_level || null);
      request.input('contact_number', sql.VarChar(20), adminData.contact_number || null);

      await request.execute('sp_UpdateAdmin');
      
      // Return the updated admin
      return this.getById(userId);
    } catch (error) {
      throw error;
    }
  }

  // Delete admin
  static async delete(userId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, userId);

      await request.execute('sp_DeleteAdmin');
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async assignChairToCommittee(chairId, committeeId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('chair_id', sql.Int, chairId);
      request.input('committee_id', sql.Int, committeeId);

      const result = await request.execute('sp_AssignChairToCommittee');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Calculate overall scores
  static async calculateOverallScores(committeeId = null) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      if (committeeId) {
        request.input('committee_id', sql.Int, committeeId);
      }

      const result = await request.execute('sp_CalculateOverallScores');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Generate awards
  static async generateAwards(committeeId, topDelegates = 3) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('committee_id', sql.Int, committeeId);
      request.input('top_delegates', sql.Int, topDelegates);

      const result = await request.execute('sp_GenerateAwards');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Change document status
  static async changeDocumentStatus(documentId, newStatus) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('document_id', sql.Int, documentId);
      request.input('new_status', sql.VarChar(10), newStatus);

      const result = await request.execute('sp_ChangeDocumentStatus');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Change event status
  static async changeEventStatus(eventId, newStatus) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('event_id', sql.Int, eventId);
      request.input('new_status', sql.VarChar(10), newStatus);

      const result = await request.execute('sp_ChangeEventStatus');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async getDashboardCounts() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute('sp_GetAdminDashboardCounts');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

}

module.exports = Admin;