const { sql, poolPromise } = require('../config/db');

class Attendance {
  // Record attendance
  static async record(attendanceData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, attendanceData.user_id);
      request.input('committee_id', sql.Int, attendanceData.committee_id);
      request.input('date', sql.Date, attendanceData.date);
      request.input('status', sql.VarChar(10), attendanceData.status);
      request.input('check_in_time', sql.DateTime, attendanceData.check_in_time || null);
      request.input('notes', sql.Text, attendanceData.notes || null);

      await request.execute('sp_RecordAttendance');
      
      // Get the attendance record to return
      const result = await pool.request()
        .input('committee_id', sql.Int, attendanceData.committee_id)
        .input('date', sql.Date, attendanceData.date)
        .execute('sp_GetAttendanceByDate');
      
      return result.recordset.find(record => record.user_id === attendanceData.user_id);
    } catch (error) {
      throw error;
    }
  }

  // Get attendance by date for a committee
  static async getByDate(committeeId, date) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('committee_id', sql.Int, committeeId);
      request.input('date', sql.Date, date);

      const result = await request.execute('sp_GetAttendanceByDate');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Update attendance
  static async update(userId, committeeId, date, attendanceData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, userId);
      request.input('committee_id', sql.Int, committeeId);
      request.input('date', sql.Date, date);
      request.input('status', sql.VarChar(10), attendanceData.status);
      request.input('check_in_time', sql.DateTime, attendanceData.check_in_time || null);
      request.input('notes', sql.Text, attendanceData.notes || null);

      await request.execute('sp_UpdateAttendance');
      
      // Get the updated attendance to return
      const result = await pool.request()
        .input('committee_id', sql.Int, committeeId)
        .input('date', sql.Date, date)
        .execute('sp_GetAttendanceByDate');
      
      return result.recordset.find(record => record.user_id === userId);
    } catch (error) {
      throw error;
    }
  }

  // Delete attendance
  static async delete(userId, committeeId, date) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('user_id', sql.Int, userId);
      request.input('committee_id', sql.Int, committeeId);
      request.input('date', sql.Date, date);

      await request.execute('sp_DeleteAttendance');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get attendance by delegate
  static async getByDelegate(delegateId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('delegate_id', sql.Int, delegateId);

      const result = await request.execute('sp_GetAttendanceByDelegate');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Attendance;