const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Prepare user data with hashed password
    const userData = {
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber
    };
    
    // Determine user type
    const userTypeFlag = req.body.userType === 'delegate' ? 1 : 2;  // 1 for Delegate, 2 for Chair
    
    await User.register(userData, userTypeFlag);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const request = await User.pool.request();
    const result = await request.query(`SELECT * FROM [User] WHERE Email = '${email}'`);
    const user = result.recordset[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.UserId, userType: user.UserType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, userType: user.UserType, userId: user.UserId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;  // From auth middleware
    let userData = { ...req.body };
    
    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    await User.updateUser(userId, userData);
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.deleteUser(userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;  // From auth middleware
    const user = await User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    delete user.Password;
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};