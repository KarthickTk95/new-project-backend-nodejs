// assetRoutes.js

const express = require('express');
const router = express.Router();
const db = require('./db'); 

router.get('/api/asset', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM project1.asset');
    const assets = result.rows;
    res.json(assets);
  } catch (err) {
    console.error('Error fetching assets', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/api/asset', async (req, res) => {
    try {
        const { serial_number, asset_category_id, make, model, is_active } = req.body;
        const result = await db.query('INSERT INTO project1.asset (serial_number, asset_category_id, make, model, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *', [serial_number, asset_category_id, make, model, is_active]);
      const insertedAsset = result.rows[0];
      res.status(201).json(insertedAsset); 
    } catch (err) {
      console.error('Error inserting asset', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.delete('/api/asset/:id', async (req, res) => {
    const assetId = req.params.id;
    try {
        const result = await db.query('DELETE FROM project1.asset WHERE asset_id = $1 RETURNING *', [assetId]);
        if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      const deletedAsset = result.rows[0];
      res.json(deletedAsset); 
    } catch (err) {
      console.error('Error deleting asset', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.put('/api/asset/:id', async (req, res) => {
    const assetId = req.params.id;
    const { serial_number, asset_category_id, make, model, is_active } = req.body;
    try {
        const result = await db.query('UPDATE project1.asset SET serial_number = $1, asset_category_id = $2, make = $3, model = $4, is_active = $5 WHERE asset_id = $6 RETURNING *', [serial_number, asset_category_id, make, model, is_active, assetId]);
        if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      const updatedAsset = result.rows[0];
      res.json(updatedAsset); 
    } catch (err) {
      console.error('Error updating asset', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
