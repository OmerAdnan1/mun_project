// models/countryModel.js
const { sql, pool } = require('../config/db');

class Country {
  static async getAllCountries() {
    try {
      const result = await pool.request().query('SELECT * FROM Country ORDER BY CountryName');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  static async getCountryById(countryId) {
    try {
      const result = await pool
        .request()
        .input('CountryID', sql.Int, countryId)
        .query('SELECT * FROM Country WHERE CountryID = @CountryID');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error fetching country by ID:', error);
      throw error;
    }
  }

  static async createCountry(countryData) {
    try {
      const { countryName, importance } = countryData;
      
      const result = await pool
        .request()
        .input('CountryName', sql.VarChar(255), countryName)
        .input('Importance', sql.Int, importance || 0)
        .query('INSERT INTO Country (CountryName, Importance) VALUES (@CountryName, @Importance); SELECT SCOPE_IDENTITY() AS CountryID');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error creating country:', error);
      throw error;
    }
  }

  static async updateCountry(countryId, countryData) {
    try {
      const { countryName, importance } = countryData;
      
      const result = await pool
        .request()
        .input('CountryID', sql.Int, countryId)
        .input('CountryName', sql.VarChar(255), countryName)
        .input('Importance', sql.Int, importance || 0)
        .query('UPDATE Country SET CountryName = @CountryName, Importance = @Importance WHERE CountryID = @CountryID');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating country:', error);
      throw error;
    }
  }

  static async deleteCountry(countryId) {
    try {
      // Check if country is assigned to any delegates
      const checkResult = await pool
        .request()
        .input('CountryID', sql.Int, countryId)
        .query('SELECT COUNT(*) AS count FROM Delegate WHERE CountryID = @CountryID');
      
      if (checkResult.recordset[0].count > 0) {
        throw new Error('Cannot delete country that is assigned to delegates');
      }
      
      const result = await pool
        .request()
        .input('CountryID', sql.Int, countryId)
        .query('DELETE FROM Country WHERE CountryID = @CountryID');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting country:', error);
      throw error;
    }
  }
  
  static async getAvailableCountriesForCommittee(committeeId) {
    try {
      const result = await pool
        .request()
        .input('CommitteeId', sql.Int, committeeId)
        .execute('GetAvailableCountries');
      
      return result.recordset;
    } catch (error) {
      console.error('Error getting available countries:', error);
      throw error;
    }
  }
  
  static async allocateCountriesToDelegates() {
    try {
      await pool.request().execute('AllocateCountriesToDelegates');
      return true;
    } catch (error) {
      console.error('Error allocating countries to delegates:', error);
      throw error;
    }
  }
  
  static async getDelegatesWithoutCountries() {
    try {
      const result = await pool.request().execute('GetDelegatesWithoutCountries');
      return result.recordset;
    } catch (error) {
      console.error('Error getting delegates without countries:', error);
      throw error;
    }
  }
}

module.exports = Country;