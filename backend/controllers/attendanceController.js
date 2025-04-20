const Attendance = require('../models/attendanceModel');

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.getAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get attendance record by ID
exports.getAttendanceById = async (req, res) => {
    try {
        const record = await Attendance.getById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get attendance records by delegate ID
exports.getAttendanceByDelegateId = async (req, res) => {
    try {
        const records = await Attendance.getByDelegateId(req.params.delegateId);
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get attendance records by session ID
exports.getAttendanceBySessionId = async (req, res) => {
    try {
        const records = await Attendance.getBySessionId(req.params.sessionId);
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new attendance record
exports.createAttendance = async (req, res) => {
    try {
        const { delegateId, sessionId, eventId, status } = req.body;
        
        // Basic validation
        if (!delegateId || !sessionId || !status) {
            return res.status(400).json({ message: 'DelegateId, SessionId, and Status are required' });
        }
        
        if (!['Present', 'Absent', 'Late'].includes(status)) {
            return res.status(400).json({ message: 'Status must be Present, Absent, or Late' });
        }
        
        const result = await Attendance.create({
            delegateId,
            sessionId,
            eventId,
            status
        });
        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an attendance record
exports.updateAttendance = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['Present', 'Absent', 'Late'].includes(status)) {
            return res.status(400).json({ message: 'Valid Status is required (Present, Absent, or Late)' });
        }
        
        const result = await Attendance.update(req.params.id, { status });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an attendance record
exports.deleteAttendance = async (req, res) => {
    try {
        const result = await Attendance.delete(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};