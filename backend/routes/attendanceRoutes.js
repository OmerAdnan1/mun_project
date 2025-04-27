const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Record attendance
router.post('/', attendanceController.recordAttendance);

// Get attendance by committee and date
router.get('/committee/:id/date/:date', attendanceController.getAttendanceByDate);

// Get attendance by delegate
router.get('/delegate/:id', attendanceController.getAttendanceByDelegate);

// Update attendance
router.put('/:userId/:committeeId/:date', attendanceController.updateAttendance);

// Delete attendance
router.delete('/:userId/:committeeId/:date', attendanceController.deleteAttendance);

module.exports = router;