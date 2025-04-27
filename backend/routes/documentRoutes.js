const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Create a new document
router.post('/', documentController.createDocument);

// Get all documents
router.get('/', documentController.getDocuments);

// Get document by ID
router.get('/:id', documentController.getDocumentById);

// Update document
router.put('/:id', documentController.updateDocument);

// Delete document
router.delete('/:id', documentController.deleteDocument);

// Get documents by committee
router.get('/committee/:id', documentController.getDocumentsByCommittee);

// Get documents by delegate
router.get('/delegate/:id', documentController.getDocumentsByDelegate);

module.exports = router;