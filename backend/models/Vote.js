// models/Vote.js
const { sql, poolPromise } = require('../config/db');

class Vote {
  // Create a new vote
  static async create(voteData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('delegate_id', sql.Int, voteData.delegate_id);
      request.input('event_id', sql.Int, voteData.event_id || null);
      request.input('document_id', sql.Int, voteData.document_id || null);
      request.input('vote', sql.VarChar(10), voteData.vote);
      request.input('notes', sql.Text, voteData.notes || null);

      const result = await request.execute('sp_RecordVote');
      
      // After successful vote recording, retrieve the vote details
      // Since sp_RecordVote doesn't return the vote_id, we need to query for it
      if (voteData.event_id) {
        // Get the most recent vote by this delegate for this event
        const query = `
          SELECT TOP 1 * FROM Votes
          WHERE delegate_id = @delegate_id AND event_id = @event_id
          ORDER BY [timestamp] DESC
        `;
        const voteResult = await request.query(query);
        return voteResult.recordset[0];
      } else {
        // Get the most recent vote by this delegate for this document
        const query = `
          SELECT TOP 1 * FROM Votes
          WHERE delegate_id = @delegate_id AND document_id = @document_id
          ORDER BY [timestamp] DESC
        `;
        const voteResult = await request.query(query);
        return voteResult.recordset[0];
      }
    } catch (error) {
      throw error;
    }
  }

  // Get vote by ID
  static async getById(voteId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('vote_id', sql.Int, voteId);

      const result = await request.execute('sp_GetVoteById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update vote
  static async update(voteId, voteData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('vote_id', sql.Int, voteId);
      request.input('vote', sql.VarChar(10), voteData.vote);
      request.input('notes', sql.Text, voteData.notes || null);

      await request.execute('sp_UpdateVote');
      
      // Get the updated vote
      return await this.getById(voteId);
    } catch (error) {
      throw error;
    }
  }

  // Delete vote
  static async delete(voteId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('vote_id', sql.Int, voteId);

      await request.execute('sp_DeleteVote');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get votes by document
  static async getByDocument(documentId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('document_id', sql.Int, documentId);

      const result = await request.execute('sp_GetVotesByDocument');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Get votes by event
  static async getByEvent(eventId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('event_id', sql.Int, eventId);

      const result = await request.execute('sp_GetVotesByEvent');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Count votes for a document
  static async countVotesForDocument(documentId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('document_id', sql.Int, documentId);
      
      const result = await request.query(`
        SELECT 
          COUNT(CASE WHEN vote = 'for' THEN 1 END) as votes_for,
          COUNT(CASE WHEN vote = 'against' THEN 1 END) as votes_against,
          COUNT(CASE WHEN vote = 'abstain' THEN 1 END) as votes_abstain,
          COUNT(*) as total_votes
        FROM Votes
        WHERE document_id = @document_id
      `);
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if a delegate has voted for a document
  static async hasVoted(delegateId, documentId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('delegate_id', sql.Int, delegateId);
      request.input('document_id', sql.Int, documentId);
      
      const result = await request.query(`
        SELECT COUNT(*) as vote_count
        FROM Votes
        WHERE delegate_id = @delegate_id AND document_id = @document_id
      `);
      
      return result.recordset[0].vote_count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Vote;