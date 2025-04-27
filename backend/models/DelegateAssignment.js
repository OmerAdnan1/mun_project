// models/DelegateAssignment.js
const { sql, poolPromise } = require('../config/db');

class DelegateAssignment {
  // Assign delegate to committee
  static async assignDelegateToCommittee(assignmentData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('DelegateId', sql.Int, assignmentData.delegateId);
      request.input('CommitteeId', sql.Int, assignmentData.committeeId);
      request.input('CountryId', sql.Int, assignmentData.countryId);
      request.input('BlockId', sql.Int, assignmentData.blockId || null);
      request.input('ConferenceYear', sql.Int, assignmentData.conferenceYear || null);

      const result = await request.execute('sp_AssignDelegateToCommittee');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Get delegate assignments
  static async getAssignments(filters = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('DelegateId', sql.Int, filters.delegateId || null);
      request.input('CommitteeId', sql.Int, filters.committeeId || null);
      request.input('CountryId', sql.Int, filters.countryId || null);
      request.input('ConferenceYear', sql.Int, filters.conferenceYear || null);

      const result = await request.execute('sp_GetDelegateAssignments');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Update delegate assignment
  static async updateAssignment(assignmentId, assignmentData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('AssignmentId', sql.Int, assignmentId);
      request.input('CommitteeId', sql.Int, assignmentData.committeeId || null);
      request.input('CountryId', sql.Int, assignmentData.countryId || null);
      request.input('BlockId', sql.Int, assignmentData.blockId || null);

      const result = await request.execute('sp_UpdateDelegateAssignment');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Remove delegate assignment
  static async removeAssignment(assignmentId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('AssignmentId', sql.Int, assignmentId);

      const result = await request.execute('sp_RemoveDelegateAssignment');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Assign delegate to block
  static async assignToBlock(assignmentId, blockId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('AssignmentId', sql.Int, assignmentId);
      request.input('BlockId', sql.Int, blockId);

      const result = await request.execute('sp_AssignDelegateToBlock');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Allocate country to single delegate
  static async allocateCountryToSingleDelegate(delegateId, committeeId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('DelegateId', sql.Int, delegateId);
      request.input('CommitteeId', sql.Int, committeeId);

      const result = await request.execute('dbo.AllocateCountryToSingleDelegate');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Allocate countries by experience for an entire committee
  static async allocateCountriesByExperience(committeeId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('CommitteeId', sql.Int, committeeId);

      const result = await request.execute('dbo.AllocateCountriesByExperience');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DelegateAssignment;