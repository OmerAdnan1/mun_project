const { sql, poolPromise } = require('../config/db');

class Document {
  // Create a new document
  static async create(documentData) {
    try {
      console.log('[Document.create] input:', documentData);
      const pool = await poolPromise;
      const request = pool.request();

      request.input('title', sql.VarChar(255), documentData.title);
      request.input('type', sql.VarChar(20), documentData.type);
      request.input('content', sql.Text, documentData.content || null);
      request.input('file_url', sql.VarChar(255), documentData.file_url || null);
      request.input('delegate_id', sql.Int, documentData.delegate_id);
      request.input('block_id', sql.Int, documentData.block_id || null);
      request.input('requires_voting', sql.Bit, documentData.requires_voting !== undefined ? documentData.requires_voting : 1);
      request.input('status', sql.VarChar(10), documentData.status || 'draft');
      request.input('due_date', sql.DateTime, documentData.due_date);
      request.output('document_id', sql.Int);

      const result = await request.execute('sp_CreateDocument');
      const documentId = result.output.document_id;
      console.log('[Document.create] result:', result);
      
      // Return the created document
      return this.getById(documentId);
    } catch (error) {
      console.error('[Document.create] error:', error);
      throw error;
    }
  }

  // Get document by ID
  static async getById(documentId) {
    try {
      console.log('[Document.getById] documentId:', documentId);
      const pool = await poolPromise;
      const request = pool.request();

      request.input('document_id', sql.Int, documentId);

      const result = await request.execute('sp_GetDocumentById');
      console.log('[Document.getById] result:', result);
      return result.recordset[0];
    } catch (error) {
      console.error('[Document.getById] error:', error);
      throw error;
    }
  }

  // Update document
  static async update(documentId, documentData) {
    try {
      console.log('[Document.update] documentId:', documentId, 'documentData:', documentData);
      const pool = await poolPromise;
      const request = pool.request();

      request.input('document_id', sql.Int, documentId);
      request.input('title', sql.VarChar(255), documentData.title || null);
      request.input('content', sql.Text, documentData.content || null);
      request.input('file_url', sql.VarChar(255), documentData.file_url || null);
      request.input('block_id', sql.Int, documentData.block_id || null);
      request.input('requires_voting', sql.Bit, documentData.requires_voting !== undefined ? documentData.requires_voting : null);
      request.input('status', sql.VarChar(10), documentData.status || null);

      await request.execute('sp_UpdateDocument');
      console.log('[Document.update] updated');
      
      // Return the updated document
      return this.getById(documentId);
    } catch (error) {
      console.error('[Document.update] error:', error);
      throw error;
    }
  }

  // Delete document
  static async delete(documentId) {
    try {
      console.log('[Document.delete] documentId:', documentId);
      const pool = await poolPromise;
      const request = pool.request();

      request.input('document_id', sql.Int, documentId);

      await request.execute('sp_DeleteDocument');
      console.log('[Document.delete] deleted');
      return true;
    } catch (error) {
      console.error('[Document.delete] error:', error);
      throw error;
    }
  }

  // Get documents by committee
  static async getByCommittee(committeeId, filters = {}) {
    try {
      console.log('[Document.getByCommittee] committeeId:', committeeId, 'filters:', filters);
      const pool = await poolPromise;
      const request = pool.request();

      request.input('committee_id', sql.Int, committeeId);
      request.input('type', sql.VarChar(20), filters.type || null);
      request.input('status', sql.VarChar(10), filters.status || null);

      const result = await request.execute('sp_GetDocumentsByCommittee');
      console.log('[Document.getByCommittee] result:', result);
      return result.recordset;
    } catch (error) {
      console.error('[Document.getByCommittee] error:', error);
      throw error;
    }
  }

  // Get documents by delegate
  static async getByDelegate(delegateId, filters = {}) {
    try {
      console.log('[Document.getByDelegate] delegateId:', delegateId, 'filters:', filters);
      const pool = await poolPromise;
      const request = pool.request();

      request.input('delegate_id', sql.Int, delegateId);
      request.input('type', sql.VarChar(20), filters.type || null);
      request.input('status', sql.VarChar(10), filters.status || null);

      const result = await request.execute('sp_GetDocumentsByDelegate');
      console.log('[Document.getByDelegate] result:', result);
      return result.recordset;
    } catch (error) {
      console.error('[Document.getByDelegate] error:', error);
      throw error;
    }
  }

  // Change document status
  static async changeStatus(documentId, newStatus) {
    try {
      console.log(`[Document.changeStatus] documentId: ${documentId}, newStatus: ${newStatus}`);
      const pool = await poolPromise;
      const request = pool.request();
      
      request.input('document_id', sql.Int, documentId);
      request.input('new_status', sql.VarChar(10), newStatus);
      
      await request.execute('sp_ChangeDocumentStatus');
      
      // Return the updated document
      return this.getById(documentId);
    } catch (error) {
      console.error('[Document.changeStatus] error:', error);
      throw error;
    }
  }

  // Publish document
  static async publishDocument(documentId) {
    try {
      console.log(`[Document.publishDocument] documentId: ${documentId}`);
      
      // First, check if document meets requirements for publishing
      const document = await this.getById(documentId);
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      if (document.status !== 'approved') {
        throw new Error('Only approved documents can be published');
      }
      
      // Check vote count
      const Vote = require('./Vote');
      const voteCount = await Vote.countVotesForDocument(documentId);
      
      if (voteCount.total_votes < 2) {
        throw new Error('Document needs at least 2 votes to be published');
      }
      
      return this.changeStatus(documentId, 'published');
    } catch (error) {
      console.error('[Document.publishDocument] error:', error);
      throw error;
    }
  }

  // Get documents eligible for voting
  static async getVotingEligibleDocuments(committeeId) {
    try {
      console.log(`[Document.getVotingEligibleDocuments] committeeId: ${committeeId}`);
      const pool = await poolPromise;
      const request = pool.request();

      request.input('committee_id', sql.Int, committeeId);
      
      const result = await request.query(`
        SELECT d.*, u.full_name AS delegate_name, co.name AS country_name, c.name AS committee_name
        FROM Documents d
        JOIN Users u ON d.delegate_id = u.user_id
        JOIN DelegateAssignments da ON d.delegate_id = da.delegate_id
        JOIN Countries co ON da.country_id = co.country_id
        JOIN Committees c ON da.committee_id = c.committee_id
        WHERE da.committee_id = @committee_id 
        AND (d.status = 'submitted' OR d.status = 'approved' OR d.status = 'published')
        AND d.requires_voting = 1
      `);
      
      return result.recordset;
    } catch (error) {
      console.error('[Document.getVotingEligibleDocuments] error:', error);
      throw error;
    }
  }
}

module.exports = Document;