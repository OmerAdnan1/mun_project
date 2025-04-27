// models/Committee.js
const { sql, poolPromise } = require('../config/db');

class Committee {
  // Create a new committee
  static async create(committeeData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('name', sql.VarChar(100), committeeData.name);
      request.input('description', sql.Text, committeeData.description || null);
      request.input('topic', sql.VarChar(255), committeeData.topic || null);
      request.input('difficulty', sql.VarChar(15), committeeData.difficulty || 'intermediate');
      request.input('capacity', sql.Int, committeeData.capacity);
      request.input('location', sql.VarChar(100), committeeData.location || null);
      request.input('start_date', sql.Date, committeeData.start_date || null);
      request.input('end_date', sql.Date, committeeData.end_date || null);
      request.input('chair_id', sql.Int, committeeData.chair_id);
      request.output('committee_id', sql.Int);
      
      const result = await request.execute('sp_CreateCommittee');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Get committee by ID
  static async getById(committeeId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('committee_id', sql.Int, committeeId);
      
      const result = await request.execute('sp_GetCommitteeById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update committee
  static async update(committeeId, committeeData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('committee_id', sql.Int, committeeId);
      request.input('name', sql.VarChar(100), committeeData.name || null);
      request.input('description', sql.Text, committeeData.description || null);
      request.input('topic', sql.VarChar(255), committeeData.topic || null);
      request.input('difficulty', sql.VarChar(15), committeeData.difficulty || null);
      request.input('capacity', sql.Int, committeeData.capacity || null);
      request.input('location', sql.VarChar(100), committeeData.location || null);
      request.input('start_date', sql.Date, committeeData.start_date || null);
      request.input('end_date', sql.Date, committeeData.end_date || null);
      request.input('chair_id', sql.Int, committeeData.chair_id || null);
      
      const result = await request.execute('sp_UpdateCommittee');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete committee
  static async delete(committeeId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('committee_id', sql.Int, committeeId);
      
      await request.execute('sp_DeleteCommittee');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all committees
  static async getAll(filters = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('difficulty', sql.VarChar(15), filters.difficulty || null);
      request.input('chair_id', sql.Int, filters.chair_id || null);
      request.input('search_term', sql.VarChar(100), filters.search_term || null);
      
      const result = await request.execute('sp_GetAllCommittees');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Committee;