const { sql, pool } = require('../config/db');

class Motion {
    // Get all motions
    static async getAllMotions() {
        try {
            const result = await pool.request().query('SELECT * FROM Motion');
            return result.recordset;
        } catch (error) {
            console.error('Error getting motions:', error);
            throw error;
        }
    }

    // Get motion by ID
    static async getMotionById(motionId) {
        try {
            const result = await pool.request()
                .input('MotionId', sql.Int, motionId)
                .query('SELECT * FROM Motion WHERE MotionId = @MotionId');
            return result.recordset[0];
        } catch (error) {
            console.error('Error getting motion by ID:', error);
            throw error;
        }
    }

    // Submit a new motion using stored procedure
    static async submitMotion(eventId, title, subDate, dueDate, description) {
        try {
            const result = await pool.request()
                .input('EventId', sql.Int, eventId)
                .input('Title', sql.NVarChar, title)
                .input('subDate', sql.DateTime, subDate)
                .input('dueDate', sql.DateTime, dueDate)
                .input('Description', sql.NVarChar, description)
                .execute('SubmitMotion');
            return { success: true, message: 'Motion submitted successfully' };
        } catch (error) {
            console.error('Error submitting motion:', error);
            throw error;
        }
    }

    // Delete motion using stored procedure
    static async deleteMotion(motionId) {
        try {
            const result = await pool.request()
                .input('MotionId', sql.Int, motionId)
                .execute('sp_DeleteMotion');
            return { success: true, message: 'Motion deleted successfully' };
        } catch (error) {
            console.error('Error deleting motion:', error);
            throw error;
        }
    }

    // Update motion status
    static async updateMotionStatus(motionId, status) {
        try {
            const result = await pool.request()
                .input('MotionId', sql.Int, motionId)
                .input('Status', sql.VarChar, status)
                .query('UPDATE Motion SET Status = @Status WHERE MotionId = @MotionId');
            return { success: true, message: 'Motion status updated successfully' };
        } catch (error) {
            console.error('Error updating motion status:', error);
            throw error;
        }
    }

    // Get motions by event ID
    static async getMotionsByEventId(eventId) {
        try {
            const result = await pool.request()
                .input('EventId', sql.Int, eventId)
                .query('SELECT * FROM Motion WHERE EventId = @EventId');
            return result.recordset;
        } catch (error) {
            console.error('Error getting motions by event ID:', error);
            throw error;
        }
    }
}

module.exports = Motion;