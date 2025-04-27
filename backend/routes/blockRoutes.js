const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');

// Create a new block
router.post('/', blockController.createBlock);

// Get block by ID
router.get('/:id', blockController.getBlockById);

// Update block
router.put('/:id', blockController.updateBlock);

// Delete block
router.delete('/:id', blockController.deleteBlock);

// Get blocks by committee
router.get('/committee/:committeeId', blockController.getBlocksByCommittee);

module.exports = router;