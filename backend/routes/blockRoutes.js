// routes/blockRoutes.js
const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');

// Get all blocks
router.get('/', blockController.getAllBlocks);

// Get block by ID
router.get('/:id', blockController.getBlockById);

// Create new block
router.post('/', blockController.createBlock);

// Update block
router.put('/:id', blockController.updateBlock);

// Delete block
router.delete('/:id', blockController.deleteBlock);

module.exports = router;