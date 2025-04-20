const { sql, pool } = require('../config/db');

class PositionPaper {
    static async getAll() {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .query('SELECT * FROM PositionPaper');
            return result.recordset;
        } catch (error) {
            console.error('Error in getAll position papers:', error);
            throw error;
        }
    }

    static async getById(paperId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('PaperId', sql.Int, paperId)
                .query('SELECT * FROM PositionPaper WHERE PaperId = @PaperId');
            return result.recordset[0];
        } catch (error) {
            console.error('Error in getById position paper:', error);
            throw error;
        }
    }

    static async getByDelegateId(delegateId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('DelegateId', sql.Int, delegateId)
                .query('SELECT * FROM PositionPaper WHERE DelegateId = @DelegateId');
            return result.recordset[0];
        } catch (error) {
            console.error('Error in getByDelegateId position paper:', error);
            throw error;
        }
    }

    static async create(paperData) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('DelegateId', sql.Int, paperData.delegateId)
                .input('SubmissionDate', sql.DateTime, paperData.submissionDate)
                .input('DueDate', sql.DateTime, paperData.dueDate)
                .input('Status', sql.VarChar(20), paperData.status)
                .execute('SubmitPositionPaper');
            return { success: true, message: 'Position paper submitted successfully' };
        } catch (error) {
            console.error('Error in create position paper:', error);
            throw error;
        }
    }

    static async update(paperId, paperData) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('PaperId', sql.Int, paperId)
                .input('Feedback', sql.VarChar(sql.MAX), paperData.feedback)
                .input('Status', sql.VarChar(20), paperData.status)
                .query('UPDATE PositionPaper SET Feedback = @Feedback, Status = @Status WHERE PaperId = @PaperId');
            return { success: true, message: 'Position paper updated successfully' };
        } catch (error) {
            console.error('Error in update position paper:', error);
            throw error;
        }
    }

    static async delete(paperId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('PaperId', sql.Int, paperId)
                .query('DELETE FROM PositionPaper WHERE PaperId = @PaperId');
            return { success: true, message: 'Position paper deleted successfully' };
        } catch (error) {
            console.error('Error in delete position paper:', error);
            throw error;
        }
    }
}

module.exports = PositionPaper;