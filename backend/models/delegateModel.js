const { sql, pool, poolConnect } = require('../config/db');

class Delegate {
  static async getAllDelegates() {
    try {
      await poolConnect;
      const result = await pool.request().query(`
        SELECT d.DelegateId, u.UserId, u.UserName, u.Email, u.FullName, u.PhoneNumber,
               c.CountryName, b.BlockName
        FROM Delegate d
        JOIN [User] u ON d.UserId = u.UserId
        LEFT JOIN Country c ON d.CountryID = c.CountryID
        LEFT JOIN [Block] b ON d.BlockID = b.BlockId
      `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getDelegateById(delegateId) {
    try {
      await poolConnect;
      const result = await pool.request().query(`
        SELECT d.DelegateId, u.UserId, u.UserName, u.Email, u.FullName, u.PhoneNumber,
               c.CountryName, b.BlockName
        FROM Delegate d
        JOIN [User] u ON d.UserId = u.UserId
        LEFT JOIN Country c ON d.CountryID = c.CountryID
        LEFT JOIN [Block] b ON d.BlockID = b.BlockId
        WHERE d.DelegateId = ${delegateId}
      `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async assignCountry(delegateId, countryId) {
    try {
      await poolConnect;
      const request = pool.request();
      await request.query(`
        UPDATE Delegate
        SET CountryID = ${countryId}
        WHERE DelegateId = ${delegateId}
      `);
      return { delegateId, countryId };
    } catch (error) {
      throw error;
    }
  }

  static async assignBlock(delegateId, blockId) {
    try {
      await poolConnect;
      const request = pool.request();
      await request.query(`
        UPDATE Delegate
        SET BlockID = ${blockId}
        WHERE DelegateId = ${delegateId}
      `);
      return { delegateId, blockId };
    } catch (error) {
      throw error;
    }
  }

  static async assignToCommittee(delegateId, committeeId) {
    try {
      await poolConnect;
      const request = pool.request();
      await request.query(`
        INSERT INTO DelegateCommittee (DelegateId, CommitteeId)
        VALUES (${delegateId}, ${committeeId})
      `);
      return { delegateId, committeeId };
    } catch (error) {
      throw error;
    }
  }

  static async removeFromCommittee(delegateId, committeeId) {
    try {
      await poolConnect;
      const request = pool.request();
      await request.query(`
        DELETE FROM DelegateCommittee
        WHERE DelegateId = ${delegateId} AND CommitteeId = ${committeeId}
      `);
      return { delegateId, committeeId };
    } catch (error) {
      throw error;
    }
  }

  static async getDelegatesWithoutCommittee() {
    try {
      await poolConnect;
      const request = pool.request();
      const result = await request.execute('IdentifyDelegatesWithoutCommittee');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getDelegatesWithoutCountries() {
    try {
      await poolConnect;
      const request = pool.request();
      const result = await request.execute('GetDelegatesWithoutCountries');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async allocateCountries() {
    try {
      await poolConnect;
      const request = pool.request();
      await request.execute('AllocateCountriesToDelegates');
      return { message: "Countries allocated successfully" };
    } catch (error) {
      throw error;
    }
  }

  static async getAvailableCountries(committeeId) {
    try {
      await poolConnect;
      const request = pool.request();
      request.input('CommitteeId', sql.Int, committeeId);
      const result = await request.execute('GetAvailableCountries');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Delegate;