const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors'); // Importing cors
const employeeRoutes = require('./employeeRoutes'); // Import employee routes
const assetRoutes = require('./assetRoutes'); // Import asset routes
const assetIssueRoutes = require ('./assetIssueRoutes');
const asset_returnRoutes = require ('./asset_returnRoutes')

const db = require('./db'); // Import your database connection module


const app = express();
const port = 5000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.use(employeeRoutes); // Use employee routes
app.use(assetRoutes); // Use asset routes
app.use(assetIssueRoutes);
app.use(asset_returnRoutes);







// Connect to PostgreSQL
db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Parse JSON bodies
app.use(bodyParser.json());


// Login endpoint
app.post('/login', async (req, res) => {
  console.log("Starting loging")
  const { userName, password } = req.body;
  const query = `SELECT * FROM userInfo WHERE userName = $1 AND password = $2 AND status = true`;
  const values = [userName, password];

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 1) {
      // Successful login
      res.status(200).send('Login successful');
    } else {
      // Invalid credentials
      res.status(401).send('Invalid username or password');
    }
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Error querying database');
  }
});






//assetCategoryStats

app.get('/api/assetCategoryStats', async (req, res) => {
  try {
    const query = `
      SELECT
      asset_category.category_id,asset_category.category_name,
          COUNT(asset.asset_id) AS total_assets,
          SUM(CASE WHEN asset.is_active THEN 1 ELSE 0 END) AS active_assets
      FROM
      project1.asset_category
      LEFT JOIN
      project1.asset ON asset_category.category_id = asset.asset_category_id
      GROUP BY
      asset_category.category_id,asset_category.category_name order by asset_category.category_id;
    `;
    const result = await db.query(query);
    const assetCategoryStats = result.rows;
    res.json(assetCategoryStats);
  } catch (err) {
    console.error('Error fetching asset category stats', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
