const Country = require('../models/Country');

// Create a new country
exports.createCountry = async (req, res) => {
  try {
    const country = await Country.create(req.body);
    
    res.status(201).json({
      success: true,
      data: country
    });
  } catch (error) {
    console.error('Create country error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create country',
      error: error.message
    });
  }
};

// Get country by ID
exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.getById(req.params.id);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: country
    });
  } catch (error) {
    console.error('Get country error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve country',
      error: error.message
    });
  }
};

// Update country
exports.updateCountry = async (req, res) => {
  try {
    const country = await Country.update(req.params.id, req.body);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: country
    });
  } catch (error) {
    console.error('Update country error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update country',
      error: error.message
    });
  }
};

// Delete country
exports.deleteCountry = async (req, res) => {
  try {
    await Country.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Country deleted successfully'
    });
  } catch (error) {
    console.error('Delete country error:', error);
    
    // Handle specific errors
    if (error.message.includes('Cannot delete country that is assigned to delegates')) {
      return res.status(400).json({
        success: false,
        message: 'Country is assigned to delegates and cannot be deleted',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete country',
      error: error.message
    });
  }
};

// Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const filters = {
      importance_min: req.query.importance_min ? parseInt(req.query.importance_min) : null,
      importance_max: req.query.importance_max ? parseInt(req.query.importance_max) : null,
      search_term: req.query.search_term
    };
    
    const countries = await Country.getAll(filters);
    
    res.status(200).json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve countries',
      error: error.message
    });
  }
};

// Get available countries for a committee (and optionally block)
exports.getAvailableCountries = async (req, res) => {
  try {
    const committeeId = parseInt(req.query.committee_id);
    const blockId = req.query.block_id ? parseInt(req.query.block_id) : null;
    if (!committeeId) {
      return res.status(400).json({ success: false, message: 'committee_id is required' });
    }
    const countries = await Country.getAvailableCountries(committeeId, blockId);
    res.status(200).json({ success: true, data: countries });
  } catch (error) {
    console.error('Get available countries error:', error);
    res.status(500).json({ success: false, message: 'Failed to get available countries', error: error.message });
  }
};