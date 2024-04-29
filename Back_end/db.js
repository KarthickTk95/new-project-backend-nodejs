// db.js

const { Client } = require('pg');

// Create connection to PostgreSQL database
const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Zan@0987',
  port: 5432, // Default PostgreSQL port
});

module.exports = db;
