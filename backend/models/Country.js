const { sql, poolPromise } = require('../config/db');

class Country {
  // Create a new country
  static async create(countryData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('name', sql.VarChar(100), countryData.name);
      request.input('flag_url', sql.VarChar(255), countryData.flag_url || null);
      request.input('description', sql.Text, countryData.description || null);
      request.input('importance', sql.Int, countryData.importance || 1);
      request.output('country_id', sql.Int);
      
      const result = await request.execute('sp_CreateCountry');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Get country by ID
  static async getById(countryId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('country_id', sql.Int, countryId);
      
      const result = await request.execute('sp_GetCountryById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update country
  static async update(countryId, countryData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('country_id', sql.Int, countryId);
      request.input('name', sql.VarChar(100), countryData.name || null);
      request.input('flag_url', sql.VarChar(255), countryData.flag_url || null);
      request.input('description', sql.Text, countryData.description || null);
      request.input('importance', sql.Int, countryData.importance || null);
      
      const result = await request.execute('sp_UpdateCountry');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete country
  static async delete(countryId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('country_id', sql.Int, countryId);
      
      await request.execute('sp_DeleteCountry');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all countries
  static async getAll(filters = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('importance_min', sql.Int, filters.importance_min || null);
      request.input('importance_max', sql.Int, filters.importance_max || null);
      request.input('search_term', sql.VarChar(100), filters.search_term || null);
      
      const result = await request.execute('sp_GetAllCountries');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Country;