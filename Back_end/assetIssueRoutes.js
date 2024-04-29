const express = require('express');
const router = express.Router();
const db = require('./db'); 

router.get('/api/assetIssues', async (req, res) => {
    try {
      const query = 'SELECT * FROM project1.asset_issue';
      const result = await db.query(query);
      const assetIssues = result.rows;
      res.json(assetIssues);
    } catch (err) {
      console.error('Error fetching asset issues', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/api/assetIssues', async (req, res) => {
    try {
      const { asset_id, employee_id, issue_date, returned, return_date, return_reason } = req.body;
      const query = 'INSERT INTO project1.asset_issue (asset_id, employee_id, issue_date, returned, return_date, return_reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const result = await db.query(query, [asset_id, employee_id, issue_date, returned, return_date, return_reason]);
      const insertedIssue = result.rows[0];
      res.status(201).json(insertedIssue);
    } catch (err) {
      console.error('Error creating asset issue', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  router.put('/api/assetIssues/:issueId', async (req, res) => {
    const issueId = req.params.issueId;
    try {
      const { asset_id, employee_id, issue_date, returned, return_date, return_reason } = req.body;
      const query = 'UPDATE project1.asset_issue SET asset_id = $1, employee_id = $2, issue_date = $3, returned = $4, return_date = $5, return_reason = $6 WHERE issue_id = $7 RETURNING *';
      const result = await db.query(query, [asset_id, employee_id, issue_date, returned, return_date, return_reason, issueId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Asset issue not found' });
      }
      const updatedIssue = result.rows[0];
      res.json(updatedIssue);
    } catch (err) {
      console.error('Error updating asset issue', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  // router.delete('/api/assetIssues/:asset_id', async (req, res) => {
  //   const asset_id = req.params.asset_id;
  //   try {
  //     const query = 'DELETE FROM project1.asset_issue WHERE asset_id = $1 RETURNING *';
  //     const result = await db.query(query, [asset_id]);
  //     if (result.rowCount === 0) {
  //       return res.status(404).json({ error: 'Asset issue not found' });
  //     }
  //     const deletedIssue = result.rows[0];
  //     res.json(deletedIssue);
  //   } catch (err) {
  //     console.error('Error deleting asset issue', err);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });

  router.delete('/api/assetIssues/:asset_id', async (req, res) => {
    const asset_id = req.params.asset_id;
    try {
      // Manually delete related records in "asset_return" table
      const deleteReturnQuery = 'DELETE FROM project1.asset_return WHERE issue_id IN (SELECT issue_id FROM project1.asset_issue WHERE asset_id = $1)';
      await db.query(deleteReturnQuery, [asset_id]);
      
      // Now delete the asset issue
      const deleteIssueQuery = 'DELETE FROM project1.asset_issue WHERE asset_id = $1 RETURNING *';
      const result = await db.query(deleteIssueQuery, [asset_id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Asset issue not found' });
      }
      
      const deletedIssue = result.rows[0];
      res.json(deletedIssue);
    } catch (err) {
      console.error('Error deleting asset issue', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  

  module.exports = router; 
