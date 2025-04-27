const { sql, poolPromise } = require('../config/db');

class Block {
  // Create a new block
  static async create(blockData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('committee_id', sql.Int, blockData.committee_id);
      request.input('name', sql.VarChar(100), blockData.name);
      request.input('stance', sql.Text, blockData.stance || null);
      request.output('block_id', sql.Int);
      
      const result = await request.execute('sp_CreateBlock');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Get block by ID
  static async getById(blockId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('block_id', sql.Int, blockId);
      
      const result = await request.execute('sp_GetBlockById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update block
  static async update(blockId, blockData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('block_id', sql.Int, blockId);
      request.input('name', sql.VarChar(100), blockData.name || null);
      request.input('stance', sql.Text, blockData.stance || null);
      
      const result = await request.execute('sp_UpdateBlock');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete block
  static async delete(blockId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('block_id', sql.Int, blockId);
      
      await request.execute('sp_DeleteBlock');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get blocks by committee
  static async getByCommittee(committeeId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('committee_id', sql.Int, committeeId);
      
      const result = await request.execute('sp_GetBlocksByCommittee');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Block;