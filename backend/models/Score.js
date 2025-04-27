const { sql, poolPromise } = require('../config/db');

class Score {
  // Record a score
  static async record(scoreData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('delegate_id', sql.Int, scoreData.delegate_id);
      request.input('category', sql.VarChar(20), scoreData.category);
      request.input('points', sql.Decimal(5, 2), scoreData.points);
      request.input('chair_id', sql.Int, scoreData.chair_id);
      request.input('event_id', sql.Int, scoreData.event_id || null);
      request.input('document_id', sql.Int, scoreData.document_id || null);
      request.input('comments', sql.Text, scoreData.comments || null);

      await request.execute('sp_RecordScore');
      
      // Get the inserted score (returning the last inserted score for this delegate)
      const result = await pool.request()
        .input('delegate_id', sql.Int, scoreData.delegate_id)
        .execute('sp_GetScoresByDelegate');
      
      return result.recordset[0]; // Return the first record which should be the most recent
    } catch (error) {
      throw error;
    }
  }

  // Get score by ID
  static async getById(scoreId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('score_id', sql.Int, scoreId);

      const result = await request.execute('sp_GetScoreById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update score
  static async update(scoreId, scoreData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('score_id', sql.Int, scoreId);
      request.input('points', sql.Decimal(5, 2), scoreData.points);
      request.input('comments', sql.Text, scoreData.comments || null);

      await request.execute('sp_UpdateScore');
      
      // Get the updated score
      return await this.getById(scoreId);
    } catch (error) {
      throw error;
    }
  }

  // Delete score
  static async delete(scoreId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('score_id', sql.Int, scoreId);

      await request.execute('sp_DeleteScore');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get scores by delegate
  static async getByDelegate(delegateId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('delegate_id', sql.Int, delegateId);

      const result = await request.execute('sp_GetScoresByDelegate');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Get scores by committee
  static async getByCommittee(committeeId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('committee_id', sql.Int, committeeId);

      const result = await request.execute('sp_GetScoresByCommittee');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Score;