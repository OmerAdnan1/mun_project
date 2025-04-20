// controllers/countryController.js
const Country = require('../models/countryModel');

const countryController = {
  getAllCountries: async (req, res) => {
    try {
      const countries = await Country.getAllCountries();
      res.status(200).json(countries);
    } catch (error) {
      console.error('Error in getAllCountries controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  getCountryById: async (req, res) => {
    try {
      const { id } = req.params;
      const country = await Country.getCountryById(id);
      
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
      
      res.status(200).json(country);
    } catch (error) {
      console.error('Error in getCountryById controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  createCountry: async (req, res) => {
    try {
      const { countryName, importance } = req.body;
      
      if (!countryName) {
        return res.status(400).json({ message: 'Country name is required' });
      }
      
      const newCountry = await Country.createCountry({ countryName, importance });
      res.status(201).json({ message: 'Country created successfully', countryId: newCountry.CountryID });
    } catch (error) {
      console.error('Error in createCountry controller:', error);
      
      // Handle unique constraint violation
      if (error.message.includes('unique')) {
        return res.status(400).json({ message: 'Country name must be unique' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  updateCountry: async (req, res) => {
    try {
      const { id } = req.params;
      const { countryName, importance } = req.body;
      
      if (!countryName) {
        return res.status(400).json({ message: 'Country name is required' });
      }
      
      const success = await Country.updateCountry(id, { countryName, importance });
      
      if (!success) {
        return res.status(404).json({ message: 'Country not found or no changes made' });
      }
      
      res.status(200).json({ message: 'Country updated successfully' });
    } catch (error) {
      console.error('Error in updateCountry controller:', error);
      
      // Handle unique constraint violation
      if (error.message.includes('unique')) {
        return res.status(400).json({ message: 'Country name must be unique' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  deleteCountry: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await Country.deleteCountry(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Country not found or cannot be deleted' });
      }
      
      res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
      console.error('Error in deleteCountry controller:', error);
      
      if (error.message.includes('assigned to delegates')) {
        return res.status(400).json({ message: 'Cannot delete country that is assigned to delegates' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  getAvailableCountriesForCommittee: async (req, res) => {
    try {
      const { committeeId } = req.params;
      const countries = await Country.getAvailableCountriesForCommittee(committeeId);
      res.status(200).json(countries);
    } catch (error) {
      console.error('Error in getAvailableCountriesForCommittee controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  allocateCountriesToDelegates: async (req, res) => {
    try {
      await Country.allocateCountriesToDelegates();
      res.status(200).json({ message: 'Countries allocated to delegates successfully' });
    } catch (error) {
      console.error('Error in allocateCountriesToDelegates controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  getDelegatesWithoutCountries: async (req, res) => {
    try {
      const delegates = await Country.getDelegatesWithoutCountries();
      res.status(200).json(delegates);
    } catch (error) {
      console.error('Error in getDelegatesWithoutCountries controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = countryController;