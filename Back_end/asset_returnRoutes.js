const express = require('express');
const router = express.Router();
const db = require('./db'); 

// GET all asset return records
router.get('/api/assetReturn', async (req, res) => {
    try {
      const assetReturns = await db.query('SELECT * FROM project1.asset_return');
      res.json(assetReturns.rows);
    } catch (err) {
      console.error('Error fetching asset returns', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // GET a specific asset return record by issue_id
  router.get('/api/assetReturn/:issue_id', async (req, res) => {
    const { issue_id } = req.params;
    try {
      const assetReturn = await db.query('SELECT * FROM project1.asset_return WHERE issue_id = $1', [issue_id]);
      if (assetReturn.rows.length === 0) {
        return res.status(404).json({ error: 'Asset return not found' });
      }
      res.json(assetReturn.rows[0]);
    } catch (err) {
      console.error('Error fetching asset return', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // POST create a new asset return record
  router.post('/api/assetReturn', async (req, res) => {
    const { issue_id, return_date, return_reason } = req.body;
    try {
      const newAssetReturn = await db.query(
        'INSERT INTO project1.asset_return (issue_id, return_date, return_reason) VALUES ($1, $2, $3) RETURNING *',
        [issue_id, return_date, return_reason]
      );
      res.status(201).json(newAssetReturn.rows[0]);
    } catch (err) {
      console.error('Error creating asset return', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // PUT update an existing asset return record by issue_id
  router.put('/api/assetReturn/:issue_id', async (req, res) => {
    const { issue_id } = req.params;
    const { return_date, return_reason } = req.body;
    try {
      const updatedAssetReturn = await db.query(
        'UPDATE project1.asset_return SET return_date = $1, return_reason = $2 WHERE issue_id = $3 RETURNING *',
        [return_date, return_reason, issue_id]
      );
      if (updatedAssetReturn.rows.length === 0) {
        return res.status(404).json({ error: 'Asset return not found' });
      }
      res.json(updatedAssetReturn.rows[0]);
    } catch (err) {
      console.error('Error updating asset return', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // DELETE delete an asset return record by issue_id
  router.delete('/api/assetReturn/:issue_id', async (req, res) => {
    const { issue_id } = req.params;
    try {
      const deletedAssetReturn = await db.query('DELETE FROM project1.asset_return WHERE issue_id = $1 RETURNING *', [issue_id]);
      if (deletedAssetReturn.rows.length === 0) {
        return res.status(404).json({ error: 'Asset return not found' });
      }
      res.json(deletedAssetReturn.rows[0]);
    } catch (err) {
      console.error('Error deleting asset return', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;