const { sql, pool, poolConnect } = require('../config/db');

class Committee {
  static async getAllCommittees() {
    try {
      await poolConnect;
      const result = await pool.request().query('SELECT * FROM Committee');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getCommitteeById(committeeId) {
    try {
      await poolConnect;
      const request = pool.request();
      const result = await request.query(`SELECT * FROM Committee WHERE CommitteeId = ${committeeId}`);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async createCommittee(name, topic) {
    try {
      await poolConnect;
      const request = pool.request();
      const result = await request.query(`
        INSERT INTO Committee ([Name], Topic)
        VALUES ('${name}', '${topic}');
        SELECT SCOPE_IDENTITY() AS CommitteeId;
      `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateCommittee(committeeId, name, topic) {
    try {
      await poolConnect;
      const request = pool.request();
      await request.query(`
        UPDATE Committee
        SET [Name] = '${name}', Topic = '${topic}'
        WHERE CommitteeId = ${committeeId}
      `);
      return { committeeId, name, topic };
    } catch (error) {
      throw error;
    }
  }

  static async deleteCommittee(committeeId) {
    try {
      await poolConnect;
      const request = pool.request();
      request.input('CommitteeId', sql.Int, committeeId);
      
      const result = await request.execute('sp_DeleteCommittee');
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async assignChair(committeeId, chairId) {
    try {
      await poolConnect;
      const request = pool.request();
      await request.query(`
        UPDATE Chair
        SET CommitteeId = ${committeeId}
        WHERE ChairId = ${chairId}
      `);
      return { committeeId, chairId };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Committee;