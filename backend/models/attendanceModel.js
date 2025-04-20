const { sql, pool } = require('../config/db');

class Attendance {
    static async getAll() {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .query('SELECT * FROM Attendance');
            return result.recordset;
        } catch (error) {
            console.error('Error in getAll attendance:', error);
            throw error;
        }
    }

    static async getById(attendanceId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('AttendanceId', sql.Int, attendanceId)
                .query('SELECT * FROM Attendance WHERE AttendanceId = @AttendanceId');
            return result.recordset[0];
        } catch (error) {
            console.error('Error in getById attendance:', error);
            throw error;
        }
    }

    static async getByDelegateId(delegateId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('DelegateId', sql.Int, delegateId)
                .query('SELECT * FROM Attendance WHERE DelegateId = @DelegateId');
            return result.recordset;
        } catch (error) {
            console.error('Error in getByDelegateId attendance:', error);
            throw error;
        }
    }

    static async getBySessionId(sessionId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('SessionId', sql.Int, sessionId)
                .query('SELECT * FROM Attendance WHERE SessionId = @SessionId');
            return result.recordset;
        } catch (error) {
            console.error('Error in getBySessionId attendance:', error);
            throw error;
        }
    }

    static async create(attendanceData) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('DelegateId', sql.Int, attendanceData.delegateId)
                .input('SessionId', sql.Int, attendanceData.sessionId)
                .input('EventId', sql.Int, attendanceData.eventId)
                .input('Status', sql.VarChar(10), attendanceData.status)
                .query(`
                    INSERT INTO Attendance (DelegateId, SessionId, EventId, Status)
                    VALUES (@DelegateId, @SessionId, @EventId, @Status)
                `);
            return { success: true, message: 'Attendance recorded successfully' };
        } catch (error) {
            console.error('Error in create attendance:', error);
            throw error;
        }
    }

    static async update(attendanceId, attendanceData) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('AttendanceId', sql.Int, attendanceId)
                .input('Status', sql.VarChar(10), attendanceData.status)
                .query('UPDATE Attendance SET Status = @Status WHERE AttendanceId = @AttendanceId');
            return { success: true, message: 'Attendance updated successfully' };
        } catch (error) {
            console.error('Error in update attendance:', error);
            throw error;
        }
    }

    static async delete(attendanceId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('AttendanceId', sql.Int, attendanceId)
                .query('DELETE FROM Attendance WHERE AttendanceId = @AttendanceId');
            return { success: true, message: 'Attendance record deleted successfully' };
        } catch (error) {
            console.error('Error in delete attendance:', error);
            throw error;
        }
    }
}

module.exports = Attendance;