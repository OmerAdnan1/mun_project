const { sql, poolPromise } = require('../config/db');

class Document {
  // Create a new document
  static async create(documentData) {
    try {
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
      
      // Return the created document
      return this.getById(documentId);
    } catch (error) {
      throw error;
    }
  }

  // Get document by ID
  static async getById(documentId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('document_id', sql.Int, documentId);

      const result = await request.execute('sp_GetDocumentById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Update document
  static async update(documentId, documentData) {
    try {
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
      
      // Return the updated document
      return this.getById(documentId);
    } catch (error) {
      throw error;
    }
  }

  // Delete document
  static async delete(documentId) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('document_id', sql.Int, documentId);

      await request.execute('sp_DeleteDocument');
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get documents by committee
  static async getByCommittee(committeeId, filters = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('committee_id', sql.Int, committeeId);
      request.input('type', sql.VarChar(20), filters.type || null);
      request.input('status', sql.VarChar(10), filters.status || null);

      const result = await request.execute('sp_GetDocumentsByCommittee');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Get documents by delegate
  static async getByDelegate(delegateId, filters = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('delegate_id', sql.Int, delegateId);
      request.input('type', sql.VarChar(20), filters.type || null);
      request.input('status', sql.VarChar(10), filters.status || null);

      const result = await request.execute('sp_GetDocumentsByDelegate');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Document;