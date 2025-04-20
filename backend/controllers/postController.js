const postModel = require('../models/postModel');

class PostController {
  async createPost(req, res) {
    try {
      const { description, adminId, recipients, status, attachmentURL, category } = req.body;
      
      // Validate required fields
      if (!description || !adminId || !recipients || !status || !category) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide all required fields'
        });
      }
      
      // Call model to create post
      const result = await postModel.createPost({
        description,
        adminId,
        recipients,
        status,
        attachmentURL,
        category
      });
      
      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in createPost controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getAllPosts(req, res) {
    try {
      const result = await postModel.getAllPosts();
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in getAllPosts controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getPostById(req, res) {
    try {
      const postId = parseInt(req.params.postId);
      
      if (isNaN(postId)) {
        return res.status(400).json({ success: false, message: 'Invalid post ID' });
      }
      
      const result = await postModel.getPostById(postId);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in getPostById controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async updatePost(req, res) {
    try {
      const postId = parseInt(req.params.postId);
      const { description, recipients, status, attachmentURL, category } = req.body;
      
      if (isNaN(postId)) {
        return res.status(400).json({ success: false, message: 'Invalid post ID' });
      }
      
      // Call model to update post
      const result = await postModel.updatePost(postId, {
        description,
        recipients,
        status,
        attachmentURL,
        category
      });
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in updatePost controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async deletePost(req, res) {
    try {
      const postId = parseInt(req.params.postId);
      
      if (isNaN(postId)) {
        return res.status(400).json({ success: false, message: 'Invalid post ID' });
      }
      
      const result = await postModel.deletePost(postId);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in deletePost controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new PostController();