const express = require('express');
const router = express.Router();
const resolutionController = require('../controllers/resolutionController');

// GET all resolutions
router.get('/', resolutionController.getAllResolutions);

// GET resolution by ID
router.get('/:id', resolutionController.getResolutionById);

// GET resolutions by event ID
router.get('/event/:eventId', resolutionController.getResolutionsByEventId);

// GET resolutions by block ID
router.get('/block/:blockId', resolutionController.getResolutionsByBlockId);

// POST submit new resolution
router.post('/', resolutionController.submitResolution);

// PUT update resolution status
router.put('/:id/status', resolutionController.updateResolutionStatus);

// DELETE resolution
router.delete('/:id', resolutionController.deleteResolution);

module.exports = router;