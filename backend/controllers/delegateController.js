const Delegate = require('../models/delegateModel');

exports.getAllDelegates = async (req, res) => {
  try {
    const delegates = await Delegate.getAllDelegates();
    res.json(delegates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDelegateById = async (req, res) => {
  try {
    const delegateId = req.params.id;
    const delegate = await Delegate.getDelegateById(delegateId);
    
    if (!delegate) {
      return res.status(404).json({ message: 'Delegate not found' });
    }
    
    res.json(delegate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignCountry = async (req, res) => {
  try {
    const { delegateId, countryId } = req.body;
    
    if (!delegateId || !countryId) {
      return res.status(400).json({ message: 'Delegate ID and Country ID are required' });
    }
    
    const result = await Delegate.assignCountry(delegateId, countryId);
    res.json({ 
      message: 'Country assigned to delegate successfully',
      assignment: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignBlock = async (req, res) => {
  try {
    const { delegateId, blockId } = req.body;
    
    if (!delegateId || !blockId) {
      return res.status(400).json({ message: 'Delegate ID and Block ID are required' });
    }
    
    const result = await Delegate.assignBlock(delegateId, blockId);
    res.json({ 
      message: 'Block assigned to delegate successfully',
      assignment: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignToCommittee = async (req, res) => {
  try {
    const { delegateId, committeeId } = req.body;
    
    if (!delegateId || !committeeId) {
      return res.status(400).json({ message: 'Delegate ID and Committee ID are required' });
    }
    
    const result = await Delegate.assignToCommittee(delegateId, committeeId);
    res.json({ 
      message: 'Delegate assigned to committee successfully',
      assignment: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCommittee = async (req, res) => {
  try {
    const { delegateId, committeeId } = req.body;
    
    if (!delegateId || !committeeId) {
      return res.status(400).json({ message: 'Delegate ID and Committee ID are required' });
    }
    
    const result = await Delegate.removeFromCommittee(delegateId, committeeId);
    res.json({ 
      message: 'Delegate removed from committee successfully',
      removal: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDelegatesWithoutCommittee = async (req, res) => {
  try {
    const delegates = await Delegate.getDelegatesWithoutCommittee();
    res.json(delegates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDelegatesWithoutCountries = async (req, res) => {
  try {
    const delegates = await Delegate.getDelegatesWithoutCountries();
    res.json(delegates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.allocateCountries = async (req, res) => {
  try {
    const result = await Delegate.allocateCountries();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableCountries = async (req, res) => {
  try {
    const committeeId = req.params.committeeId;
    const countries = await Delegate.getAvailableCountries(committeeId);
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};