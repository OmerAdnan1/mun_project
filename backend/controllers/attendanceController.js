const Attendance = require('../models/Attendance');

// Record attendance
exports.recordAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.record(req.body);

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Record attendance error:', error);

    // Handle specific errors
    if (error.message.includes('Invalid status value')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        error: error.message
      });
    }

    if (error.message.includes('User must be either a chair or a delegate')) {
      return res.status(400).json({
        success: false,
        message: 'User must be either a chair or a delegate for the committee',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to record attendance',
      error: error.message
    });
  }
};

// Get attendance by date for a committee
exports.getAttendanceByDate = async (req, res) => {
  try {
    const attendance = await Attendance.getByDate(req.params.id, req.params.date);

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendance',
      error: error.message
    });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.update(
      req.params.userId,
      req.params.committeeId,
      req.params.date,
      req.body
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);

    // Handle specific errors
    if (error.message.includes('Invalid status value')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        error: error.message
      });
    }

    if (error.message.includes('Attendance record not found')) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update attendance',
      error: error.message
    });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.delete(
      req.params.userId,
      req.params.committeeId,
      req.params.date
    );

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Delete attendance error:', error);

    if (error.message.includes('Attendance record not found')) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete attendance',
      error: error.message
    });
  }
};

// Get attendance by delegate
exports.getAttendanceByDelegate = async (req, res) => {
  try {
    const attendance = await Attendance.getByDelegate(parseInt(req.params.id));

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    console.error('Get attendance by delegate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendance',
      error: error.message
    });
  }
};