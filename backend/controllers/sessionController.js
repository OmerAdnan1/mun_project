// controllers/sessionController.js
const Session = require('../models/sessionModel');

const sessionController = {
  getAllSessions: async (req, res) => {
    try {
      const sessions = await Session.getAllSessions();
      res.status(200).json(sessions);
    } catch (error) {
      console.error('Error in getAllSessions controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  getSessionById: async (req, res) => {
    try {
      const { id } = req.params;
      const session = await Session.getSessionById(id);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      res.status(200).json(session);
    } catch (error) {
      console.error('Error in getSessionById controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  getSessionsByCommittee: async (req, res) => {
    try {
      const { committeeId } = req.params;
      const sessions = await Session.getSessionsByCommittee(committeeId);
      res.status(200).json(sessions);
    } catch (error) {
      console.error('Error in getSessionsByCommittee controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  createSession: async (req, res) => {
    try {
      const { committeeId, startTime, endTime } = req.body;
      
      if (!committeeId || !startTime || !endTime) {
        return res.status(400).json({ message: 'Committee ID, start time, and end time are required' });
      }
      
      // Validate times
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      if (startDate >= endDate) {
        return res.status(400).json({ message: 'Start time must be before end time' });
      }
      
      const newSession = await Session.createSession({ committeeId, startTime, endTime });
      res.status(201).json({ message: 'Session created successfully', sessionId: newSession.SessionId });
    } catch (error) {
      console.error('Error in createSession controller:', error);
      
      if (error.message.includes('Committee does not exist')) {
        return res.status(400).json({ message: 'Invalid committee ID' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  updateSession: async (req, res) => {
    try {
      const { id } = req.params;
      const { dayNumber, startTime, endTime } = req.body;
      
      if (!dayNumber && !startTime && !endTime) {
        return res.status(400).json({ message: 'At least one field to update is required' });
      }
      
      // Validate day number
      if (dayNumber && (dayNumber < 1 || dayNumber > 3)) {
        return res.status(400).json({ message: 'Day number must be between 1 and 3' });
      }
      
      // Validate times if provided
      if (startTime && endTime) {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return res.status(400).json({ message: 'Invalid date format' });
        }
        
        if (startDate >= endDate) {
          return res.status(400).json({ message: 'Start time must be before end time' });
        }
      }
      
      await Session.updateSession(id, { dayNumber, startTime, endTime });
      res.status(200).json({ message: 'Session updated successfully' });
    } catch (error) {
      console.error('Error in updateSession controller:', error);
      
      if (error.message.includes('Session does not exist')) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      if (error.message.includes('overlap')) {
        return res.status(400).json({ message: 'Session would overlap with an existing session' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  endSession: async (req, res) => {
    try {
      const { id } = req.params;
      await Session.endSession(id);
      res.status(200).json({ message: 'Session ended successfully' });
    } catch (error) {
      console.error('Error in endSession controller:', error);
      
      if (error.message.includes('Session does not exist')) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  deleteSession: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await Session.deleteSession(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
      console.error('Error in deleteSession controller:', error);
      
      if (error.message.includes('associated events')) {
        return res.status(400).json({ message: 'Cannot delete session with associated events' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = sessionController;