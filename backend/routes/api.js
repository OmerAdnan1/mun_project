const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Get conference data
router.get('/conference', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        title,
        university,
        date,
        venue,
        sg_name as sgName,
        sg_letter as sgLetter
      FROM conference
      WHERE id = 1
    `);
    res.json(result.recordset[0] || {
      title: 'MUN Conference 2024',
      university: 'Your University',
      date: 'March 15-17, 2024',
      venue: 'University Campus',
      sgName: 'Secretary-General',
      sgLetter: 'Welcome to our annual Model United Nations conference...'
    });
  } catch (error) {
    console.error('Error fetching conference data:', error);
    res.status(500).json({ error: 'Failed to fetch conference data' });
  }
});

// Get committees
router.get('/committees', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        name,
        description,
        delegate_count as delegateCount
      FROM committees
      ORDER BY name
    `);
    res.json(result.recordset || [
      {
        name: 'United Nations Security Council',
        description: 'Addressing global security challenges',
        delegateCount: 0
      },
      {
        name: 'United Nations Human Rights Council',
        description: 'Promoting human rights worldwide',
        delegateCount: 0
      }
    ]);
  } catch (error) {
    console.error('Error fetching committees:', error);
    res.status(500).json({ error: 'Failed to fetch committees' });
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as totalDelegates,
        COUNT(DISTINCT committee_id) as totalCommittees
      FROM delegates
    `);
    res.json(result.recordset[0] || {
      totalDelegates: 0,
      totalCommittees: 0
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router; 