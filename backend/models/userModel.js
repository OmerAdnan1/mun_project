// models/userModel.js
const { sql, pool } = require('../config/db');

const userModel = {
  // Get all users
  getAllUsers: async () => {
    try {
      await pool.connect();
      const result = await pool.request().query('SELECT * FROM [User]');
      return result.recordset;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM [User] WHERE UserId = @userId');
      return result.recordset[0];
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },

  // Register user (using stored procedure)
  registerUser: async (userData) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('UserName', sql.VarChar(50), userData.userName)
        .input('Password', sql.VarChar(100), userData.password)
        .input('Email', sql.VarChar(100), userData.email)
        .input('FullName', sql.VarChar(100), userData.fullName)
        .input('PhoneNumber', sql.VarChar(15), userData.phoneNumber)
        .input('UserTypeFlag', sql.Int, userData.userTypeFlag)
        .execute('sp_RegisterUser');
      return result;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user (using stored procedure)
  loginUser: async (email, password) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('Email', sql.VarChar(100), email)
        .input('Password', sql.VarChar(100), password)
        .execute('sp_LoginUser');
      return result;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  // Update user (using stored procedure)
  updateUser: async (userId, userData) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('UserId', sql.Int, userId)
        .input('UserName', sql.VarChar(50), userData.userName || null)
        .input('Email', sql.VarChar(100), userData.email || null)
        .input('FullName', sql.VarChar(100), userData.fullName || null)
        .input('PhoneNumber', sql.VarChar(15), userData.phoneNumber || null)
        .input('Password', sql.VarChar(100), userData.password || null)
        .execute('sp_UpdateUserInfo');
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user (using stored procedure)
  deleteUser: async (userId) => {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('UserId', sql.Int, userId)
        .execute('sp_DeleteUser');
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

module.exports = userModel;