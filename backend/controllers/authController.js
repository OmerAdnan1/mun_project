const authModel = require('../models/authModel');

class AuthController {
  async register(req, res) {
    try {
      const { userName, password, email, fullName, phoneNumber, userType } = req.body;
      
      // Validate required fields
      if (!userName || !password || !email || !fullName || !userType) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide all required fields'
        });
      }
      
      // Determine userTypeFlag (1 for Delegate, 2 for Chair)
      const userTypeFlag = userType.toLowerCase() === 'delegate' ? 1 : 2;
      
      // Call model to register user
      const result = await authModel.register({
        userName,
        password,
        email,
        fullName,
        phoneNumber: phoneNumber || '',
      }, userTypeFlag);
      
      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in register controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide email and password'
        });
      }
      
      // Call model to login user
      const result = await authModel.login(email, password);
      
      if (result.success) {
        // Don't send password in response
        if (result.user && result.user.Password) {
          delete result.user.Password;
        }
        return res.status(200).json(result);
      } else {
        return res.status(401).json(result);
      }
    } catch (error) {
      console.error('Error in login controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new AuthController();