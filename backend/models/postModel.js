const { sql, pool } = require('../config/db');

class PostModel {
  async createPost(postData) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('Description', sql.VarChar(sql.MAX), postData.description)
        .input('AdminId', sql.Int, postData.adminId)
        .input('Recipients', sql.VarChar(sql.MAX), postData.recipients)
        .input('Status', sql.VarChar(20), postData.status)
        .input('AttachmentURL', sql.VarChar(255), postData.attachmentURL || null)
        .input('Category', sql.VarChar(50), postData.category)
        .query(`
          INSERT INTO Post (CreationDate, Description, AdminId, Recipients, Status, AttachmentURL, Category)
          VALUES (GETDATE(), @Description, @AdminId, @Recipients, @Status, @AttachmentURL, @Category);
          SELECT SCOPE_IDENTITY() AS PostId;
        `);
      
      poolConnection.release();
      
      if (result.recordset && result.recordset[0]) {
        return { 
          success: true, 
          message: 'Post created successfully',
          postId: result.recordset[0].PostId
        };
      } else {
        return { success: false, message: 'Failed to create post' };
      }
    } catch (error) {
      console.error('Error in createPost model:', error);
      return { success: false, message: error.message };
    }
  }

  async getAllPosts() {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .query(`
          SELECT p.*, u.UserName as AdminName
          FROM Post p
          JOIN Admin a ON p.AdminId = a.AdminId
          JOIN [User] u ON a.UserId = u.UserId
          ORDER BY p.CreationDate DESC
        `);
      
      poolConnection.release();
      return { success: true, posts: result.recordset };
    } catch (error) {
      console.error('Error in getAllPosts model:', error);
      return { success: false, message: error.message };
    }
  }

  async getPostById(postId) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('PostId', sql.Int, postId)
        .query(`
          SELECT p.*, u.UserName as AdminName
          FROM Post p
          JOIN Admin a ON p.AdminId = a.AdminId
          JOIN [User] u ON a.UserId = u.UserId
          WHERE p.PostId = @PostId
        `);
      
      poolConnection.release();
      
      if (result.recordset.length > 0) {
        return { success: true, post: result.recordset[0] };
      } else {
        return { success: false, message: 'Post not found' };
      }
    } catch (error) {
      console.error('Error in getPostById model:', error);
      return { success: false, message: error.message };
    }
  }

  async updatePost(postId, postData) {
    try {
      const poolConnection = await pool.connect();
      
      // Build dynamic update query
      let updateFields = [];
      const request = poolConnection.request().input('PostId', sql.Int, postId);
      
      if (postData.description !== undefined) {
        updateFields.push('Description = @Description');
        request.input('Description', sql.VarChar(sql.MAX), postData.description);
      }
      
      if (postData.recipients !== undefined) {
        updateFields.push('Recipients = @Recipients');
        request.input('Recipients', sql.VarChar(sql.MAX), postData.recipients);
      }
      
      if (postData.status !== undefined) {
        updateFields.push('Status = @Status');
        request.input('Status', sql.VarChar(20), postData.status);
      }
      
      if (postData.attachmentURL !== undefined) {
        updateFields.push('AttachmentURL = @AttachmentURL');
        request.input('AttachmentURL', sql.VarChar(255), postData.attachmentURL);
      }
      
      if (postData.category !== undefined) {
        updateFields.push('Category = @Category');
        request.input('Category', sql.VarChar(50), postData.category);
      }
      
      if (updateFields.length === 0) {
        poolConnection.release();
        return { success: false, message: 'No fields to update' };
      }
      
      const updateQuery = `
        UPDATE Post 
        SET ${updateFields.join(', ')}
        WHERE PostId = @PostId;
        
        SELECT @@ROWCOUNT AS RowsAffected;
      `;
      
      const result = await request.query(updateQuery);
      poolConnection.release();
      
      if (result.recordset && result.recordset[0].RowsAffected > 0) {
        return { success: true, message: 'Post updated successfully' };
      } else {
        return { success: false, message: 'Post not found or no changes made' };
      }
    } catch (error) {
      console.error('Error in updatePost model:', error);
      return { success: false, message: error.message };
    }
  }

  async deletePost(postId) {
    try {
      const poolConnection = await pool.connect();
      const result = await poolConnection.request()
        .input('PostId', sql.Int, postId)
        .query(`
          DELETE FROM Post WHERE PostId = @PostId;
          SELECT @@ROWCOUNT AS RowsAffected;
        `);
      
      poolConnection.release();
      
      if (result.recordset && result.recordset[0].RowsAffected > 0) {
        return { success: true, message: 'Post deleted successfully' };
      } else {
        return { success: false, message: 'Post not found' };
      }
    } catch (error) {
      console.error('Error in deletePost model:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new PostModel();