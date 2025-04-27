const { sql, poolPromise } = require('../config/db');

class Event {
  // Create a new event
  static async create(eventData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('committee_id', sql.Int, eventData.committee_id);
      request.input('type', sql.VarChar(10), eventData.type);
      request.input('proposed_by', sql.Int, eventData.proposed_by);
      request.input('description', sql.Text, eventData.description || null);
      request.input('start_time', sql.DateTime, eventData.start_time || null);
      request.input('end_time', sql.DateTime, eventData.end_time || null);
      request.input('status', sql.VarChar(10), eventData.status || 'pending');
      request.input('duration_minutes', sql.Int, eventData.duration_minutes || null);
      request.input('topic', sql.VarChar(255), eventData.topic || null);
      request.input('notes', sql.Text, eventData.notes || null);
      request.output('event_id', sql.Int);

      const result = await request.execute('sp_CreateEvent');
      const eventId = result.output.event_id;
      
      // Get the created event
      return await this.getById(eventId);
    } catch (error) {
      throw error;
    }
  }

  // Get event by ID
  static async getById(eventId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('event_id', sql.Int, eventId);

      const result = await request.execute('sp_GetEventById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update event
  static async update(eventId, eventData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('event_id', sql.Int, eventId);
      request.input('description', sql.Text, eventData.description || null);
      request.input('start_time', sql.DateTime, eventData.start_time || null);
      request.input('end_time', sql.DateTime, eventData.end_time || null);
      request.input('status', sql.VarChar(10), eventData.status || null);
      request.input('duration_minutes', sql.Int, eventData.duration_minutes || null);
      request.input('topic', sql.VarChar(255), eventData.topic || null);
      request.input('notes', sql.Text, eventData.notes || null);

      await request.execute('sp_UpdateEvent');
      
      // Get the updated event
      return await this.getById(eventId);
    } catch (error) {
      throw error;
    }
  }

  // Delete event
  static async delete(eventId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('event_id', sql.Int, eventId);

      await request.execute('sp_DeleteEvent');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get events by committee
  static async getByCommittee(committeeId, filters = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('committee_id', sql.Int, committeeId);
      request.input('type', sql.VarChar(10), filters.type || null);
      request.input('status', sql.VarChar(10), filters.status || null);
      request.input('start_date', sql.Date, filters.start_date || null);
      request.input('end_date', sql.Date, filters.end_date || null);

      const result = await request.execute('sp_GetEventsByCommittee');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Get events by delegate
  static async getByDelegate(delegateId, filters = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('delegate_id', sql.Int, delegateId);
      request.input('type', sql.VarChar(10), filters.type || null);
      request.input('status', sql.VarChar(10), filters.status || null);

      const result = await request.execute('sp_GetEventsByDelegate');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Event;