const { sql, pool } = require('../config/db');

class Event {
    // Get all events
    static async getAllEvents() {
        try {
            const result = await pool.request().query('SELECT * FROM [Event]');
            return result.recordset;
        } catch (error) {
            console.error('Error getting events:', error);
            throw error;
        }
    }

    // Get event by ID
    static async getEventById(eventId) {
        try {
            const result = await pool.request()
                .input('EventId', sql.Int, eventId)
                .query('SELECT * FROM [Event] WHERE EventId = @EventId');
            return result.recordset[0];
        } catch (error) {
            console.error('Error getting event by ID:', error);
            throw error;
        }
    }

    // Create a new event using stored procedure
    static async createEvent(title, eventType, sessionId) {
        try {
            const result = await pool.request()
                .input('Title', sql.NVarChar, title)
                .input('EventType', sql.NVarChar, eventType)
                .input('Sessionid', sql.Int, sessionId)
                .execute('CreateEvent');
            return { success: true, message: 'Event created successfully' };
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    // Update event
    static async updateEvent(eventId, title, eventType) {
        try {
            const result = await pool.request()
                .input('EventId', sql.Int, eventId)
                .input('Agenda', sql.NVarChar, title)
                .input('EventType', sql.NVarChar, eventType)
                .query('UPDATE [Event] SET Agenda = @Agenda, EventType = @EventType WHERE EventId = @EventId');
            return { success: true, message: 'Event updated successfully' };
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    // Delete event
    static async deleteEvent(eventId) {
        try {
            const result = await pool.request()
                .input('EventId', sql.Int, eventId)
                .query('DELETE FROM [Event] WHERE EventId = @EventId');
            return { success: true, message: 'Event deleted successfully' };
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }

    // Get events by session ID
    static async getEventsBySessionId(sessionId) {
        try {
            const result = await pool.request()
                .input('SessionId', sql.Int, sessionId)
                .query('SELECT * FROM [Event] WHERE SessionId = @SessionId');
            return result.recordset;
        } catch (error) {
            console.error('Error getting events by session ID:', error);
            throw error;
        }
    }
}

module.exports = Event;