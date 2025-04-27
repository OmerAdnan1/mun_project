const { sql, poolPromise } = require('../config/db');

class Chair {
  // Get chair by ID
  static async getById(userId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, userId);

      const result = await request.execute('sp_GetChairById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update chair
  static async update(userId, chairData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, userId);
      request.input('evaluation_metrics', sql.Text, chairData.evaluation_metrics || null);
      request.input('chairing_experience', sql.Text, chairData.chairing_experience || null);

      await request.execute('sp_UpdateChair');
      
      // Return the updated chair
      return this.getById(userId);
    } catch (error) {
      throw error;
    }
  }

  // Delete chair
  static async delete(userId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, userId);

      await request.execute('sp_DeleteChair');
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Chair;