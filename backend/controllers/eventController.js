const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);

    // Handle specific errors
    if (error.message.includes('Committee not found')) {
      return res.status(400).json({
        success: false,
        message: 'Committee not found',
        error: error.message
      });
    }

    if (error.message.includes('Delegate not found or not assigned')) {
      return res.status(400).json({
        success: false,
        message: 'Delegate not found or not assigned to this committee',
        error: error.message
      });
    }

    if (error.message.includes('Invalid event type')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type',
        error: error.message
      });
    }

    if (error.message.includes('Invalid event status')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event status',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.getById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event',
      error: error.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.update(req.params.id, req.body);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);

    // Handle specific errors
    if (error.message.includes('Event not found')) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message
      });
    }

    if (error.message.includes('Invalid event status')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event status',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);

    if (error.message.includes('Event not found')) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

// Get events by committee
exports.getEventsByCommittee = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      status: req.query.status,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };

    const events = await Event.getByCommittee(req.params.id, filters);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get events by committee error:', error);

    if (error.message.includes('Committee not found')) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message
    });
  }
};

// Get events by delegate
exports.getEventsByDelegate = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      status: req.query.status
    };

    const events = await Event.getByDelegate(req.params.id, filters);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get events by delegate error:', error);

    if (error.message.includes('Delegate not found')) {
      return res.status(404).json({
        success: false,
        message: 'Delegate not found',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message
    });
  }
};