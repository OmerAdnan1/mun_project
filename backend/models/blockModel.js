// models/blockModel.js
const { sql, pool } = require('../config/db');

class Block {
  static async getAllBlocks() {
    try {
      const result = await pool.request().query('SELECT * FROM [Block]');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching blocks:', error);
      throw error;
    }
  }

  static async getBlockById(blockId) {
    try {
      const result = await pool
        .request()
        .input('BlockId', sql.Int, blockId)
        .query('SELECT * FROM [Block] WHERE BlockId = @BlockId');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error fetching block by ID:', error);
      throw error;
    }
  }

  static async createBlock(blockData) {
    try {
      const { blockName, stance } = blockData;
      
      const result = await pool
        .request()
        .input('BlockName', sql.VarChar(50), blockName)
        .input('Stance', sql.VarChar(100), stance)
        .query('INSERT INTO [Block] (BlockName, Stance) VALUES (@BlockName, @Stance); SELECT SCOPE_IDENTITY() AS BlockId');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  }

  static async updateBlock(blockId, blockData) {
    try {
      const { blockName, stance } = blockData;
      
      const result = await pool
        .request()
        .input('BlockId', sql.Int, blockId)
        .input('BlockName', sql.VarChar(50), blockName)
        .input('Stance', sql.VarChar(100), stance)
        .query('UPDATE [Block] SET BlockName = @BlockName, Stance = @Stance WHERE BlockId = @BlockId');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating block:', error);
      throw error;
    }
  }

  static async deleteBlock(blockId) {
    try {
      // Using stored procedure for delete since it handles integrity checks
      const result = await pool
        .request()
        .input('BlockId', sql.Int, blockId)
        .execute('sp_DeleteBlock');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  }
}

module.exports = Block;