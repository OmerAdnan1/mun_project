// models/User.js
const { sql, poolPromise } = require('../config/db');

class User {
  // Create a new user
  static async create(userData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('email', sql.VarChar(255), userData.email);
      request.input('password', sql.VarChar(255), userData.password);
      request.input('full_name', sql.VarChar(100), userData.full_name);
      request.input('role', sql.VarChar(10), userData.role);
      request.input('phone', sql.VarChar(20), userData.phone || null);
      request.output('user_id', sql.Int);
      
      const result = await request.execute('sp_CreateUser');
      return { user_id: result.output.user_id };
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getById(userId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('user_id', sql.Int, userId);
      
      const result = await request.execute('sp_GetUserById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async getByEmail(email) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('email', sql.VarChar(255), email);
      
      const result = await request.execute('sp_GetUserByEmail');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  static async getAll() {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      const result = await request.execute('sp_GetAllUsers');
      return result.recordset;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Update user
  static async update(userId, userData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('user_id', sql.Int, userId);
      request.input('email', sql.VarChar(255), userData.email || null);
      request.input('password', sql.VarChar(255), userData.password || null);
      request.input('full_name', sql.VarChar(100), userData.full_name || null);
      request.input('phone', sql.VarChar(20), userData.phone || null);
      
      const result = await request.execute('sp_UpdateUser');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(userId, hardDelete = false) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('user_id', sql.Int, userId);
      request.input('hard_delete', sql.Bit, hardDelete ? 1 : 0);
      
      await request.execute('sp_DeleteUser');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Authenticate user
  static async authenticate(email, password) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('email', sql.VarChar(255), email);
      request.input('password', sql.VarChar(255), password);
      
      const result = await request.execute('sp_AuthenticateUser');
      
      if (result.returnValue === 1 && result.recordset.length > 0) {
        return result.recordset[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;