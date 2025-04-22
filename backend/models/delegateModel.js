// models/delegateModel.js
const { sql, pool } = require('../config/db');

const delegateModel = {
  // Get all delegates with user info
  getAllDelegates: async () => {
    try {
      await pool.connect();
      const query = `
        SELECT d.*, u.UserName, u.Email, u.FullName, u.PhoneNumber, c.CountryName, b.BlockName
        FROM Delegate d
        JOIN [User] u ON d.UserId = u.UserId
        LEFT JOIN Country c ON d.CountryID = c.CountryID
        LEFT JOIN [Block] b ON d.BlockID = b.BlockId
      `;
      const result = await pool.request().query(query);
      return result.recordset;
    } catch (error) {
      console.error('Error getting all delegates:', error);
      throw error;
    }
  },

  // Get delegate by ID
  getDelegateById: async (delegateId) => {
    try {
      await pool.connect();
      const query = `
        SELECT d.*, u.UserName, u.Email, u.FullName, u.PhoneNumber, c.CountryName, b.BlockName
        FROM Delegate d
        JOIN [User] u ON d.UserId = u.UserId
        LEFT JOIN Country c ON d.CountryID = c.CountryID
        LEFT JOIN [Block] b ON d.BlockID = b.BlockId
        WHERE d.DelegateId = @delegateId
      `;
      const result = await pool.request()
        .input('delegateId', sql.Int, delegateId)
        .query(query);
      return result.recordset[0];
    } catch (error) {
      console.error('Error getting delegate by ID:', error);
      throw error;
    }
  },

  // Assign country to delegate
  assignCountry: async (delegateId, countryId) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('delegateId', sql.Int, delegateId)
        .input('countryId', sql.Int, countryId)
        .query('UPDATE Delegate SET CountryID = @countryId WHERE DelegateId = @delegateId');
      return result;
    } catch (error) {
      console.error('Error assigning country to delegate:', error);
      throw error;
    }
  },

  // Assign block to delegate
  assignBlock: async (delegateId, blockId) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('delegateId', sql.Int, delegateId)
        .input('blockId', sql.Int, blockId)
        .query('UPDATE Delegate SET BlockID = @blockId WHERE DelegateId = @delegateId');
      return result;
    } catch (error) {
      console.error('Error assigning block to delegate:', error);
      throw error;
    }
  },

  // Get delegates without country
  getDelegatesWithoutCountry: async () => {
    try {
      await pool.connect();
      const result = await pool.request().execute('GetDelegatesWithoutCountries');
      return result.recordset;
    } catch (error) {
      console.error('Error getting delegates without countries:', error);
      throw error;
    }
  },

  // Get delegates without committee
  getDelegatesWithoutCommittee: async () => {
    try {
      await pool.connect();
      const result = await pool.request().execute('IdentifyDelegatesWithoutCommittee');
      return result.recordset;
    } catch (error) {
      console.error('Error getting delegates without committee:', error);
      throw error;
    }
  },

  // Submit position paper
  submitPositionPaper: async (paperData) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('DelegateId', sql.Int, paperData.delegateId)
        .input('SubmissionDate', sql.DateTime, new Date(paperData.submissionDate))
        .input('DueDate', sql.DateTime, new Date(paperData.dueDate))
        .input('Status', sql.VarChar(20), paperData.status)
        .execute('SubmitPositionPaper');
      return result;
    } catch (error) {
      console.error('Error submitting position paper:', error);
      throw error;
    }
  },

  // Get leaderboard for all committees
  getOverallLeaderboard: async () => {
    try {
      await pool.connect();
      const result = await pool.request().execute('GetOverallLeaderboard');
      return result.recordset;
    } catch (error) {
      console.error('Error getting overall leaderboard:', error);
      throw error;
    }
  },

  // Get leaderboard for specific committee
  getCommitteeLeaderboard: async (committeeId) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('CommitteeId', sql.Int, committeeId)
        .execute('GetCommitteeLeaderboard');
      return result.recordset;
    } catch (error) {
      console.error('Error getting committee leaderboard:', error);
      throw error;
    }
  }
};

module.exports = delegateModel;