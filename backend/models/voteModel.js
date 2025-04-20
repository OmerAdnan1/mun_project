const { sql, pool } = require('../config/db');

class Vote {
    static async getAll() {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .query('SELECT * FROM Vote');
            return result.recordset;
        } catch (error) {
            console.error('Error in getAll votes:', error);
            throw error;
        }
    }

    static async getById(voteId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('VoteId', sql.Int, voteId)
                .query('SELECT * FROM Vote WHERE VoteId = @VoteId');
            return result.recordset[0];
        } catch (error) {
            console.error('Error in getById vote:', error);
            throw error;
        }
    }

    static async getByDelegateId(delegateId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('DelegateId', sql.Int, delegateId)
                .query('SELECT * FROM Vote WHERE DelegateId = @DelegateId');
            return result.recordset;
        } catch (error) {
            console.error('Error in getByDelegateId votes:', error);
            throw error;
        }
    }

    static async voteOnMotion(voteData) {
        try {
            const poolConnection = await pool.connect();
            await poolConnection.request()
                .input('DelegateId', sql.Int, voteData.delegateId)
                .input('MotionId', sql.Int, voteData.motionId)
                .input('VoteType', sql.VarChar(20), voteData.voteType)
                .execute('VoteOnMotion');
            return { success: true, message: 'Vote on motion recorded successfully' };
        } catch (error) {
            console.error('Error in voteOnMotion:', error);
            throw error;
        }
    }

    static async voteOnResolution(voteData) {
        try {
            const poolConnection = await pool.connect();
            await poolConnection.request()
                .input('DelegateId', sql.Int, voteData.delegateId)
                .input('ResolutionId', sql.Int, voteData.resolutionId)
                .input('VoteType', sql.VarChar(20), voteData.voteType)
                .execute('VoteOnResolution');
            return { success: true, message: 'Vote on resolution recorded successfully' };
        } catch (error) {
            console.error('Error in voteOnResolution:', error);
            throw error;
        }
    }

    static async delete(voteId) {
        try {
            const poolConnection = await pool.connect();
            const result = await poolConnection.request()
                .input('VoteId', sql.Int, voteId)
                .query('DELETE FROM Vote WHERE VoteId = @VoteId');
            return { success: true, message: 'Vote deleted successfully' };
        } catch (error) {
            console.error('Error in delete vote:', error);
            throw error;
        }
    }
}

module.exports = Vote;