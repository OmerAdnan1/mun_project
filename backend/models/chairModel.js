// models/chairModel.js
const { sql, pool } = require('../config/db');

class Chair {
  // Get chair by ID
  static async getChairById(chairId) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('ChairId', sql.Int, chairId)
        .query('SELECT c.*, u.UserName, u.Email, u.FullName FROM Chair c JOIN [User] u ON c.UserId = u.UserId WHERE c.ChairId = @ChairId');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in getChairById:', error);
      throw error;
    }
  }

  // Get chair by user ID
  static async getChairByUserId(userId) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('UserId', sql.Int, userId)
        .query('SELECT c.*, co.Name as CommitteeName, co.Topic FROM Chair c LEFT JOIN Committee co ON c.CommitteeId = co.CommitteeId WHERE c.UserId = @UserId');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in getChairByUserId:', error);
      throw error;
    }
  }

  // Get all chairs
  static async getAllChairs() {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .query(`
          SELECT c.*, u.UserName, u.Email, u.FullName, co.Name as CommitteeName 
          FROM Chair c 
          JOIN [User] u ON c.UserId = u.UserId 
          LEFT JOIN Committee co ON c.CommitteeId = co.CommitteeId
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in getAllChairs:', error);
      throw error;
    }
  }

  // Assign chair to committee
  static async assignToCommittee(chairId, committeeId) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('ChairId', sql.Int, chairId)
        .input('CommitteeId', sql.Int, committeeId)
        .query('UPDATE Chair SET CommitteeId = @CommitteeId WHERE ChairId = @ChairId');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in assignToCommittee:', error);
      throw error;
    }
  }

  // Unassign chair from committee
  static async unassignFromCommittee(chairId) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('ChairId', sql.Int, chairId)
        .query('UPDATE Chair SET CommitteeId = NULL WHERE ChairId = @ChairId');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in unassignFromCommittee:', error);
      throw error;
    }
  }
}

module.exports = Chair;