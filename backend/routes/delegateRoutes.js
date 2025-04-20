const express = require('express');
const router = express.Router();
const delegateController = require('../controllers/delegateController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes (admin only)
router.get('/', authMiddleware, delegateController.getAllDelegates);
router.get('/:id', authMiddleware, delegateController.getDelegateById);
router.post('/assign-country', authMiddleware, delegateController.assignCountry);
router.post('/assign-block', authMiddleware, delegateController.assignBlock);
router.post('/assign-committee', authMiddleware, delegateController.assignToCommittee);
router.post('/remove-from-committee', authMiddleware, delegateController.removeFromCommittee);
router.get('/without-committee/list', authMiddleware, delegateController.getDelegatesWithoutCommittee);
router.get('/without-countries/list', authMiddleware, delegateController.getDelegatesWithoutCountries);
router.post('/allocate-countries', authMiddleware, delegateController.allocateCountries);
router.get('/available-countries/:committeeId', authMiddleware, delegateController.getAvailableCountries);

module.exports = router;