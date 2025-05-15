const Document = require('../models/Document');

// Create a new document
exports.createDocument = async (req, res) => {
  try {
    // Map doc_link to file_url for Google Docs links
    if (req.body.doc_link) {
      req.body.file_url = req.body.doc_link;
      // Ensure we're not storing the actual document content
      req.body.content = null;
    }
    
    // Validate Google Docs link
    if (req.body.file_url && !req.body.file_url.includes('docs.google.com')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document link. Please provide a valid Google Docs link.'
      });
    }
    
    // ALWAYS set a due_date regardless of whether it was provided
    // Set due date to 30 days from now by default
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    req.body.due_date = dueDate;
    
    console.log('Creating document with data:', JSON.stringify({
      ...req.body,
      due_date: req.body.due_date
    }, null, 2));
    
    const document = await Document.create(req.body);

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Create document error:', error);
    console.error('Request body:', JSON.stringify(req.body, null, 2));

    // Handle specific errors
    if (error.message.includes('Delegate not found')) {
      return res.status(400).json({
        success: false,
        message: 'Delegate not found',
        error: error.message
      });
    }

    if (error.message.includes('Block not found')) {
      return res.status(400).json({
        success: false,
        message: 'Block not found',
        error: error.message
      });
    }

    if (error.message.includes('Invalid document type') || 
        error.message.includes('Invalid document status')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document parameters',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create document',
      error: error.message
    });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.getById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve document',
      error: error.message
    });
  }
};

// Update document
exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.update(req.params.id, req.body);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Update document error:', error);

    // Handle specific errors
    if (error.message.includes('Block not found')) {
      return res.status(400).json({
        success: false,
        message: 'Block not found',
        error: error.message
      });
    }

    if (error.message.includes('Invalid document status')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document status',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update document',
      error: error.message
    });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    await Document.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
};

// Get documents by committee
exports.getDocumentsByCommittee = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      status: req.query.status
    };

    const documents = await Document.getByCommittee(req.params.id, filters);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Get documents by committee error:', error);
    
    if (error.message.includes('Committee not found')) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve documents',
      error: error.message
    });
  }
};

// Get documents by delegate
exports.getDocumentsByDelegate = async (req, res) => {
  try {
    const documents = await Document.getByDelegate(parseInt(req.params.id));

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Get documents by delegate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve documents',
      error: error.message
    });
  }
};

// Gets all documents (for admin use)
exports.getDocuments = async (req, res) => {
  try {
    // This will be handled by either getByCommittee or getByDelegate
    // depending on the query parameters
    
    if (req.query.committee_id) {
      const filters = {
        type: req.query.type,
        status: req.query.status
      };
      
      const documents = await Document.getByCommittee(req.query.committee_id, filters);
      
      return res.status(200).json({
        success: true,
        count: documents.length,
        data: documents
      });
    }
    
    if (req.query.delegate_id) {
      const filters = {
        type: req.query.type,
        status: req.query.status
      };
      
      const documents = await Document.getByDelegate(req.query.delegate_id, filters);
      
      return res.status(200).json({
        success: true,
        count: documents.length,
        data: documents
      });
    }
    
    // If no specific filters, return an error as we need either committee_id or delegate_id
    return res.status(400).json({
      success: false,
      message: 'Please provide either committee_id or delegate_id as a query parameter'
    });
    
  } catch (error) {
    console.error('Get all documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve documents',
      error: error.message
    });
  }
};

// Change document status
exports.changeDocumentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['draft', 'submitted', 'approved', 'rejected', 'published'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (draft, submitted, approved, rejected, published)'
      });
    }
    
    const document = await Document.changeStatus(req.params.id, status);
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Change document status error:', error);
    
    if (error.message.includes('Invalid status')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to change document status',
      error: error.message
    });
  }
};

// Publish document
exports.publishDocument = async (req, res) => {
  try {
    const document = await Document.publishDocument(req.params.id);
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Publish document error:', error);
    
    if (error.message.includes('Only approved documents') || 
        error.message.includes('needs at least 2 votes')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to publish document',
      error: error.message
    });
  }
};

// Get documents eligible for voting in a committee
exports.getVotingEligibleDocuments = async (req, res) => {
  try {
    const documents = await Document.getVotingEligibleDocuments(req.params.committeeId);
    
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Get voting eligible documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve voting eligible documents',
      error: error.message
    });
  }
};