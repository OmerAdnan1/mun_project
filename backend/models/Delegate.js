// models/Delegate.js
const { sql, poolPromise } = require('../config/db');

class Delegate {
  // Get delegate by ID
  static async getById(delegateId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('delegate_id', sql.Int, delegateId);
      
      const result = await request.execute('sp_GetDelegateById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all delegates
  static async getAll() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT d.user_id, u.full_name, u.email FROM Delegates d JOIN Users u ON d.user_id = u.user_id');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Update delegate details
  static async update(delegateId, delegateData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('delegate_id', sql.Int, delegateId);
      request.input('experience_level', sql.VarChar(15), delegateData.experience_level || null);
      request.input('emergency_contact', sql.VarChar(100), delegateData.emergency_contact || null);
      
      const result = await request.execute('sp_UpdateDelegate');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete delegate
  static async delete(delegateId, deleteUser = true) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('delegate_id', sql.Int, delegateId);
      request.input('delete_user', sql.Bit, deleteUser ? 1 : 0);
      
      await request.execute('sp_DeleteDelegate');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Add past experience
  static async addPastExperience(delegateId, experienceData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('user_id', sql.Int, delegateId);
      request.input('conference_name', sql.VarChar(100), experienceData.conference_name);
      request.input('committee', sql.VarChar(100), experienceData.committee || null);
      request.input('country', sql.VarChar(100), experienceData.country || null);
      request.input('year', sql.Int, experienceData.year || null);
      request.input('awards', sql.VarChar(20), experienceData.awards || null);
      request.input('description', sql.Text, experienceData.description || null);
      request.output('experience_id', sql.Int);
      
      const result = await request.execute('sp_AddPastExperience');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Get delegate past experiences
  static async getPastExperiences(delegateId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('delegate_id', sql.Int, delegateId);
      
      const result = await request.execute('sp_GetDelegatePastExperiences');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Delegate;