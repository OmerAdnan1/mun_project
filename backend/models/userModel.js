const { sql, pool, poolConnect } = require('../config/db');

class User {
  static async register(userData, userTypeFlag) {
    try {
      await poolConnect;
      const request = pool.request();
      request.input('UserName', sql.VarChar(50), userData.username);
      request.input('Password', sql.VarChar(100), userData.password);  // Should be hashed in controller
      request.input('Email', sql.VarChar(100), userData.email);
      request.input('FullName', sql.VarChar(100), userData.fullName);
      request.input('PhoneNumber', sql.VarChar(15), userData.phoneNumber);
      request.input('UserTypeFlag', sql.Int, userTypeFlag);  // 1 for Delegate, 2 for Chair
      
      const result = await request.execute('sp_RegisterUser');
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      await poolConnect;
      const request = pool.request();
      request.input('Email', sql.VarChar(100), email);
      request.input('Password', sql.VarChar(100), password);
      
      const result = await request.execute('sp_LoginUser');
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      await poolConnect;
      const request = pool.request();
      const result = await request.query(`SELECT * FROM [User] WHERE UserId = ${userId}`);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    try {
      await poolConnect;
      const request = pool.request();
      request.input('UserId', sql.Int, userId);
      
      if (userData.username) {
        request.input('UserName', sql.VarChar(50), userData.username);
      }
      if (userData.email) {
        request.input('Email', sql.VarChar(100), userData.email);
      }
      if (userData.fullName) {
        request.input('FullName', sql.VarChar(100), userData.fullName);
      }
      if (userData.phoneNumber) {
        request.input('PhoneNumber', sql.VarChar(15), userData.phoneNumber);
      }
      if (userData.password) {
        request.input('Password', sql.VarChar(100), userData.password);  // Should be hashed in controller
      }
      
      const result = await request.execute('sp_UpdateUserInfo');
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      await poolConnect;
      const request = pool.request();
      request.input('UserId', sql.Int, userId);
      
      const result = await request.execute('sp_DeleteUser');
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;