const { sql, pool } = require('../config/db');

class AuthModel {
  async register(userData, userTypeFlag) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('UserName', sql.VarChar(50), userData.userName)
        .input('Password', sql.VarChar(100), userData.password)
        .input('Email', sql.VarChar(100), userData.email)
        .input('FullName', sql.VarChar(100), userData.fullName)
        .input('PhoneNumber', sql.VarChar(15), userData.phoneNumber)
        .input('UserTypeFlag', sql.Int, userTypeFlag)
        .execute('sp_RegisterUser');
      
      poolConnection.release();
      return { success: true, message: 'User registered successfully' };
    } catch (error) {
      console.error('Error in register model:', error);
      return { success: false, message: error.message };
    }
  }

  async login(email, password) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('Email', sql.VarChar(100), email)
        .input('Password', sql.VarChar(100), password)
        .execute('sp_LoginUser');
      
      poolConnection.release();
      
      // We need to check if the login was successful
      // Since the stored procedure only prints messages, we'll need to query the user
      const user = await poolConnection.request()
        .input('Email', sql.VarChar(100), email)
        .query('SELECT * FROM [User] WHERE Email = @Email AND Password = @Password');
      
      if (user.recordset.length > 0) {
        return { 
          success: true, 
          message: 'Login successful',
          user: user.recordset[0]
        };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Error in login model:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new AuthModel();