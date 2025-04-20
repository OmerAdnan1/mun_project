// controllers/blockController.js
const Block = require('../models/blockModel');

const blockController = {
  getAllBlocks: async (req, res) => {
    try {
      const blocks = await Block.getAllBlocks();
      res.status(200).json(blocks);
    } catch (error) {
      console.error('Error in getAllBlocks controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  getBlockById: async (req, res) => {
    try {
      const { id } = req.params;
      const block = await Block.getBlockById(id);
      
      if (!block) {
        return res.status(404).json({ message: 'Block not found' });
      }
      
      res.status(200).json(block);
    } catch (error) {
      console.error('Error in getBlockById controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  createBlock: async (req, res) => {
    try {
      const { blockName, stance } = req.body;
      
      if (!blockName) {
        return res.status(400).json({ message: 'Block name is required' });
      }
      
      const newBlock = await Block.createBlock({ blockName, stance });
      res.status(201).json({ message: 'Block created successfully', blockId: newBlock.BlockId });
    } catch (error) {
      console.error('Error in createBlock controller:', error);
      
      // Handle unique constraint violation
      if (error.message.includes('unique')) {
        return res.status(400).json({ message: 'Block name must be unique' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  updateBlock: async (req, res) => {
    try {
      const { id } = req.params;
      const { blockName, stance } = req.body;
      
      if (!blockName) {
        return res.status(400).json({ message: 'Block name is required' });
      }
      
      const success = await Block.updateBlock(id, { blockName, stance });
      
      if (!success) {
        return res.status(404).json({ message: 'Block not found or no changes made' });
      }
      
      res.status(200).json({ message: 'Block updated successfully' });
    } catch (error) {
      console.error('Error in updateBlock controller:', error);
      
      // Handle unique constraint violation
      if (error.message.includes('unique')) {
        return res.status(400).json({ message: 'Block name must be unique' });
      }
      
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  deleteBlock: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await Block.deleteBlock(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Block not found or cannot be deleted' });
      }
      
      res.status(200).json({ message: 'Block deleted successfully' });
    } catch (error) {
      console.error('Error in deleteBlock controller:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = blockController;