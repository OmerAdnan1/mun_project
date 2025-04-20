const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all committees (public)
router.get('/', committeeController.getAllCommittees);

// Get specific committee (public)
router.get('/:id', committeeController.getCommitteeById);

// Protected routes (admin only)
router.post('/', authMiddleware, committeeController.createCommittee);
router.put('/:id', authMiddleware, committeeController.updateCommittee);
router.delete('/:id', authMiddleware, committeeController.deleteCommittee);
router.post('/assign-chair', authMiddleware, committeeController.assignChair);

module.exports = router;