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

  // Get committee by ID with delegates
  static async getDetailsWithDelegates(committeeId) {
    try {
      console.log('Fetching committee details for ID:', committeeId);
      const pool = await poolPromise;
      const request = pool.request();
      request.input('committee_id', sql.Int, committeeId);
      
      console.log('Executing sp_GetCommitteeDetailsWithDelegates...');
      const result = await request.execute('sp_GetCommitteeDetailsWithDelegates');
      
      console.log('Committee data:', result.recordsets[0][0]);
      console.log('Delegates data:', result.recordsets[1]);
      
      // First recordset contains committee info, second contains delegates
      const committee = result.recordsets[0][0];
      const delegates = result.recordsets[1];
      
      if (!committee) {
        console.log('No committee found for ID:', committeeId);
        return {
          success: false,
          message: 'Committee not found'
        };
      }
      
      return {
        success: true,
        data: {
          committee,
          delegates
        }
      };
    } catch (error) {
      console.error('Error in getDetailsWithDelegates:', error);
      throw error;
    }
  }

  // Get committee by ID with all related data (delegates, scores, attendance, documents)
  static async getFullOverview(committeeId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      request.input('committee_id', sql.Int, committeeId);
      // Call the new stored procedure that returns all result sets
      const result = await request.execute('sp_GetCommitteeFullOverview');
      const committee = result.recordsets[0][0];
      const delegates = result.recordsets[1];
      const scores = result.recordsets[2];
      const attendance = result.recordsets[3];
      const documents = result.recordsets[4];
      if (!committee) {
        return { success: false, message: 'Committee not found' };
      }
      return {
        success: true,
        data: {
          committee,
          delegates,
          scores,
          attendance,
          documents,
        },
      };
    } catch (error) {
      console.error('Error in getFullOverview:', error);
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
      const pool = await poolPromise; // Ensure poolPromise is correctly imported
      const request = pool.request();

      // Add filters as input parameters, defaulting to null
      request.input('difficulty', sql.VarChar(15), filters.difficulty || null);
      request.input('chair_id', sql.Int, filters.chair_id || null);
      request.input('search_term', sql.VarChar(100), filters.search_term || null);

      console.log('Executing sp_GetAllCommittees with filters:', filters); // Debug log

      // Execute the stored procedure
      const result = await request.execute('sp_GetAllCommittees');
      console.log('Result from sp_GetAllCommittees:', result.recordset); // Debug log

      return result.recordset;
    } catch (error) {
      console.error('Error in Committee.getAll:', error); // Debug log
      throw error;
    }
  }

  // Get committees by chair ID
  static async getByChairId(chairId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('chair_id', sql.Int, chairId);
      
      const result = await request.execute('sp_GetCommitteesByChair');
      return result.recordset;
    } catch (error) {
      console.error('Error in getByChairId:', error);
      throw error;
    }
  }
}

module.exports = Committee;