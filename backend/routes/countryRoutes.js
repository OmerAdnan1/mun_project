// routes/countryRoutes.js
const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// Get all countries
router.get('/', countryController.getAllCountries);

// Get country by ID
router.get('/:id', countryController.getCountryById);

// Create new country
router.post('/', countryController.createCountry);

// Update country
router.put('/:id', countryController.updateCountry);

// Delete country
router.delete('/:id', countryController.deleteCountry);

// Get available countries for a committee
router.get('/available/:committeeId', countryController.getAvailableCountriesForCommittee);

// Allocate countries to delegates
router.post('/allocate', countryController.allocateCountriesToDelegates);

// Get delegates without countries
router.get('/delegates/unassigned', countryController.getDelegatesWithoutCountries);

module.exports = router;