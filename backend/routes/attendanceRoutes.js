const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET all attendance records
router.get('/', attendanceController.getAllAttendance);

// GET attendance record by ID
router.get('/:id', attendanceController.getAttendanceById);

// GET attendance records by delegate ID
router.get('/delegate/:delegateId', attendanceController.getAttendanceByDelegateId);

// GET attendance records by session ID
router.get('/session/:sessionId', attendanceController.getAttendanceBySessionId);

// POST create new attendance record
router.post('/', attendanceController.createAttendance);

// PUT update attendance record
router.put('/:id', attendanceController.updateAttendance);

// DELETE attendance record
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;