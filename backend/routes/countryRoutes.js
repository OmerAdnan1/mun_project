const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// Create a new country
router.post('/', countryController.createCountry);

// Get all countries
router.get('/', countryController.getAllCountries);

// Get country by ID
router.get('/:id', countryController.getCountryById);

// Update country
router.put('/:id', countryController.updateCountry);

// Delete country
router.delete('/:id', countryController.deleteCountry);

module.exports = router;